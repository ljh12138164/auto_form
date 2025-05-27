import axios from 'axios'
//引入基础的路径
const request = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 5000
})
request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default request
