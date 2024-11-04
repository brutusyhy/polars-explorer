import {useState} from "react";
import {DataFrameInfo, DataFrameMap, Key} from "@/Typing.ts";

// Handling Dataframe Panel

export function useDataFrame() {
    // A list of all loaded dataframes
    const [dataFrameMap, setDataFrameMap] = useState<DataFrameMap>(new Map());

    // Currently selected DataFrame
    const [selectedDataFrame, setSelectedDataFrame] = useState<Key>(-1);


    // Load a dataframe to the main view
    function loadDataFrame(df: DataFrameInfo) {
        // Add the new dataframe to the map if not existing
        if (!dataFrameMap.has(df.key)) {
            const newMap = new Map(dataFrameMap)
            newMap.set(df.key, df);
            setDataFrameMap(newMap);
        }
        setSelectedDataFrame(df.key);
    }

    return {dataFrameMap, selectedDataFrame, loadDataFrame, setSelectedDataFrame}
}