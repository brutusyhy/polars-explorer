import {DataFrameInfo, DataViewInfo} from "@/Typing.ts";

export default function FrameViewShape({frameInfo, viewInfo}: { frameInfo: DataFrameInfo, viewInfo: DataViewInfo }) {
    console.log(viewInfo)
    return (<div>
        <p>{frameInfo.name} {viewInfo.name}</p>
        Rows: {viewInfo.rows} Columns: {viewInfo.cols}
    </div>)

}