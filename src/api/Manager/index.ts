import { type IRange, type IManagerRole, type IResGetMember, type ITeamInfoLists, type IRole } from "../../libs/model"
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
export const createUser = async (studentNo: string, username: string) => {
  return await request({
    url: '/v1/user/account/register/',
    method: 'POST',
    data: {
      studentNo,
      username
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

// 5. 新建小组，并且将该组员设置为组长
export const newGroup = async (studentNo: string, role = 2) => {
  return await request({
    url: '/v1/user/management/addleader/',
    method: 'POST',
    params: {
      role,
      studentNo
    }
  })
}

export interface IResGetNoGroupMember {
  student_no: string
  username: string
}
// 7. 6. 管理员获得所有没有进入到任何组的组员
export const getNoGroupMember = async () => {
  return await request<IResGetNoGroupMember[]>({
    url: '/v1/user/management/getnoneuserlist/',
    method: 'GET'
  })
}

// 9. 管理员将某组员从组里踢出
export const delmember = async (studentNo: string) => {
  return await request({
    url: '/v1/user/management/delmember/',
    method: 'POST',
    params: {
      studentNo
    }
  })
}

// 10. 管理员切换组长
export const updateleader = async (oldStudentNo: string, newStudentNo: string) => {
  return await request({
    url: '/v1/user/management/updateleader/',
    method: 'POST',
    params: {
      oldStudentNo,
      newStudentNo
    }
  })
}

export interface IResGetPersonByStudentNo {
  username: string
  studentNo: string
  role: IRole
}
// 15. 管理员根据学号查找某人role、username、studentno
export const getPersonByStudentNo = async (studentNo: string) => {
  return await request<IResGetPersonByStudentNo>({
    url: '/v1/user/account/getsingleinfo/',
    method: 'GET',
    params: {
      studentNo
    }
  })
}

// 解散该组
export const delteam = async (studentNo: string) => {
  return await request({
    url: '/v1/user/management/delteam/',
    method: 'POST',
    params: {
      studentNo
    }
  })
}

// 7. 管理员为组长添加组员
export const addMembers = async (leaderStudentNo: string, memberStudentNos: string) => {
  return await request({
    url: '/v1/user/management/addmember/',
    method: 'POST',
    params: {
      leaderStudentNo,
      memberStudentNos
    }
  })
}

// 管理员上传excel表格
export const uploadExcel = async (excelFile: FormData) => {
  return await request({
    url: '/v1/user/account/excelregister/',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: excelFile
  }
  )
}
