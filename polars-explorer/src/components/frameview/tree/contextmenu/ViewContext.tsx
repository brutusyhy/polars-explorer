import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx"
import ViewTreeItem from "@/components/frameview/tree/ViewTreeItem.tsx";
import {delete_view, rename_frame, rename_view} from "@/services/commands.ts";
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
                <ContextMenuItem>Turn Into Frame</ContextMenuItem>
                <ContextMenuItem>Export</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )

}