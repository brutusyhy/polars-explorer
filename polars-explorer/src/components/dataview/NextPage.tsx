import {useAppSelector} from "@/redux/hooks.ts";
import {selectCurrentPage, selectTotalPage} from "@/components/dataview/paginationSlice.ts";
import {PaginationItem, PaginationNext} from "@/components/ui/pagination.tsx";

export default function NextPage() {
    const currentPage = useAppSelector(selectCurrentPage);
    const totalPage = useAppSelector(selectTotalPage)
    if (currentPage < totalPage) {
        return (
            <PaginationItem>
                <PaginationNext/>
            </PaginationItem>
        );
    } else {
        return <></>
    }
}