import { get } from "@/utils";
export interface IFormData {
  createData:FormItem[]
  total:number
}
export interface FormItem {
  id: string;
  title: string;
  description?: string;
  createTime: string;
  updateTime: string;
  submitCount: number;
  formConfig: string;
}
const getCreateFormAPI = async (query?: object) => {
  return get<IFormData>("/create-form",{
    params:query
  });
};
export default getCreateFormAPI;