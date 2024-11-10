import {useAppSelector} from "@/redux/hooks.ts";
import {
    selectCurrentPage,
    selectPageSize,
    selectTotalPage
} from "@/redux/slices/paginationSlice.ts";
import {PaginationItem, PaginationNext} from "@/components/ui/pagination.tsx";
import {turn_page} from "@/services/commands.ts";
import {selectOpenedFrameViewKey} from "@/redux/slices/frameViewSlice.ts";

export default function NextPage() {
    const currentPage = useAppSelector(selectCurrentPage);
    const pageSize = useAppSelector(selectPageSize);
    const totalPage = useAppSelector(selectTotalPage);
    const [frameKey, viewKey] = useAppSelector(selectOpenedFrameViewKey)

    if (currentPage + 1 < totalPage) {
        return (
            <PaginationItem>
                <PaginationNext onClick={async () => {
                    await turn_page({frameKey, viewKey, page: currentPage + 1, pageSize});
                }} className="btn"/>
            </PaginationItem>
        );
    } else {
        return <></>
    }
}