// Token管理工具函数

// 获取accessToken
const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// 获取refreshToken
const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

// 设置tokens
const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

// 设置单个accessToken
const setAccessToken = (accessToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
};

// 清除所有tokens
const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// 检查token是否存在
const hasToken = (): boolean => {
  return !!getAccessToken();
};

// 检查refreshToken是否存在
const hasRefreshToken = (): boolean => {
  return !!getRefreshToken();
};

export {
  getAccessToken,
  getRefreshToken,
  setTokens,
  setAccessToken,
  clearTokens,
  hasToken,
  hasRefreshToken,
};
