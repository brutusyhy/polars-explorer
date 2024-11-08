import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {useAppSelector} from "@/redux/hooks.ts";
import {
    selectCurrentPage,
    selectTotalPage,
} from "@/components/dataexplorer/pagination/paginationSlice.ts";
import NextPage from "@/components/dataexplorer/pagination/NextPage.tsx";
import PreviousPage from "@/components/dataexplorer/pagination/PreviousPage.tsx";


export default function PaginationControl() {
    const currentPage = useAppSelector(selectCurrentPage)
    const totalPage = useAppSelector(selectTotalPage)
    if (totalPage != -1) {
        return (
            <div>
                Current:{currentPage + 1} Total:{totalPage}
                <Pagination>
                    <PaginationContent>
                        <PreviousPage/>
                        <NextPage/>
                    </PaginationContent>
                </Pagination>

            </div>
        )
    } else {
        return <></>
    }

}