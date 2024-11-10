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
} from "@/redux/slices/paginationSlice.ts";
import NextPage from "@/components/dataexplorer/pagination/NextPage.tsx";
import PreviousPage from "@/components/dataexplorer/pagination/PreviousPage.tsx";
import {Baby} from "lucide-react";
import {useState} from "react";
import {turn_page} from "@/services/commands.ts";
import TurnPage from "@/components/dataexplorer/pagination/TurnPage.tsx";


export default function PaginationControl() {
    const currentPage = useAppSelector(selectCurrentPage)
    const totalPage = useAppSelector(selectTotalPage)
    // targetPage and currentPage are 0-indexed
    const [targetPage, setTargetPage] = useState(currentPage)

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputPage = parseInt(e.target.value)
        console.log(inputPage)
        if (inputPage > totalPage) {
            setTargetPage(totalPage - 1)
            e.target.value = totalPage.toString()
        } else if (inputPage < 1) {
            setTargetPage(0)
            e.target.value = "1"
        } else {
            setTargetPage(inputPage - 1)
            e.target.value = inputPage.toString()
        }

    }


    if (totalPage != -1) {
        return (
            <div>
                <p>Current:{currentPage + 1} Total:{totalPage}</p>
                <Pagination>
                    <PaginationContent>
                        <PreviousPage/>
                        <NextPage/>
                    </PaginationContent>
                    <input type="number" className="input-primary text-right" defaultValue={currentPage + 1}
                           onChange={handleInput}/>

                    <TurnPage page={targetPage}/>
                </Pagination>

            </div>
        )
    } else {
        return <></>
    }

}