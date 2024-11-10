import {useAppSelector} from "@/redux/hooks.ts";
import {selectOpenedFrameViewKey} from "@/redux/slices/frameViewSlice.ts";
import {selectPageSize} from "@/redux/slices/paginationSlice.ts";
import {turn_page} from "@/services/commands.ts";

export default function TurnPage({page}: { page: number }) {
    const pageSize = useAppSelector(selectPageSize);
    return (<button className="btn rounded-none" onClick={async () => {
        await turn_page({page, pageSize})
    }}>To Page</button>)
}