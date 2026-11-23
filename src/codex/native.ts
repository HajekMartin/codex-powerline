import xterm from '@xterm/headless';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { z } from 'zod';

import type { StatusJSON } from '../types/StatusJSON';
import {
    getConfigPath,
    loadSettings
} from '../utils/config';
import { renderCodexStatus } from '../utils/status-render';
import { getPackageVersion } from '../utils/terminal';

import { codexCommand } from './command';

const URI = 'ui://codex-powerline/footer';
const TOOL = 'codex_powerline';
const META = 'com.openai/codex-statusline-state';

export function launchCodexNative(args: string[]): Promise<number> {
    const entrypoint = process.argv[1];
    if (!entrypoint)
        throw new Error('Could not find the Powerline MCP entry point.');
    const command = codexCommand();
    const serverArgs = [resolve(entrypoint), '--config', resolve(getConfigPath()), 'mcp'];
    const child = spawn(command.file, [...command.args,
        '--enable', 'tui_extensions_statusline',
        '-c', `mcp_servers.${TOOL}.command=${JSON.stringify(process.execPath)}`,
        '-c', `mcp_servers.${TOOL}.args=${JSON.stringify(serverArgs)}`,
        '-c', `tui.status_line_provider={server="${TOOL}",tool="${TOOL}"}`,
        ...args
    ], { stdio: 'inherit' });
    return new Promise((resolveExit, reject) => {
        child.once('error', reject);
        child.once('exit', (code, signal) => { resolveExit(code ?? (signal === 'SIGINT' ? 130 : 1)); });
    });
}

const window = z.object({
    window_minutes: z.number().nullish(),
    used_percent: z.number().optional(),
    resets_at: z.number().nullish()
}).nullish();

const stateSchema = z.object({
    app: z.object({ cli_version: z.string().optional() }).optional(),
    account: z.object({
        rate_limits: z.array(z.object({
            limit_id: z.string(),
            primary_limit: window,
            secondary_limit: window
        })).optional()
    }).optional(),
    thread: z.object({
        id: z.string(),
        name: z.string().nullish(),
        workspace: z.object({ cwd: z.string() }),
        permissions: z.object({
            type: z.string(),
            profile_id: z.string().optional(),
            display_name: z.string().optional()
        }).optional(),
        approval: z.object({ policy: z.string() }).optional(),
        model: z.object({
            id: z.string().optional(),
            display_name: z.string().optional(),
            reasoning_level: z.string().optional(),
            service_tier: z.string().optional()
        }),
        usage: z.object({
            context: z.object({
                context_window_size: z.number().optional(),
                used_tokens: z.number().optional(),
                used_percentage: z.number().optional()
            }),
            total: z.object({
                total_input_tokens: z.number(),
                cache_read_input_tokens: z.number(),
                cache_write_input_tokens: z.number(),
                output_tokens: z.number()
            }).optional(),
            cost: z.object({ total_cost_usd: z.number().optional() }).optional()
        })
    })
});

export function fromNativeState(input: unknown): StatusJSON {
    const { thread, account, app } = stateSchema.parse(input);
    const { model, usage, workspace } = thread;
    const total = usage.total;
    const context = usage.context;
    const quota = account?.rate_limits?.find(limit => limit.limit_id === 'codex');
    const limits: NonNullable<StatusJSON['rate_limits']> = {};
    for (const sample of [quota?.primary_limit, quota?.secondary_limit]) {
        if (!sample)
            continue;
        const period = sample.window_minutes === 300 ? 'five_hour'
            : sample.window_minutes === 10080 ? 'seven_day' : undefined;
        if (period)
            limits[period] = { used_percentage: sample.used_percent, resets_at: sample.resets_at };
    }

    return {
        session_id: thread.id,
        model: { id: model.id, display_name: model.display_name },
        effort: { level: model.reasoning_level },
        fast_mode: model.service_tier === undefined ? undefined : model.service_tier === 'fast',
        version: app?.cli_version,
        cwd: workspace.cwd,
        cost: usage.cost,
        context_window: {
            context_window_size: context.context_window_size,
            current_usage: context.used_tokens,
            used_percentage: context.used_percentage
        },
        rate_limits: limits,
        codex: {
            session_name: thread.name ?? undefined,
            sandbox: thread.permissions?.type === 'disabled' ? 'dangerFullAccess' : thread.permissions?.type,
            permission_profile: thread.permissions?.profile_id,
            permission_display_name: thread.permissions?.display_name,
            approval_policy: thread.approval?.policy,
            total_tokens: total ? total.total_input_tokens + total.output_tokens : undefined,
            input_tokens: total?.total_input_tokens,
            output_tokens: total?.output_tokens,
            cached_input_tokens: total?.cache_read_input_tokens,
            cache_write_input_tokens: total?.cache_write_input_tokens
        }
    };
}

interface TextProps { color?: string; weight?: 'bold'; italic?: boolean; underline?: boolean }
interface TextNode { type: 'text'; props: TextProps; children: [string] }
interface RowNode { type: 'row'; props: { gap: 0; background?: string }; children: (RowNode | TextNode)[] }

