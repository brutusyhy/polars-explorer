import {ColumnInfo, TableData} from "@/Typing.ts";
import {useAppSelector} from "@/redux/hooks.ts";
import {selectColumnInfo} from "@/redux/slices/dataTableSlice.ts";
import {useEffect, useState} from "react";
import ApplyFilter from "@/components/frameview/info/ApplyFilter.tsx";

export default function ColumnSelector() {
    // Since the column info is always passed in the ColumnData Payload
    // There's no need for a special channel and backend code
    // We can simply extract it into a table
    const columnInfo: ColumnInfo[] = useAppSelector(selectColumnInfo);

    // An array to keep a list of all selected columns
    const [selectedCols, setSelectedCols] = useState(
        Object.fromEntries(columnInfo.map(col => [col.name, true]))
    );

    function toggleColumn(colName: string) {
        let newSelection = {...selectedCols};
        newSelection[colName] = !newSelection[colName];
        setSelectedCols(newSelection);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        toggleColumn(e.target.value);
    }

    console.log(selectedCols);

    return (
        <div className="!overflow-y-scroll !overflow-x-scroll">
            <table className="DataTable table table-xs">
                <thead>
                <tr className="bg-gray-100">
                    {/* Column info header*/}
                    {/* First column is a select checkbox */}
                    <th key={-1} className="TableHead">Select</th>
                    <th key={0} className="TableHead">Column Name</th>
                    <th key={1} className="TableHead">Column Type</th>
                </tr>
                </thead>
                <tbody>
                {columnInfo.map((col, colIndex) => {
                    return (
                        <tr key={colIndex}>
                            <td key={-1} className="border">
                                <input type="checkbox"
                                       value={col.name}
                                       checked={selectedCols[col.name]}
                                       onChange={handleChange}
                                />
                            </td>
                            <td key={0} className="border">{col.name}</td>
                            <td key={1} className="border">{col.datatype}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>

            <ApplyFilter columns={
                Object
                    .entries(selectedCols)
                    .filter(col => col[1])
                    .map(col => col[0])
            }/>
        </div>

    )

}