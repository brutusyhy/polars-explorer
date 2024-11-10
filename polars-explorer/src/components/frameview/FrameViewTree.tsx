import {useAppSelector} from "@/redux/hooks.ts";
import {
    selectDataFrameMap,
    selectFrameViewMap, selectOpenedFrameViewKey,
} from "@/redux/slices/frameViewSlice.ts";

import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import FrameTreeItem from "@/components/frameview/tree/FrameTreeItem.tsx";
import FrameContext from "@/components/frameview/tree/contextmenu/FrameContext.tsx";

export default function FrameViewTree() {

    const dataFrameMap = useAppSelector(selectDataFrameMap);
    const frameViewMap = useAppSelector(selectFrameViewMap);
    const [frameKey, viewKey] = useAppSelector(selectOpenedFrameViewKey);
    // If the frameKey and viewKey are invalid (-1)
    // The selectedItems should be null
    const selectedItems = (frameKey === -1) || (viewKey === -1) ?
        null :
        `${frameKey}-${viewKey}`;

    return (
        <SimpleTreeView selectedItems={selectedItems}>
            {Object.entries(dataFrameMap).map(
                (df, _) => <FrameContext key={df[1].key}
                                         frameKey={df[1].key}
                                         name={df[1].name}
                                         views={frameViewMap[df[1].key]}/>
            )}
        </SimpleTreeView>


    );

}