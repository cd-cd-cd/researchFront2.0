import { type IRange, type IManagerRole, type IResGetMember, type ITeamInfoLists, type IRole, type IResUploadExcel, type IEquipmentState, type IResDeviceExcel, type IDeviceEquipment, type IDeviceApply, type IGetSomeBodyReporters, type IGetUserTeamWork, type IGetusertimes, type IGetusertimeteamwork } from "../../libs/model"
import request from "../../utils/request"
import { type ICheckUserInfo } from "../Member"

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
  return await request<IResUploadExcel>({
    url: '/v1/user/account/excelregister/',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: excelFile
  }
  )
}
export interface ICreateUser {
  studentNo: string
  password: string
  username: string
}
// 批量生成账户
export const createMembers = async (users: ICreateUser[]) => {
  return await request({
    url: '/v1/user/account/registermore/',
    method: 'POST',
    data: users
  })
}

export interface ITeam {
  createTime: string
  description: string
  performance: string
  task: string
  teamname: string
  updateTime: string
  id: string
}

// 得到某组组介绍
export const getTeam = async (studentNo: string) => {
  return await request<ITeam>({
    url: '/v1/team/info/getinfos/',
    method: 'GET',
    params: {
      studentNo
    }
  })
}

// 管理员……组长添加设备
export const addDevice = async (
  serialNumber: string,
  name: string,
  version: string,
  originalValue: string,
  performanceIndex: string,
  address: string,
  warehouseEntryTime: string,
  hostRemarks: string,
  remark: string
) => {
  return await request({
    url: '/v1/equipment/management/addequipment/',
    method: 'POST',
    data: {
      serialNumber,
      name,
      version,
      originalValue,
      performanceIndex,
      address,
      warehouseEntryTime,
      remark,
      hostRemarks
    }
  })
}

export interface IRecipient {
  studentNo: string
  username: string
}

export interface IEquipment {
  id: string
  serialNumber: string
  name: string
  version: string
  originalValue: string
  performanceIndex: string
  address: string
  warehouseEntryTime: string
  remark: string
  hostRemarks: string
  formerRecipient: IRecipient | null
  recipient: IRecipient | null
  status: IEquipmentState
  applyNumber: number
}

export interface IGetDeviceInfos {
  total: number
  equipments: IEquipment[]
}

// 得到设备信息
export const getDeviceInfos = async (
  pageNum: number,
  pageSize: number
) => {
  return await request<IGetDeviceInfos>({
    url: '/v1/equipment/management/getteamequipments/',
    method: 'GET',
    params: {
      pageNum,
      pageSize
    }
  })
}

// 修改设备信息
export const modifyDevice = async (
  id: string,
  serialNumber: string,
  name: string,
  version: string,
  originalValue: string,
  performanceIndex: string,
  address: string,
  warehouseEntryTime: string,
  remark: string,
  hostRemarks: string
) => {
  return await request({
    url: '/v1/equipment/management/updateequipment/',
    method: 'POST',
    data: {
      id,
      serialNumber,
      name,
      version,
      originalValue,
      performanceIndex,
      address,
      warehouseEntryTime,
      remark,
      hostRemarks
    }
  })
}

// excel批量导入
export const addequipmentexcel = async (excelFile: FormData) => {
  return await request<IResDeviceExcel>({
    url: '/v1/equipment/management/addequipmentexcel/',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: excelFile
  })
}

export const confirmAddExcel = async (lists: IDeviceEquipment[]) => {
  return await request({
    url: '/v1/equipment/management/addequipmentmore/',
    method: 'POST',
    data: lists
  })
}

// 管理员直接使用设备
export const managerUseDevice = async (
  equipmentId: string,
  deadlineTime: string,
  applyReason = null
) => {
  return await request({
    url: '/v1/equipment/record/addapplyrecord/',
    method: 'POST',
    data: {
      equipmentId,
      deadlineTime,
      applyReason
    }
  })
}

export interface IResGetDeviceRecord {
  applyReason: string
  applyTime: string
  checkUserInfo: ICheckUserInfo
  applyUserInfo: ICheckUserInfo
  deadlineTime: string
  refuseReason: string
  status: IDeviceApply
  equipmentInfo: IEquipment
  id: string
}

// 获得设备申请信息
export const getequipmentrecord = async (equipmentid: string) => {
  return await request<IResGetDeviceRecord[]>({
    url: '/v1/equipment/record/getequipmentrecord/',
    method: 'GET',
    params: {
      equipmentid
    }
  })
}

