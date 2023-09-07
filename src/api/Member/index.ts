import { type IDeviceApply, type IManagerRole } from "../../libs/model"
import request from "../../utils/request"
import { type IEquipment } from "../Manager"

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

// 提交设备申请
export const addApplyRecord = async (equipmentId: string, applyReason: string, deadlineTime: Date) => {
  return await request({
    url: '/v1/equipment/record/addapplyrecord/',
    method: 'POST',
    data: {
      equipmentId,
      applyReason,
      deadlineTime
    }
  })
}

export interface ICheckUserInfo {
  id: number
  leaderNo: string
  adminNo: string
  username: string
  studentNo: string
  createTime: string
}

export interface IResGetApplyRecord {
  applyReason: string
  applyTime: string
  checkUserInfo: ICheckUserInfo
  deadlineTime: string
  equipmentInfo: IEquipment
  id: string
  refuseReason: string
  status: IDeviceApply
  studentNo: string
}

// 申请设备
export const getapplyrecord = async () => {
  return await request<IResGetApplyRecord[]>({
    url: '/v1/equipment/record/getapplyrecord/',
    method: 'GET'
  })
}

// 撤回审批
export const cencelrecord = async (recordid: string) => {
  return await request({
    url: '/v1/equipment/record/cencelrecord/',
    method: 'POST',
    params: {
      recordid
    }
  })
}
