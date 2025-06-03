import { post } from "@/utils"
export type TLoginForm = {
  username: string
  password: string
}
interface TLoginResponse {
  accessToken: string
  userInfo: {
    id: string
    username: string
    email: string
  }
}
const postLoginAPI = (data:TLoginForm) => {
   return post<TLoginResponse>("/login",data)
}
export default postLoginAPI