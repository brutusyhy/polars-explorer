import {useAppSelector} from "@/redux/hooks.ts";
import {selectPageSize} from "@/redux/slices/paginationSlice.ts";
import {selectOpenedFrameViewKey} from "@/redux/slices/frameViewSlice.ts";
import {select_columns} from "@/services/commands.ts";

export default function ApplyFilter({columns}: { columns: string[] }) {
    const pageSize = useAppSelector(selectPageSize);
    return <button className="btn" onClick={
        async () => {
            await select_columns({
                pageSize,
                columns
            })
        }
    }>Apply</button>
}