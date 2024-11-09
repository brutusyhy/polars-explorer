import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx"
import ViewTreeItem from "@/components/frameview/tree/ViewTreeItem.tsx";

export default function ViewContext({frameKey, viewKey, name}: { frameKey: number, viewKey: number, name: string }) {
    // TODO: Implement functionalities
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <ViewTreeItem frameKey={frameKey} viewKey={viewKey} name={name}/>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Rename View</ContextMenuItem>
                <ContextMenuItem>Delete View</ContextMenuItem>
                <ContextMenuItem>Turn Into Frame</ContextMenuItem>
                <ContextMenuItem>Export</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )

}