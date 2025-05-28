import { post } from "@/utils";

const postRefreshTokenAPI = () => {
   return post("/refresh-token")
}
export default postRefreshTokenAPI