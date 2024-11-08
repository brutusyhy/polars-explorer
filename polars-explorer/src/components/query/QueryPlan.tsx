import {useAppSelector} from "@/redux/hooks.ts";
import {selectQueryPlan} from "@/components/frameview/frameViewSlice.ts";

export default function QueryPlan() {
    const queryPlan = useAppSelector(selectQueryPlan)
    return <div>{queryPlan}</div>
}