export default function DataCell({value}: { value: any }) {
    // If a cell is empty, we will display a placeholder
    return (<td className="border">
        {value === "" ? "-" : value}
    </td>);
}