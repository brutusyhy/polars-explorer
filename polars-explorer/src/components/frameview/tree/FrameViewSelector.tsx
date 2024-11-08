import {TreeItem} from '@mui/x-tree-view/TreeItem';
import {ViewMap} from "@/Typing.ts";
import FrameView from "@/components/frameview/tree/FrameView.tsx";

export default function FrameViewSelector({frameKey, name, views}: { frameKey: number, name: string, views: ViewMap }) {
    return (
        <TreeItem key={frameKey.toString()} itemId={frameKey.toString()} label={name}>
            {Object.entries(views).map(
                entry => <FrameView
                    key={entry[1].key}
                    frameKey={frameKey}
                    viewKey={entry[1].key}
                    name={entry[1].name}/>
            )}
        </TreeItem>
    )
}