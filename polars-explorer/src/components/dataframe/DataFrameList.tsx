import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {DataFrameMap} from "@/Typing.ts";

export default function DataFrameList(
    {dataFrameMap}: { dataFrameMap: DataFrameMap }
) {
    function handleValueChange() {
        // TODO
    }

    return (
        <Accordion type="single" collapsible onValueChange={handleValueChange}>
            {[...dataFrameMap].map(([key, dataFrameInfo]) => (
                <AccordionItem value={key.toString()}>
                    <AccordionTrigger>{dataFrameInfo.name}</AccordionTrigger>
                    <AccordionContent>No info yet</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );

}