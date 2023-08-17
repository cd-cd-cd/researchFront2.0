import { type IManagerRole } from "../../libs/model"
import request from "../../utils/request"

// 成员初次登录得到个人信息
export const getManagerInfo = async () => {
  return await request<IManagerRole>({
    url: '/v1/user/account/info/',
    method: 'GET'
  })
}

interface IResPostAvatar {
  photo: string
}
// 上传头像
export const postAvatar = async (avatar: FormData) => {
  return await request<IResPostAvatar>({
    url: '/v1/user/account/uploadphoto/',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: avatar
  })
}

// 修改头像 手机号 邮箱
export const modifyInfo = async (photo: string, email: string, phone: string) => {
  return await request({
    url: '/v1/user/account/updateinfo/',
    method: 'POST',
    data: {
      photo,
      email,
      phone
    }
  })
}

// 修改密码
export const modifyPassWord = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
  return await request({
    url: '/v1/user/account/updatepassword/',
    method: "POST",
    data: {
      oldPassword,
      newPassword,
      confirmPassword
    }
  })
}
