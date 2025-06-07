import { get } from "@/utils";
export interface FormItem {
  id: string;
  title: string;
  description?: string;
  createTime: string;
  updateTime: string;
}
const getCreateFormAPI = async () => {
  return get<FormItem[]>("/create-form");
};
export default getCreateFormAPI;