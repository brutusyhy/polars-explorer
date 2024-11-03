export default function DataHeader({name, type}: { name: string, type: string }) {
    return (<th className="DataHeader">
        <p>{name}</p>
        <p>({type})</p>
    </th>);
}