// 导入 axios 库，用于发送 HTTP 请求
import axios from 'axios'
// 导入 token 相关的工具函数：获取访问令牌、设置令牌、清除令牌
import { getAccessToken, setAccessToken, clearTokens } from './token'
// 导入用户状态管理 store
import { useUserStore } from '@/stores/modules/user'
// 导入路由实例，用于页面跳转
import router from '@/router'
const baseURL = import.meta.env.PROD 
  ? import.meta.env.VITE_APP_BASE_API // 生产环境直接使用域名
  : import.meta.env.VITE_APP_BASE_API_PROXY; // 开发环境使用代理
// 创建 axios 实例，配置基础请求参数
const request = axios.create({
  baseURL: baseURL, // 设置基础 URL 路径为 /api
  timeout: 5000, // 设置请求超时时间为 5 秒
  withCredentials: true // 重要：允许携带 Cookie（用于发送 refreshToken）
})

// 定义全局变量：标记是否正在刷新 token，防止并发刷新
let isRefreshing = false
// 定义请求队列：存储在 token 刷新期间需要等待的请求
let failedQueue: Array<{
  resolve: (value?: any) => void // 请求成功时的回调函数
  reject: (reason?: any) => void  // 请求失败时的回调函数
}> = []

// 处理队列中等待的请求函数
const processQueue = (error: any, token: string | null = null) => {
  // 遍历队列中的所有请求
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error) // 如果有错误，拒绝所有等待的请求
    } else {
      resolve(token) // 如果成功，解析所有等待的请求并传入新 token
    }
  })
  
  failedQueue = [] // 清空请求队列
}

// 刷新 token 的异步函数
const refreshToken = async (): Promise<string> => {
  try {
    // 调用后端刷新 token 的 API（refreshToken 通过 HttpOnly Cookie 自动发送）
    const response = await axios.post('/api/refresh-token', {}, {
      withCredentials: true // 确保携带 HttpOnly Cookie 中的 refreshToken
    })
    // 从响应中提取新的 accessToken
    const { accessToken } = response.data.data
    // refreshToken 作为 HttpOnly Cookie 由后端管理，前端无需处理
    setAccessToken(accessToken)
    
    // 更新 Pinia store 中的 token 状态
    const userStore = useUserStore()
    userStore.updateAccessToken(accessToken)
    
    // 返回新的 accessToken
    return accessToken
  } catch (error) {
    // 刷新失败时的处理：清除所有 token 并跳转到登录页
    clearTokens() // 清除本地存储的 accessToken
    const userStore = useUserStore()
    userStore.logout() // 调用 store 的登出方法
    
    // 延迟跳转，避免在请求处理过程中立即跳转
    setTimeout(() => {
      router.push('/login') // 跳转到登录页面
    }, 100)
    
    // 创建一个特殊的错误标识，表示需要登出
    const logoutError = new Error('REFRESH_TOKEN_FAILED')
    logoutError.name = 'LOGOUT_REQUIRED'
    throw logoutError // 重新抛出错误
  }
}
// 配置请求拦截器：在每个请求发送前执行
request.interceptors.request.use(
  (config) => {
    // 获取当前的访问令牌
    const token = getAccessToken()
    if (token) {
      // 如果 token 存在，添加到请求头的 Authorization 字段
      config.headers.Authorization = `Bearer ${token}`
    }
    return config // 返回修改后的配置
  },
  (error) => {
    // 请求发送失败时的处理
    return Promise.reject(error)
  }
)

// 配置响应拦截器：在每个响应返回后执行
request.interceptors.response.use(
  (response) => {
    // 响应成功时直接返回响应数据
    return response
  },
  async (error) => {
    // 获取原始请求配置
    const originalRequest = error.config
    
    // 检查是否为 401 未授权错误，且不是重试请求，且不是刷新 token 的请求
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('refresh-token')) {
      // 如果当前正在刷新 token，将请求加入等待队列
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          // 将当前请求的 resolve 和 reject 函数加入队列
          failedQueue.push({ resolve, reject })
        }).then(token => {
          // token 刷新成功后，更新请求头并重新发送请求
          originalRequest.headers.Authorization = `Bearer ${token}`
          return request(originalRequest)
        }).catch(err => {
          // 检查是否为登出错误，如果是则不重试
          if (err.name === 'LOGOUT_REQUIRED') {
            return Promise.reject(new Error('用户已登出，请重新登录'))
          }
          return Promise.reject(err)
        })
      }
      
      // 标记当前请求为重试请求，防止无限重试
      originalRequest._retry = true
      // 设置正在刷新 token 的标志
      isRefreshing = true
      
      try {
        // 尝试刷新 token
        const newToken = await refreshToken()
        // 处理队列中等待的请求，传入新 token
        processQueue(null, newToken)
        
        // 更新原始请求的 Authorization 头
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        // 重新发送原始请求
        return request(originalRequest)
      } catch (refreshError) {
        // 检查是否为登出错误
        // @ts-ignore
        if (refreshError.name === 'LOGOUT_REQUIRED') {
          // 处理队列中的请求，传入登出错误
          processQueue(refreshError, null)
          // 直接返回登出错误，不再重试
          return Promise.reject(new Error('用户已登出，请重新登录'))
        }
        
        // 其他刷新错误的处理
        processQueue(refreshError, null)
        return Promise.reject(refreshError)
      } finally {
        // 无论成功失败，都重置刷新标志
        isRefreshing = false
      }
    }
    
    // 对于非 401 错误或其他情况，直接拒绝请求
    return Promise.reject(error.response?.data || error.message)
  }
)

// 导出配置好的 axios 实例
export default request