const named = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
const bright = ['#808080', '#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff', '#ffffff'];

function color(mode: number, value: number): string | undefined {
    if (mode === 0)
        return undefined;
    const hex = (rgb: number) => '#' + rgb.toString(16).padStart(6, '0');
    if (mode === 0x3000000)
        return hex(value);
    if (value < 8)
        return named[value];
    if (value < 16)
        return bright[value - 8];
    if (value >= 232)
        return hex((8 + (value - 232) * 10) * 0x010101);
    const cube = value - 16;
    const channel = (level: number) => level === 0 ? 0 : 55 + level * 40;
    return hex((channel(Math.floor(cube / 36)) << 16) | (channel(Math.floor(cube / 6) % 6) << 8) | channel(cube % 6));
}

export async function toNativeRow(line: string, width: number): Promise<RowNode> {
    const screen = new xterm.Terminal({ cols: width, rows: 1, allowProposedApi: true });
    try {
        await new Promise<void>((resolve) => { screen.write(line, resolve); });
        const row: RowNode = { type: 'row', props: { gap: 0 }, children: [] };
        const buffer = screen.buffer.active.getLine(0);
        const visible = buffer?.translateToString(true);
        if (!visible)
            return row;

        let run: TextNode | undefined;
        let previous: string | undefined;
        let budget = 255;
        for (let col = 0; col < screen.cols && budget > 2; col++) {
            const cell = buffer?.getCell(col);
            if (!cell?.getWidth())
                continue;
            const fg = color(cell.getFgColorMode(), cell.getFgColor());
            const bg = color(cell.getBgColorMode(), cell.getBgColor());
            const background = cell.isInverse() ? fg : bg;
            const props: TextProps = {
                color: cell.isInverse() ? bg : fg,
                weight: cell.isBold() ? 'bold' : undefined,
                italic: cell.isItalic() ? true : undefined,
                underline: cell.isUnderline() ? true : undefined
            };
            const chars = cell.getChars();
            if (!chars && !background && col >= screen.buffer.active.cursorX)
                break;
            const key = JSON.stringify([props, background]);
            if (!run || previous !== key) {
                previous = key;
                run = { type: 'text', props, children: [''] };
                row.children.push(background ? { type: 'row', props: { gap: 0, background }, children: [run] } : run);
                budget -= background ? 3 : 2;
            }
            run.children[0] += chars || ' ';
        }
        return row;
    } finally {
        screen.dispose();
    }
}

const requestSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    method: z.string(),
    params: z.object({
        protocolVersion: z.string().optional(),
        uri: z.string().optional(),
        _meta: z.record(z.string(), z.unknown()).optional()
    }).optional()
});

export async function serveNative(): Promise<void> {
    const settings = await loadSettings();
    const width = Math.min(512, Math.max(20, Number(process.env.CODEX_POWERLINE_WIDTH) || 100));
    const lines = createInterface({ input: process.stdin });
    for await (const line of lines) {
        let request: z.infer<typeof requestSchema>;
        try {
            request = requestSchema.parse(JSON.parse(line));
        } catch {
            continue;
        }
        const { id, method, params } = request;
        if (id === undefined)
            continue;
        const reply = (result: unknown) => { console.log(JSON.stringify({ jsonrpc: '2.0', id, result })); };
        const error = (code: number, message: string) => { console.log(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } })); };
        switch (method) {
            case 'initialize':
                reply({
                    protocolVersion: params?.protocolVersion ?? '2025-06-18',
                    serverInfo: { name: 'codex-powerline', version: getPackageVersion() },
                    capabilities: { tools: {}, resources: {} }
                });
                break;
            case 'ping': reply({}); break;
            case 'tools/list':
                reply({
                    tools: [{
                        name: TOOL, title: 'Codex Powerline', description: 'Advertises the Powerline terminal status line.',
                        inputSchema: { type: 'object' }, annotations: { readOnlyHint: true },
                        _meta: { 'openai/ui': { entrypoints: [{ type: 'statusline', resourceUri: URI }] } }
                    }]
                });
                break;
            case 'resources/list': reply({ resources: [{ uri: URI, name: 'Codex Powerline', mimeType: 'application/json' }] }); break;
            case 'resources/templates/list': reply({ resourceTemplates: [] }); break;
            case 'resources/read': {
                if (params?.uri !== URI) {
                    error(-32602, 'Unknown resource');
                    break;
                }
                try {
                    const state = fromNativeState(params._meta?.[META]);
                    const [rendered] = renderCodexStatus(state, settings, width);
                    const tree = rendered ? await toNativeRow(rendered, width) : null;
                    reply({ contents: [{ uri: URI, mimeType: 'application/json', text: JSON.stringify(tree) }] });
                } catch {
                    error(-32602, 'Expected a valid Codex status line snapshot');
                }
                break;
            }
            default: error(-32601, 'Method not found');
        }
    }
}
