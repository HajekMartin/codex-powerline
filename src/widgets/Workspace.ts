import {
    posix,
    win32
} from 'node:path';

import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

import { formatRawOrLabeledValue } from './shared/raw-or-labeled';

const LABEL = 'Workspace: ';

export class WorkspaceWidget implements Widget {
    getDefaultColor(): string { return 'cyan'; }
    getDescription(): string { return 'Shows the local project folder name, or the working folder name if no project is reported'; }
    getDisplayName(): string { return 'Workspace'; }
    getCategory(): string { return 'Session'; }
    getLabelPrefix(): string { return LABEL; }
    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName() };
    }

    render(item: WidgetItem, context: RenderContext, settings: Settings): string | null {
        if (context.isPreview) {
            return formatRawOrLabeledValue(item, this.getLabelPrefix(), 'my-project');
        }

        const data = context.data;
        const directory = [data?.workspace?.project_dir, data?.cwd, data?.workspace?.current_dir]
            .find(path => path?.trim());
        if (!directory) {
            return null;
        }

        const path = directory.startsWith('/') ? posix : win32;
        const name = path.basename(directory) || directory;
        return formatRawOrLabeledValue(item, this.getLabelPrefix(), name);
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(item: WidgetItem): boolean { return true; }
}
