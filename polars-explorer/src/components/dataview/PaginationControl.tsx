import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {PaginationInstance} from "@tanstack/react-table";
import {PageInfo} from "@/Typing.ts";


export default function PaginationControl() {
    /* TODO */
    return (
        <div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext/>
                    </PaginationItem>
                    <PaginationItem>
                        <input/>/ Total Pages
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </div>

    )
}