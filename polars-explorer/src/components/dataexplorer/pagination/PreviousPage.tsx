import {useAppSelector} from "@/redux/hooks.ts";
import {
    selectCurrentPage,
    selectPageSize,
} from "@/redux/slices/paginationSlice.ts";
import {PaginationItem, PaginationPrevious} from "@/components/ui/pagination.tsx";
import {selectOpenedFrameViewKey} from "@/redux/slices/frameViewSlice.ts";
import {turn_page} from "@/services/commands.ts";

export default function PreviousPage() {
    const currentPage = useAppSelector(selectCurrentPage);
    const pageSize = useAppSelector(selectPageSize);
    const [frameKey, viewKey] = useAppSelector(selectOpenedFrameViewKey);

    if (currentPage >= 1) {
        return (
            <PaginationItem>
                <PaginationPrevious onClick={async () => {
                    await turn_page({frameKey, viewKey, page: currentPage - 1, pageSize});
                }} className="btn"/>
            </PaginationItem>
        );
    } else {
        return <></>
    }
}