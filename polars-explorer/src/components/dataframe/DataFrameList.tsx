import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


import {useAppSelector} from "@/redux/hooks.ts";
import {selectDataFrameMap, selectOpenedDataFrame} from "@/components/dataframe/dataFrameSlice.ts";


export default function DataFrameList() {

    // function handleValueChange() {
    //    TODO
    // }

    const dataFrameMap = useAppSelector(selectDataFrameMap);
    const openedDataFrame = useAppSelector(selectOpenedDataFrame);
    console.log(dataFrameMap);
    console.log(openedDataFrame);
    return (
        <Accordion type="single" collapsible value={openedDataFrame.toString()}>
            {Object.entries(dataFrameMap).map(([key, dataFrameInfo]) => (
                <AccordionItem key={key} value={key.toString()}>
                    <AccordionTrigger>{dataFrameInfo.name}</AccordionTrigger>
                    <AccordionContent>No info yet</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );

}