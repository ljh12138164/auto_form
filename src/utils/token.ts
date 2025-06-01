// Token管理工具函数
// 获取accessToken（存储在localStorage中）
const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// 设置单个accessToken
const setAccessToken = (accessToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
};
// 清除所有tokens
const clearTokens = (): void => {
  // 清除localStorage中的accessToken
  localStorage.removeItem("accessToken");
  // HttpOnly Cookie需要通过后端接口清除
  // 建议调用logout接口让后端清除refreshToken Cookie
};
// 检查accessToken是否存在
const hasToken = (): boolean => {
  return !!getAccessToken();
};

export {
  getAccessToken,
  setAccessToken,
  clearTokens,
  hasToken,
};
