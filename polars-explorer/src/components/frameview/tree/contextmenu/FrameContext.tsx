import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx"
import {ViewMap} from "@/Typing.ts";
import FrameTreeItem from "@/components/frameview/tree/FrameTreeItem.tsx";
import {delete_frame, rename_frame} from "@/services/commands.ts";
import {useAppSelector} from "@/redux/hooks.ts";
import {selectOpenedFrameViewKey} from "@/redux/slices/frameViewSlice.ts";

export default function FrameContext({frameKey, name, views}: { frameKey: number, name: string, views: ViewMap }) {
    const currentFrameKey = useAppSelector(selectOpenedFrameViewKey)[0]
    // TODO
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <FrameTreeItem frameKey={frameKey} name={name} views={views}/>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={
                    async () => {
                        let newName = prompt("New name for this frame:")
                        while (!newName.trim()) {
                            newName = prompt("Please enter a non-empty name:")
                        }
                        await rename_frame({
                            frameKey,
                            name: newName
                        })
                    }
                }>Rename Frame</ContextMenuItem>
                <ContextMenuItem onClick={
                    async () => {
                        await delete_frame({
                            frameKeyToDelete: frameKey,
                            currentFrameKey
                        })
                    }}>Delete Frame</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>)
}