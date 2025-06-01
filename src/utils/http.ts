import request from './request';
export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
  total?: number
}
export const get = async <T>(
  url: string,
  params?: object
) => {
  const res = await request.get<ApiResult<T>>(url, params)
  return res.data
}
export const post = async <T>(
  url: string,
  data?: object
) => {
  const res = await request.post<ApiResult<T>>(url, data)
  return res.data
}

export const put = async <T>(
  url: string,
  data?: object
) => {
  const res = await request.put<ApiResult<T>>(url, data)
  return res.data
}

export const del = async <T>(
  url: string,
  data?: object
) => {
  const res = await request.delete<ApiResult<T>>(url, data)
  return res.data
}
export const postLoginAPI = async <TLoginResponse>(
  url: string,
  data?: object
) => {
  const res = await request.post<ApiResult<TLoginResponse>>(url, data)
  return res.data
}