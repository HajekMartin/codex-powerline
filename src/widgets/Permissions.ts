import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

import { formatRawOrLabeledValue } from './shared/raw-or-labeled';

const LABEL = 'Permissions: ';
const PROFILE_LABELS = new Map([
    [':read-only', 'Read Only'],
    [':workspace', 'Workspace Write']
]);
const SANDBOX_LABELS = new Map([
    ['readOnly', 'Read Only'],
    ['workspaceWrite', 'Workspace Write'],
    ['dangerFullAccess', 'Full Access'],
    ['managed', 'Managed Sandbox'],
    ['external', 'External Sandbox'],
    ['externalSandbox', 'External Sandbox']
]);

export class PermissionsWidget implements Widget {
    getDefaultColor(): string { return 'green'; }
    getDescription(): string { return 'Shows the active Codex permission profile or sandbox mode, and its approval policy'; }
    getDisplayName(): string { return 'Permissions'; }
    getCategory(): string { return 'Core'; }
    getLabelPrefix(): string { return LABEL; }
    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName() };
    }

    render(item: WidgetItem, context: RenderContext, settings: Settings): string | null {
        if (context.isPreview) {
            return formatRawOrLabeledValue(item, this.getLabelPrefix(), 'Workspace Write (approval: on-request)');
        }

        const codex = context.data?.codex;
        const profile = codex?.permission_profile?.trim();
        const displayName = codex?.permission_display_name?.trim();
        const sandbox = codex?.sandbox?.trim();
        const profileName = profile ? PROFILE_LABELS.get(profile) ?? profile : undefined;
        const sandboxName = sandbox ? SANDBOX_LABELS.get(sandbox) ?? sandbox : undefined;
        const mode = [displayName, profileName, sandboxName].find(Boolean);
        const approval = codex?.approval_policy?.trim();
        const approvalText = approval ? `approval: ${approval}` : '';
        const value = mode && approvalText ? `${mode} (${approvalText})` : mode ?? approvalText;
        return value ? formatRawOrLabeledValue(item, this.getLabelPrefix(), value) : null;
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(item: WidgetItem): boolean { return true; }
}
