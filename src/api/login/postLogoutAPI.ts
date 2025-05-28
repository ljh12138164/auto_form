import { post } from "@/utils"

const postLogoutAPI = () => {
   return post("/logout")
}
export default postLogoutAPI