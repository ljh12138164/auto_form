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
}
const getCreateFormAPI = async () => {
  return get<IFormData>("/create-form");
};
export default getCreateFormAPI;