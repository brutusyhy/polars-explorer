import {TreeItem} from "@mui/x-tree-view/TreeItem";

export default function FrameView({frameKey, viewKey, name}: { frameKey: string, viewKey: string, name: string }) {
    return <TreeItem itemId={`${frameKey}-${viewKey}`} label={name}/>
}