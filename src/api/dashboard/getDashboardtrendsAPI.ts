import { get } from "@/utils";
export type Tchart = {
    count: number;
    date: string;
}
const getDashboardtrendsAPI = (dateRange:  object)=>{
    return get<Tchart[]>("/dashboard/trends",{
        params:dateRange
    });
}
export default getDashboardtrendsAPI;