// 对设备进行审批
export const checkrecord = async (
  applyid: string,
  status: 'pass' | 'refuse',
  reason: string | null | undefined
) => {
  return await request({
    url: '/v1/equipment/record/checkrecord/',
    method: 'POST',
    params: {
      applyid,
      status,
      reason
    }
  })
}

// 提前收回某设备
export const recoverapplyrecord = async (equipemntid: string) => {
  return await request({
    url: '/v1/equipment/record/recoverapplyrecord/',
    method: 'POST',
    params: {
      equipemntid
    }
  })
}

export interface IGetUsers {
  notReadCnt: number
  user: IUser
}

// 得到组内/团队内组员
export const getUsers = async () => {
  return await request<IGetUsers[]>({
    url: '/v1/report/info/getuserinfos/',
    method: 'GET'
  })
}

// 获得该用户所有周报
export const getSomeBodyReporters = async (
  studentno: string,
  pageNum: number,
  pageSize: number
) => {
  return await request<IGetSomeBodyReporters>({
    url: '/v1/report/management/getuserallreport/',
    method: 'GET',
    params: {
      studentno,
      pageNum,
      pageSize
    }
  })
}

export interface ITime {
  year: string
  week: string
}

// 指定时间段获取该用户周报
export const getusertimereport = async (
  pageNum: number,
  pageSize: number,
  studentNo: string,
  startTimeInfo: ITime,
  endTimeInfo: ITime
) => {
  return await request<IGetSomeBodyReporters>({
    url: '/v1/report/management/getusertimereport/',
    method: 'POST',
    params: {
      pageNum,
      pageSize
    },
    data: {
      studentNo,
      startTimeInfo,
      endTimeInfo
    }
  })
}

// 获取该用户团队贡献情况
export const getuserteamwork = async (
  pageNum: number,
  pageSize: number,
  studentNo: string,
  startTimeInfo: ITime,
  endTimeInfo: ITime
) => {
  return await request<IGetUserTeamWork>({
    url: '/v1/report/teamwork/getuserteamwork/',
    method: 'POST',
    params: {
      pageNum,
      pageSize
    },
    data: {
      studentNo,
      startTimeInfo,
      endTimeInfo
    }
  })
}

// 根据 时间段 返回所属成员 （序号、姓名，学号，周报提交次数），提交次数少的靠前
export const getusertimes = async (
  pageNum: number,
  pageSize: number,
  startTimeInfo: ITime,
  endTimeInfo: ITime
) => {
  return await request<IGetusertimes>({
    url: '/v1/report/management/getusertimes/',
    method: 'POST',
    params: {
      pageNum,
      pageSize
    },
    data: {
      startTimeInfo,
      endTimeInfo
    }
  })
}

// 根据 时间段 返回成员团队贡献表（序号、姓名、学号、服务次数、服务总时长、服务内容（类型、标题、时长）按时间顺序，时间晚的靠前），服务总时长多的靠前
export const getusertimeteamwork = async (
  pageNum: number,
  pageSize: number,
  startTimeInfo: ITime,
  endTimeInfo: ITime
) => {
  return await request<IGetusertimeteamwork>({
    url: '/v1/report/teamwork/getusertimeteamwork/',
    method: 'POST',
    params: {
      pageNum,
      pageSize
    },
    data: {
      startTimeInfo,
      endTimeInfo
    }
  })
}

// 回复周报
export const addreportcomment = async (reportId: string, content: string) => {
  return await request({
    url: '/v1/report/comment/addreportcomment/',
    method: 'POST',
    data: {
      reportId,
      content
    }
  })
}

export interface IUser {
  adminNo: string
  createTime: string
  email: string
  id: string
  leaderNo: string
  phone: string
  photo: string
  role: IRole
  studentNo: string
  updateTime: string
  username: string
}

export interface IComment {
  content: string
  createTime: string
  id: string
  reportId: string
  role: IRole
  updateTime: string
  userInfo: IUser
  isMyself: 0 | 1
}
export interface IGetreportcomment {
  leaderGroupComments: IComment[]
  adminGroupComments: IComment[]
}

// 根据周报id，得到周报的所有回复，按照提交时间倒序
export const getreportcomment = async (recordId: string) => {
  return await request<IGetreportcomment>({
    url: '/v1/report/comment/getreportcomment/',
    method: 'GET',
    params: {
      recordId
    }
  })
}

// 根据回复id，删除某周报某回复（撤回）
export const delreportcomment = async (commentId: string) => {
  return await request({
    url: '/v1/report/comment/delreportcomment/',
    method: 'POST',
    params: {
      commentId
    }
  })
}
