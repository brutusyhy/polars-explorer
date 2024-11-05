import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


import {useAppDispatch, useAppSelector} from "@/redux/hooks.ts";
import {
    openDataFrame,
    selectDataFrameMap,
    selectOpenedDataFrame,
    switchDataFrame
} from "@/components/dataframe/dataFrameSlice.ts";
import React, {ReactElement, ReactEventHandler} from "react";
import {switch_dataframe} from "@/services/commands.ts";
import {selectPageSize} from "@/components/dataview/paginationSlice.ts";


export default function DataFrameList() {

    const dataFrameMap = useAppSelector(selectDataFrameMap);
    const openedDataFrame = useAppSelector(selectOpenedDataFrame);
    const pageSize = useAppSelector(selectPageSize);
    const dispatch = useAppDispatch();


    // @ts-ignore
    async function handleClick(event: React.MouseEvent<HTMLElement>) {
        console.log(event.target)
        const key = parseInt(event.target.value);
        await dispatch(openDataFrame(key));
        await switch_dataframe({key, pageSize})
    }

    return (
        <Accordion type="single" collapsible value={openedDataFrame.toString()}>
            {Object.entries(dataFrameMap).map(([key, dataFrameInfo]) => (
                <AccordionItem key={key} value={key.toString()}>
                    <AccordionTrigger value={key.toString()}
                                      onClick={handleClick}>{dataFrameInfo.name}</AccordionTrigger>
                    <AccordionContent>{dataFrameInfo.length} Rows</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );

}