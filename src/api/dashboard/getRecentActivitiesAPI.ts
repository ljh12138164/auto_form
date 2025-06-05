import { get } from "@/utils";
export type TRecentActivities = {
  id: number;
  type: string;
  title: string;
  submittedDate: string;
};
const getRecentActivitiesAPI = (limit?: number) => {
  return get<TRecentActivities[]>("/dashboard/recent-activities", {
    params: {
      limit,
    },
  });
};
export default getRecentActivitiesAPI;
