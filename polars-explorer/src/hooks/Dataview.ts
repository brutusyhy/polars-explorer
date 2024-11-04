import {useState, useEffect} from "react";
import {TableData, Pagination} from "@/Typing.ts";

export function useDataview() {
    const [data, setData] = useState<TableData>([]);
    const [pagination, setPagination] = useState<Pagination>({
        pageSize: 10,
        currentPage: 0,
        totalPages: 0,
    })

    function updatePagination({pageSize, currentPage, totalPages}: Pagination) {
        // Updating Pagination should trigger a re-rendering of other elements
        // It should also initiate a new query

    }

    return {data, setData, pagination, setPagination, updatePagination}
}