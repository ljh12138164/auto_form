import { post } from "@/utils";

const addTemplateCountAPI =  (data:any) => {
  return post(`/template-form-count`,data);
};
export default addTemplateCountAPI;