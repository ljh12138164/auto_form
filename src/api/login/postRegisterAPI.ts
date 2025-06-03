import { post } from "@/utils";
export type userInfo = {
  username: string;
  password: string;
  email: string;
};
const postRegisterAPI = async (data: userInfo) => {
  return post("/register", data);
};
export default postRegisterAPI;
