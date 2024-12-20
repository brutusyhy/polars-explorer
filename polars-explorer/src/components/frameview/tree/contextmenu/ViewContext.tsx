import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx"
import ViewTreeItem from "@/components/frameview/tree/ViewTreeItem.tsx";
import {delete_view, export_view, rename_frame, rename_view, turn_view_into_frame} from "@/services/commands.ts";
import RenameDialog from "@/components/frameview/tree/contextmenu/RenameDialog.ts";

export default function ViewContext({frameKey, viewKey, name}: { frameKey: number, viewKey: number, name: string }) {
    // TODO: Implement functionalities
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <ViewTreeItem frameKey={frameKey} viewKey={viewKey} name={name}/>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={
                    async () => {
                        const newName = RenameDialog("view");
                        await rename_view({
                            frameKey,
                            viewKey,
                            name: newName
                        })
                    }
                }>Rename View</ContextMenuItem>
                <ContextMenuItem onClick={
                    async () => {
                        // Cannot delete base view
                        if (viewKey === 0) {
                            alert("Cannot delete base view");
                        } else {
                            await delete_view({frameKey, viewKey});
                        }
                    }
                }>Delete View</ContextMenuItem>
                <ContextMenuItem onClick={
                    async () => {
                        if (viewKey === 0) {
                            alert("Cannot turn a base view into a new frame");
                        } else {
                            await turn_view_into_frame({frameKey, viewKey});
                        }
                    }
                }>Turn Into Frame</ContextMenuItem>
                <ContextMenuItem onClick={
                    async () => {
                        await export_view({frameKey, viewKey})
                    }
                }
                >Export</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )

}