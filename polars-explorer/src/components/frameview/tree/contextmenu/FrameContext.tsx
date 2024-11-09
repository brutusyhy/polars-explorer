import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx"
import {ViewMap} from "@/Typing.ts";
import FrameTreeItem from "@/components/frameview/tree/FrameTreeItem.tsx";

export default function FrameContext({frameKey, name, views}: { frameKey: number, name: string, views: ViewMap }) {
    // TODO
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <FrameTreeItem frameKey={frameKey} name={name} views={views}/>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Rename Frame</ContextMenuItem>
                <ContextMenuItem>Delete Frame</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>)
}