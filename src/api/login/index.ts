import { type ILoginRes } from "../../libs/model"
import request from "../../utils/request"

export const login = async (student_no: string, password: string) => {
  return await request<ILoginRes>({
    url: '/login',
    method: 'POST',
    params: {
      student_no,
      password
    }
  })
}
