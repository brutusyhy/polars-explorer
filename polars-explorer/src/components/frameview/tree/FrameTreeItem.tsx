import {TreeItem} from '@mui/x-tree-view/TreeItem';
import {ViewMap} from "@/Typing.ts";
import ViewContext from "@/components/frameview/tree/contextmenu/ViewContext.tsx";

export default function FrameTreeItem({frameKey, name, views}: { frameKey: number, name: string, views: ViewMap }) {
    return (
        <TreeItem key={frameKey.toString()} itemId={frameKey.toString()} label={name}>
            {Object.entries(views).map(
                entry => <ViewContext
                    key={entry[1].key}
                    frameKey={frameKey}
                    viewKey={entry[1].key}
                    name={entry[1].name}/>
            )}
        </TreeItem>
    )
}