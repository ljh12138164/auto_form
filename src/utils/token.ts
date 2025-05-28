// Token管理工具函数

// 获取accessToken（存储在localStorage中）
const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// 获取refreshToken（存储在HttpOnly Cookie中）
// 注意：HttpOnly Cookie无法通过JavaScript访问，这是安全特性
// 此函数主要用于兼容性，实际上会返回null
const getRefreshToken = (): string | null => {
  // HttpOnly Cookie无法通过document.cookie访问
  // 返回null是正常行为，refreshToken由浏览器自动管理
  return null;
};

// 设置tokens（只需要设置accessToken）
const setTokens = (accessToken: string, refreshToken?: string): void => {
  // 只设置accessToken到localStorage
  localStorage.setItem("accessToken", accessToken);
  // refreshToken作为HttpOnly Cookie由后端自动设置，前端无法操作
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

// 检查refreshToken是否存在
// 注意：由于HttpOnly Cookie无法被JavaScript访问，此函数无法准确判断
// 建议通过API调用来验证refreshToken的有效性
const hasRefreshToken = (): boolean => {
  // 无法检测HttpOnly Cookie，返回false
  // 实际的refreshToken验证应该通过后端API进行
  return false;
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
