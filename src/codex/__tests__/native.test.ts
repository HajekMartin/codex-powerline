import {
    describe,
    expect,
    it
} from 'vitest';

import {
    fromNativeState,
    toNativeRow
} from '../native';

describe('Native status line', () => {
    it('uses Codex’s reported context, costs, and matching quota windows', () => {
        const data = fromNativeState({
            app: { cli_version: '0.171.0' },
            account: {
                rate_limits: [{
                    limit_id: 'codex',
                    primary_limit: { window_minutes: 300, used_percent: 24, resets_at: 123 },
                    secondary_limit: { window_minutes: 10080, used_percent: 57 }
                }]
            },
            thread: {
                id: 'thread-1', workspace: { cwd: '/workspace' },
                model: { id: 'gpt', reasoning_level: 'high' },
                usage: {
                    context: { context_window_size: 100000, used_tokens: 56000, used_percentage: 50 },
                    total: { total_input_tokens: 100, output_tokens: 20, cache_read_input_tokens: 50, cache_write_input_tokens: 25 },
                    cost: { total_cost_usd: 0.25 }
                }
            }
        });

        expect(data).toMatchObject({
            context_window: { current_usage: 56000, used_percentage: 50 },
            rate_limits: { five_hour: { used_percentage: 24, resets_at: 123 }, seven_day: { used_percentage: 57 } },
            codex: { total_tokens: 120, cached_input_tokens: 50 },
            cost: { total_cost_usd: 0.25 }
        });
    });

    it('turns contiguous ANSI colors and background into bounded Codex UI nodes', async () => {
        const result = await toNativeRow('\x1b[1;31;44mCode\x1b[0m', 40);
        expect(JSON.parse(JSON.stringify(result))).toEqual({
            type: 'row', props: { gap: 0 }, children: [{
                type: 'row', props: { gap: 0, background: 'blue' }, children: [
                    { type: 'text', props: { color: 'red', weight: 'bold' }, children: ['Code'] }
                ]
            }]
        });
    });
});
