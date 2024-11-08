import {useAppSelector} from "@/redux/hooks.ts";
import {
    selectDataFrameMap,
    selectFrameViewMap,
} from "@/components/frameview/frameViewSlice.ts";

import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import FrameViewSelector from "@/components/frameview/tree/FrameViewSelector.tsx";

export default function FrameViewTree() {

    const dataFrameMap = useAppSelector(selectDataFrameMap);
    const frameViewMap = useAppSelector(selectFrameViewMap);

    return (
        <SimpleTreeView>
            {Object.entries(dataFrameMap).map(
                (df, _) => <FrameViewSelector key={df[1].key}
                                              frameKey={df[1].key}
                                              name={df[1].name}
                                              views={frameViewMap[df[1].key]}/>
            )}
        </SimpleTreeView>


    );

}