import { get } from "@/utils";
type TPage = {
  pageNum: number;
  pageSize: number;
};
export type TsubmittedItem = {
    id: number;
    title: string;
    submitTime: string;
    data: Record<string, any>;
}
export type TSubmitData = {
    submittedDate:TsubmittedItem[],
    total:string
};
const getSubmitFormAPI = async (params?:TPage) => {
  return get<TSubmitData>(`/submit-form`,{
    params
  });
};
export default getSubmitFormAPI;