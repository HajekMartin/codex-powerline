import {
    describe,
    expect,
    it
} from 'vitest';

import { CodexTelemetry } from '../telemetry';

describe('Codex telemetry', () => {
    it('tracks the active TUI thread and keeps counters from other threads separate', () => {
        const telemetry = new CodexTelemetry('/default');
        telemetry.request(JSON.stringify({ id: 1, method: 'thread/start' }));
        telemetry.request(JSON.stringify({ id: 2, method: 'thread/resume', params: { threadId: 'visible' } }));
        telemetry.response(JSON.stringify({ id: 2, result: { thread: { id: 'visible', cwd: '/project' }, model: 'gpt' } }));
        telemetry.response(JSON.stringify({ id: 1, result: { thread: { id: 'background', cwd: '/other' }, model: 'other' } }));
        const usage = (threadId: string, totalTokens: number) => JSON.stringify({
            method: 'thread/tokenUsage/updated',
            params: { threadId, tokenUsage: { total: { totalTokens }, last: { totalTokens: 25 }, modelContextWindow: 100 } }
        });
        telemetry.response(usage('visible', 400));
        telemetry.response(usage('background', 900));

        expect(telemetry.snapshot()).toMatchObject({
            session_id: 'visible', model: 'gpt', cwd: '/project',
            codex: { total_tokens: 400 },
            context_window: { current_usage: 25, used_percentage: 25, remaining_percentage: 75 }
        });
    });

    it('does not use a model-specific quota or a different time window as the Codex account quota', () => {
        const telemetry = new CodexTelemetry('/project');
        const update = (limitId: string, usedPercent: number, windowDurationMins: number) => JSON.stringify({
            method: 'account/rateLimits/updated',
            params: { rateLimits: { limitId, primary: { usedPercent, windowDurationMins } } }
        });
        telemetry.response(update('codex', 18, 300));
        telemetry.response(update('other', 99, 300));
        expect(telemetry.snapshot().rate_limits).toEqual({ five_hour: { used_percentage: 18, resets_at: undefined } });

        telemetry.response(update('codex', 50, 60));
        expect(telemetry.snapshot().rate_limits).toEqual({});
    });

    it('tracks the selected ChatGPT workspace and ignores an account reply from before a switch', () => {
        const telemetry = new CodexTelemetry('/project');
        const read = (id: number) => {
            telemetry.request(JSON.stringify({ id, method: 'account/read' }));
        };
        const reply = (id: number, workspaceName: string | null) => {
            telemetry.response(JSON.stringify({ id, result: { account: { type: 'chatgpt', planType: 'business', workspaceName } } }));
        };
        const workspace = () => telemetry.snapshot().codex?.account_workspace_name;

        read(1);
        reply(1, 'Example Company');
        expect(workspace()).toBe('Example Company');

        read(2);
        telemetry.response(JSON.stringify({ method: 'account/updated', params: { authMode: 'chatgpt', reason: 'workspaceRoutingReady' } }));
        expect(workspace()).toBe('Example Company');

        telemetry.response(JSON.stringify({ method: 'account/updated', params: { authMode: 'chatgpt' } }));
        reply(2, 'Example Company');
        expect(workspace()).toBeUndefined();

        read(3);
        reply(3, 'Another Company');
        expect(workspace()).toBe('Another Company');

        read(4);
        reply(4, null);
        expect(workspace()).toBeUndefined();
    });

    it('tracks confirmed permissions per thread and clears the old profile when the sandbox changes', () => {
        const telemetry = new CodexTelemetry('/project');
        telemetry.request(JSON.stringify({ id: 1, method: 'thread/start' }));
        telemetry.response(JSON.stringify({
            id: 1,
            result: {
                thread: { id: 'visible' }, sandbox: { type: 'workspaceWrite' },
                activePermissionProfile: { id: ':workspace' }, approvalPolicy: 'on-request'
            }
        }));
        const update = (threadId: string) => {
            telemetry.response(JSON.stringify({
                method: 'thread/settings/updated',
                params: {
                    threadId,
                    threadSettings: { sandboxPolicy: { type: 'readOnly' }, activePermissionProfile: null, approvalPolicy: { granular: {} } }
                }
            }));
        };

        update('background');
        expect(telemetry.snapshot().codex).toMatchObject({
            sandbox: 'workspaceWrite',
            permission_profile: ':workspace',
            approval_policy: 'on-request'
        });
        update('visible');
        expect(telemetry.snapshot().codex).toMatchObject({
            sandbox: 'readOnly',
            permission_profile: undefined,
            approval_policy: 'granular'
        });
    });
});
