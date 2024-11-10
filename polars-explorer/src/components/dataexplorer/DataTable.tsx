import DataCell from "@/components/dataexplorer/datatable/DataCell.tsx";
import DataHeader from "@/components/dataexplorer/datatable/DataHeader.tsx";
import {TableData} from "@/Typing.ts";
import {useAppSelector} from "@/redux/hooks.ts";
import {selectData} from "@/redux/slices/dataTableSlice.ts";
import {selectCurrentPage, selectPageSize} from "@/redux/slices/paginationSlice.ts";


export default function DataTable() {
    const columns: TableData = useAppSelector(selectData);
    const currentPage = useAppSelector(selectCurrentPage);
    const pageSize = useAppSelector(selectPageSize);
    if (columns.length == 0) {
        return <></>;
    }
    return (

        <div className="DataContainer">
            {/* We use Vanilla HTML table since we have custom logic for data view operations*/}
            <table className="DataTable table table-xs">
                <thead>
                <tr className="bg-gray-100">
                    {/* Print the table header*/}
                    {/* Provide a row number column */}
                    <DataHeader key={-1} name={"Row Number"} type={""}/>
                    {columns.map((col, index) => (
                        <DataHeader key={index} name={col.name} type={col.datatype}/>
                    ))}
                </tr>
                </thead>
                <tbody>
                {columns[0].values.map((_, rowIndex) => (
                    // Since all columns have the same length
                    // We use the first column's values to iterate over rows
                    <tr key={rowIndex} className="hover">
                        {/* Provide a row number*/}
                        <DataCell key={-1} value={currentPage * pageSize + rowIndex + 1}/>
                        {/* For every row, iterate all columns*/}
                        {columns.map((col, colIndex) => (
                            <DataCell key={colIndex} value={col.values[rowIndex]}/>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

        </div>

    )
}