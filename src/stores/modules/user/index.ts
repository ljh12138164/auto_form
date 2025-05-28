import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/utils/token";
import { Login, TLoginForm } from "@/api";

// 用户信息接口
interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export const useUserStore = defineStore("user", () => {
  // 用户基本信息
  const userInfo = ref<UserInfo | null>(null);
  const name = ref("");
  
  // token状态
  const accessToken = ref(getAccessToken());
  const refreshToken = ref(getRefreshToken());
  
  // 计算属性
  const isLoggedIn = computed(() => {
    return !!accessToken.value && !!userInfo.value;
  });
  
  const username = computed(() => {
    return userInfo.value?.username || name.value || "";
  });
  
  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info;
    name.value = info.username;
  };
  
  // 设置tokens
  const setUserTokens = (access: string, refresh: string) => {
    accessToken.value = access;
    refreshToken.value = refresh;
    setTokens(access, refresh);
  };
  
  // 更新访问令牌
  const updateAccessToken = (token: string) => {
    accessToken.value = token;
  };
  
  // 登录方法
  const login = async (loginData: TLoginForm) => {
    try {
      // 这里应该调用登录API
      // const response = await loginApi(loginData);
      const res =await Login(loginData)
      console.log(res);
      
      // 模拟登录响应
      
    //   // 设置tokens
    //   setUserTokens(res.accessToken, res.refreshToken);
      
    //   // 设置用户信息
    //   setUserInfo(mockResponse.userInfo);
      
    //   return { success: true, message: "登录成功" };
    } catch (error) {
    //   console.error("登录失败:", error);
    //   return { success: false, message: "登录失败" };
    }
  };
  
  // 登出方法
  const logout = () => {
    // 清除用户信息
    userInfo.value = null;
    name.value = "";
    
    // 清除tokens
    accessToken.value = "";
    refreshToken.value = "";
    clearTokens();
  };
  
  // 检查认证状态
  const checkAuthStatus = () => {
    const token = getAccessToken();
    const refresh = getRefreshToken();
    
    if (token && refresh) {
      accessToken.value = token;
      refreshToken.value = refresh;
      return true;
    }
    
    return false;
  };
  
  return {
    // 状态
    userInfo,
    name,
    accessToken,
    refreshToken,
    
    // 计算属性
    isLoggedIn,
    username,
    
    // 登录相关方法
    setUserInfo,
    setUserTokens,
    updateAccessToken,
    login,
    logout,
    checkAuthStatus
  };
});