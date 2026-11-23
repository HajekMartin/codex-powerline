import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it
} from 'vitest';

import type { RenderContext } from '../../types/RenderContext';
import { DEFAULT_SETTINGS } from '../../types/Settings';
import type { WidgetItem } from '../../types/Widget';
import { clearGitCache } from '../../utils/git';
import { getWidget } from '../../utils/widgets';
import { GitAccountWidget } from '../GitAccount';

const widget = new GitAccountWidget();
const item: WidgetItem = { id: 'account', type: 'git-account' };

// Run against real Git with isolated configuration: neither read nor modify
// the developer's account settings.
describe('Git Account', () => {
    let directory: string;
    let repository: string;
    let context: RenderContext;
    let originalEnv: NodeJS.ProcessEnv;

    function git(...args: string[]): string {
        return execFileSync('git', args, { cwd: repository, encoding: 'utf8' });
    }

    beforeEach(() => {
        originalEnv = { ...process.env };
        directory = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'powerline-git-account-')));
        repository = path.join(directory, 'repo');
        fs.mkdirSync(repository);
        process.env = Object.fromEntries(Object.entries(originalEnv).filter(([key]) => !key.startsWith('GIT_')));
        process.env.GIT_CONFIG_NOSYSTEM = '1';
        process.env.GIT_CONFIG_GLOBAL = path.join(directory, 'gitconfig');
        process.env.CODEX_HOME = path.join(directory, 'codex');
        fs.writeFileSync(process.env.GIT_CONFIG_GLOBAL, '');
        git('init', '--quiet');
        context = { data: { cwd: repository } };
        clearGitCache();
    });

    afterEach(() => {
        process.env = originalEnv;
        clearGitCache();
        fs.rmSync(directory, { recursive: true, force: true });
    });

    it('is registered with a static preview and raw value support', () => {
        expect(getWidget('git-account')).toBeInstanceOf(GitAccountWidget);
        // Even an invalid directory must not be read for the preview.
        expect(widget.render(item, { isPreview: true, data: { cwd: '/missing' } }, DEFAULT_SETTINGS)).toBe('Git: you@work.com');
        expect(widget.render({ ...item, rawValue: true }, { isPreview: true }, DEFAULT_SETTINGS)).toBe('you@work.com');
    });

    it('uses the repository email ahead of the global personal account', () => {
        git('config', '--global', 'user.email', 'personal@example.com');
        git('config', '--local', 'user.email', 'work@example.com');
        git('remote', 'add', 'origin', 'git@github.com:someone-else/repo.git');
        expect(widget.render(item, context, DEFAULT_SETTINGS)).toBe('Git: work@example.com');
        expect(widget.render({ ...item, rawValue: true }, context, DEFAULT_SETTINGS)).toBe('work@example.com');
        expect(widget.render({ ...item, metadata: { label: 'Account: ' } }, context, DEFAULT_SETTINGS)).toBe('Account: work@example.com');
    });

    it('resolves conditional includes for the active project', () => {
        const includedConfig = path.join(directory, 'work.gitconfig');
        fs.writeFileSync(includedConfig, '[user]\n email = included@work.com\n');
        git('config', '--global', 'user.email', 'personal@example.com');
        git('config', '--global', `includeIf.gitdir:${repository}/.git.path`, includedConfig);
        expect(widget.render(item, context, DEFAULT_SETTINGS)).toBe('Git: included@work.com');
    });

    it('falls back to the configured name when email is missing', () => {
        git('config', 'user.name', 'Work Account');
        expect(widget.render(item, context, DEFAULT_SETTINGS)).toBe('Git: Work Account');
    });

    it('hides an unknown identity and respects no-git hiding', () => {
        expect(widget.render(item, context, DEFAULT_SETTINGS)).toBeNull();
        const outside = { data: { cwd: directory } };
        expect(widget.render(item, outside, DEFAULT_SETTINGS)).toBe('(no git)');
        expect(widget.render({ ...item, metadata: { hide: 'no-git' } }, outside, DEFAULT_SETTINGS)).toBeNull();
    });
});
