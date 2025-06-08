import { FormItem } from "@/types";
import { post } from "@/utils";
export type TSaveForm = {
  id: string;
  title: string;
  description?: string;
  form_config: FormItem[];
}
const postSaveFormAPI = async (data: TSaveForm) => {
  return post("/save-form", data);
};

export default postSaveFormAPI;