import FrameViewShape from "@/components/frameview/info/FrameViewShape.tsx";
import {useAppSelector} from "@/redux/hooks.ts";
import {
    selectOpenedFrameInfo,
    selectOpenedFrameViewKey,
    selectOpenedViewInfo
} from "@/components/frameview/frameViewSlice.ts";
import ColumnSelector from "@/components/frameview/info/ColumnSelector.tsx";
import ApplyFilter from "@/components/frameview/info/ApplyFilter.tsx";

export default function FrameViewInfo() {
    const frameInfo = useAppSelector(selectOpenedFrameInfo);
    const viewInfo = useAppSelector(selectOpenedViewInfo);
    if (frameInfo == undefined || viewInfo == undefined) {
        return <></>
    } else {
        return (<div>
            <FrameViewShape frameInfo={frameInfo} viewInfo={viewInfo}/>
            <ColumnSelector/>
        </div>)
    }

}