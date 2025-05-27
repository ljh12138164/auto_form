import request from './request';
export interface ApiResult<T> {
  code: number;
  message: string;
  data?: T;
  rows?:T;
  total?: number
}
export const get =async <T>(
  url: string,
  params?: object
) => {
  const res = await request.get<ApiResult<T>>(url, params)
  return res.data
}
export const post = <T>(
  url: string,
  data?: object
) => {
  return request.post<T>(url, data)
}

export const put = <T>(
  url: string,
  data?: object
) => {
  return request.put<T>(url, data)
}

export const del = <T>(
  url: string,
  data?: object
) => {
  return request.delete<T>(url, data)
}