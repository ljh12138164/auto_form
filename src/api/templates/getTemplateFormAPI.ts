import {type FormItem } from "@/types";
import { get } from "@/utils";

export interface TemplateForm {
  id: string;
  field:string;
  title: string;
  description: string;
  usageCount: number;
  updateTime: string;
  templateConfig: FormItem[];
  img:  string;
}
const getTemplateFormAPI = () => {
  return get<TemplateForm[]>("/template-form");
};
export default getTemplateFormAPI;
