import {useAppDispatch, useAppSelector} from "@/redux/hooks.ts";
import {
    loadView,
    selectDataFrameMap,
    selectFrameViewMap,
    selectOpenedView
} from "@/components/dataframe/dataFrameSlice.ts";
import React from "react";
import {switch_dataframe} from "@/services/commands.ts";
import {selectPageSize} from "@/components/dataexplorer/pagination/paginationSlice.ts";

import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import {TreeItem} from '@mui/x-tree-view/TreeItem';
import DataFrame from "@/components/dataframe/DataFrame.tsx";

export default function DataFrameList() {

    const dataFrameMap = useAppSelector(selectDataFrameMap);
    const frameViewMap = useAppSelector(selectFrameViewMap);
    const openedView = useAppSelector(selectOpenedView);
    const pageSize = useAppSelector(selectPageSize);
    const dispatch = useAppDispatch();


    return (
        <SimpleTreeView>
            {Object.entries(dataFrameMap).map(
                (df, _) => <DataFrame frameKey={df[1].key.toString()}
                                      name={df[1].name}
                                      views={frameViewMap[df[1].key]}/>
            )}
        </SimpleTreeView>


    );

}