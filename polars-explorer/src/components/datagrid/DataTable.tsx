import DataCell from "@/components/datagrid/DataCell.tsx";
import DataHeader from "@/components/datagrid/DataHeader.tsx";


export default function DataTable({columns}: { columns: Column[] }) {
    if (columns.length == 0) {
        return <></>;
    }
    return (
        <div className="DataContainer">
            <table className="DataTable table table-xs">
                <thead>
                <tr className="bg-gray-100">
                    {/* Print the table header*/}
                    <DataHeader key={-1} name={""} type={""}/>
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
                        <DataCell key={-1} value={rowIndex + 1}/>
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