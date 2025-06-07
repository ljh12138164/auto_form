import { post } from "@/utils";
type Data = {
  title: string;
  description: string;
};
const postCreateFormAPI = async (data:Data ) => {
  return post("/create-form", data);
}

export default postCreateFormAPI;