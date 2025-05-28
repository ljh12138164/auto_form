import { post } from "@/utils"
export type TLoginForm = {
  username: string
  password: string
}
const postLoginAPI = (data:TLoginForm) => {
    post("/api/login",data)
}
export default postLoginAPI