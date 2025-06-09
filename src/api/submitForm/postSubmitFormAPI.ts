import { post } from "@/utils";
const postSubmitFormAPI = async (data:any) => {
  return post(`/submit-form`,data);
};
export default postSubmitFormAPI;