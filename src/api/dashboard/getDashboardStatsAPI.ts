import { get } from "@/utils";
type TStats = {
  myForms: number;
  todaySubmissions: number;
  totalSubmissions: number;
};
const getDashboardStatsAPI = async () => {
  return get<TStats>("/dashboard/stats");
};

export default getDashboardStatsAPI;
