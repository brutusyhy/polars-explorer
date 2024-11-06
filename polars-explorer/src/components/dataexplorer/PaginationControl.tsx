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
    selectPageSize,
    selectTotalPage,
} from "@/components/dataexplorer/pagination/paginationSlice.ts";
import NextPage from "@/components/dataexplorer/pagination/NextPage.tsx";
import PreviousPage from "@/components/dataexplorer/pagination/PreviousPage.tsx";


export default function PaginationControl() {
    const currentPage = useAppSelector(selectCurrentPage)
    const totalPage = useAppSelector(selectTotalPage)
    const pageSize = useAppSelector(selectPageSize)

    return (
        <div>
            Current:{currentPage + 1} Total:{totalPage + 1}
            <Pagination>
                <PaginationContent>
                    <PreviousPage/>
                    <NextPage/>
                    <PaginationItem>
                        <input/>/ Total Pages
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </div>

    )
}