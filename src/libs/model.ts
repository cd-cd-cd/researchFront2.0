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
