import { type ILoginRes } from "../../libs/model"
import request from "../../utils/request"

export const login = async (studentNo: string, password: string) => {
  return await request<ILoginRes>({
    url: '/v1/user/account/login/',
    method: 'POST',
    data: {
      studentNo,
      password
    }
  })
}
