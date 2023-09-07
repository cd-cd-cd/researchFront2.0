// home
export type IRole = 1 | 2 | 3

export interface IOption {
  value: string
  label: string
}

export interface ITabBarCommon {
  label: string
  value: number
  name: string
}

// login page
export interface ILoginValues {
  role: IRole
  username: string
  password: string
}

// register page
export interface IRegisterValues {
  username: string
  password: string
  confirmPassword: string
}

// manager
// info
export interface IManagerRole {
  avatar: string
  email: string
  phone: string
  role: IRole
  username: string
  studentNo: string
}
// manage
export type IRange = 'member' | 'leader' | 'all'

export interface IResGetMember extends IPagination {
  records: IListRecord[]
}
export interface IListRecord {
  createTime: string
  email: string
  id: string
  phone: string
  photo: string
  role: IRole
  studentNo: string
  username: string
}

export interface IMembersTable {
  key: string
  createTime: string
  email: string
  phone: string
  photo: string
  role: IRole
  studentNo: string
  username: string
}

// 登录api
export interface ILoginReq {
  student_no: string
  password: string
}

export interface ILoginRes {
  role?: number
  token?: string
}

// 分页
interface IPagination {
  pages: number
  size: number
  total: number
}
export interface IMember {
  student_no: string
  username: string
}

export interface ILeader {
  studentNo: string
  username: string
}
export interface ITeamInfoLists {
  member_infos: IMember[]
  leader_infos: ILeader
}
interface ICommingUser {
  studentNo: string
  password: string
  username: string
  failReason: null | string
}
export interface IResUploadExcel {
  corrcetCnt: number
  totalCnt: number
  wrongCnt: number
  correctUsers: ICommingUser[]
  wrongUsers: ICommingUser[]
}

export interface IFileTableSource {
  key: string
  studentNo: string
  username: string
  password: string
  reason: string
}

export interface IDeviceEquipment {
  serialNumber: string
  name: string
  failReason: string
  address: string
  hostRemarks: string
  originalValue: string
  performanceIndex: string
  remark: string
  version: string
  warehouseEntryTime: string
}

export interface IResDeviceExcel {
  wrongEquipment: IDeviceEquipment[]
  correctEquipment: IDeviceEquipment[]
  totalCnt: number
  wrongCnt: number
  corrcetCnt: number
}

// 1 -- 闲置 2 -- 在用
export type IEquipmentState = 1 | 2

// 设备申请 过期1，待审批2，审批通过使用中3，使用结束4，审批拒绝5，记录撤回6
export type IDeviceApply = 1 | 2 | 3 | 4 | 5 | 6

// export type IWorkType = '1-1-1'
| '1-1-2'
| '1-1-3'
| '1-2-1'
| '1-2-2'
| '1-2-3'
| '1-3-1'
| '1-3-2'
| '2-1'
| '2-2'
| '3-1-1'
| '3-1-2'
| '3-1-3'
| '3-2'
| '4-1'
| '4-2'
| '4-3'
| '5-1'
| '5-2'
| '5-3'
| '5-4'
| '5-5'
| '6'
| 'null'

export interface ITeamWork {
  id: string
  type: string | null
  duration: number | null
  content: string
}
export interface IDevice {
  key: string
  id: string
  createdTime: string
  serialNumber: string
  name: string
  version: string
  originalValue: string
  performanceIndex: string
  address: string
  status: IEquipmentState
  warehouseEntryTime: string
  recipient: string
  HostRemarks: string
  remark: string
  applyNumber: number
}
