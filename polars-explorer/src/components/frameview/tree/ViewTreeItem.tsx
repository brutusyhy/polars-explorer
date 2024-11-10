import {TreeItem} from "@mui/x-tree-view/TreeItem";
import {switch_view} from "@/services/commands.ts";
import {useAppSelector} from "@/redux/hooks.ts";
import {selectPageSize} from "@/redux/slices/paginationSlice.ts";

export default function ViewTreeItem({frameKey, viewKey, name}: { frameKey: number, viewKey: number, name: string }) {
    const pageSize = useAppSelector(selectPageSize);
    return <TreeItem
        onClick={async () => {
            await switch_view({frameKey, viewKey, pageSize})
        }}
        itemId={`${frameKey}-${viewKey}`}
        label={name}/>
}