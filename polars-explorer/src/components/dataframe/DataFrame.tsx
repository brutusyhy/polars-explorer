import {TreeItem} from '@mui/x-tree-view/TreeItem';
import {ViewMap} from "@/Typing.ts";
import FrameView from "@/components/dataframe/FrameView.tsx";

export default function DataFrame({frameKey, name, views}: { frameKey: string, name: string, views: ViewMap }) {
    return (
        <TreeItem itemId={frameKey} label={name}>
            {Object.entries(views).map(
                entry => <FrameView viewKey={entry[1].key.toString()} name={entry[1].name}/>
            )}
        </TreeItem>
    )
}