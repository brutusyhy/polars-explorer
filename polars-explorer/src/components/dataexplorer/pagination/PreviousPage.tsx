import {useAppSelector} from "@/redux/hooks.ts";
import {selectCurrentPage} from "@/components/dataexplorer/pagination/paginationSlice.ts";
import {PaginationItem, PaginationPrevious} from "@/components/ui/pagination.tsx";

export default function PreviousPage() {
    const currentPage = useAppSelector(selectCurrentPage);

    if (currentPage >= 1) {
        return (
            <PaginationItem>
                <PaginationPrevious/>
            </PaginationItem>
        );
    } else {
        return <></>
    }
}