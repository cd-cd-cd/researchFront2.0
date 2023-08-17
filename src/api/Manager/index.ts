import { type IRange, type IManagerRole, type IResGetMember, type ITeamInfoLists } from "../../libs/model"
import request from "../../utils/request"

// 管理员注册
export const managerRegister = async (studentNo: string, password: string, role = 1) => {
  return await request({
    url: '/v1/user/account/register/',
    method: 'POST',
    data: {
      studentNo,
      password,
      role
    }
  })
}

// 管理员初次登录得到个人信息
export const getManagerInfo = async () => {
  return await request<IManagerRole>({
    url: '/v1/user/account/info/',
    method: 'GET'
  })
}

// 管理员创建角色 一开始创建普通组员
export const createUser = async (studentNo: string) => {
  return await request({
    url: '/v1/user/account/register/',
    method: 'POST',
    data: {
      studentNo
    }
  })
}

// 管理员得到所有成员
export const getMember = async (range: IRange, pageNum: number, pageSize: number) => {
  return await request<IResGetMember>({
    url: '/v1/user/account/getlist/',
    method: 'GET',
    params: {
      range,
      pageNum,
      pageSize
    }
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

// 管理员查看某组员或组长的组信息
export const getteaminfos = async (studentNo: string) => {
  return await request<ITeamInfoLists>({
    url: '/v1/user/management/getteaminfos/',
    method: 'GET',
    params: {
      studentNo
    }
  })
}
