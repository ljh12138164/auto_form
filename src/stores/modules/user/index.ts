import { Login, postLogoutAPI, type TLoginForm } from "@/api";
import { notification } from "@/utils";
import { clearTokens, getAccessToken, setAccessToken } from "@/utils/token";
import { defineStore } from "pinia";
import { ref } from "vue";

// 用户信息接口
interface UserInfo {
  id: string;
  username: string;
  email: string;
}

export const useUserStore = defineStore(
  "user",
  () => {
    // 用户基本信息
    const userInfo = ref<UserInfo | null>(null);
    // token状态（只管理accessToken，refreshToken在HttpOnly Cookie中）
    const accessToken = ref(getAccessToken() || "");
    // 更新访问令牌（refreshToken由后端通过HttpOnly Cookie管理）
    const updateAccessToken = (token: string) => {
      accessToken.value = token;
      setAccessToken(token);
    };

    // 登录方法
    const login = async (loginData: TLoginForm) => {
      try {
        const res = await Login(loginData);
        if (res.data) {
          const token = res?.data?.accessToken!;
          updateAccessToken(token);
          userInfo.value = res.data.userInfo;
          notification("登录成功", res.message, "success");
        }
      } catch (error: any) {
        notification("登录失败", error.message, "error");
      }
    };
    // 登出方法
    const logout = async () => {
      try {
        // 调用后端登出接口清除HttpOnly Cookie
        await postLogoutAPI();
        notification("退出成功", "", "success");
      } catch (error) {
        console.error("登出接口调用失败:", error);
      } finally {
        // 无论接口是否成功，都清除本地状态
        userInfo.value = null;
        accessToken.value = "";
        clearTokens();
      }
    };

    return {
      // 状态
      userInfo,
      accessToken,
      // 方法
      updateAccessToken,
      login,
      logout,
    };
  },
  {
    persist: {
      key: "user-store",
      storage: localStorage,
    },
  }
);
