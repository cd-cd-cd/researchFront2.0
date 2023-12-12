import { type RangePickerProps } from 'antd/lib/date-picker'

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
  cardno: string
  email: string
  phone: string
  role: IRole
  username: string
  studentNo: string
}
// manage
export type IRange = 'member' | 'leader' | 'all'

export interface IResGetMember extends IPagination {
  userlist: IUserLIsts[]
}

export interface IUserLIsts {
  adminInfo: IUser
  leaderInfo: null | IUser
  userInfo: IUser
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

export interface IMembersTable {
  key: string
  createTime: string
  email: string
  phone: string
  photo: string
  role: IRole
  studentNo: string
  username: string
  leaderName: string
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

export type IWorkType = '1-1-1'
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

export interface IList {
  fileName: string
  url: string
}
export interface IWeekProgress {
  content: string
  attach: IList[]
}

export interface IWeekPlan {
  content: string
  attach: IList[]
}
export interface ITeamWork {
  id: string
  type: string | null
  title: string | null
  duration: number | null
  content: string
  attach: IList[]
  show: boolean
}

export interface IBaseTeamWork {
  id: string
  type: string | null
  title: string | null
  duration: number | null
  content: string
  attach: IList[]
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

export interface IWeeklyReports {
  createTime: string
  id: string
  month: string
  week: string
  teamWorks: IBaseTeamWork[]
  time: string
  updateTime: string
  weekPlan: IWeekPlan
  weekProgress: IWeekProgress
  year: string
  adminStatus: 0 | 1 | 2 // 0未读 1已读 2已评论
  leaderStatus: 0 | 1 | 2
  adminComment: number
  leaderComment: number
}

export interface IGetMyWeekReport extends IPagination {
  weeklyReports: IWeeklyReports[]
}

export interface IGetSomeBodyReporters extends IPagination {
  weeklyReports: IWeeklyReports[]
}

export interface IDetailInfo {
  title: string
  attach: IList[]
  content: string
}
export interface ITeamWorkItem {
  attach: string
  content: string
  createTime: string
  duration: number
  id: string
  reportId: string
  studentNo: string
  teamworkId: string
  title: string
  type: IWorkType
  updateTime: string
  week: string
  year: string
}

export interface IGetUserTeamWork extends IPagination {
  weeklyTeamWork: ITeamWorkItem[]
}

export interface IUserTimeInfo {
  id: string
  name: string
  photo: string
  studentNo: string
  times: number
}

export interface IGetusertimes extends IPagination {
  userTimesInfo: IUserTimeInfo[]
}

export interface IUserTimesTeamWorkInfo {
  id: string
  name: string
  photo: string
  studentNo: string
  workTimes: number
  workTotalDuration: number
  teamWorksList: ITeamWorkItem[]
}
export interface IGetusertimeteamwork extends IPagination {
  userTimesTeamWorkInfo: IUserTimesTeamWorkInfo[]
}

export interface ISearchTeam {
  time: string[] | undefined
  value: RangePickerProps['value'] | undefined
  // 保存查询方式 // 0 查周报 1 查贡献
  searchType: number | undefined
  teamMark: undefined | string
  personMark: undefined | string
}

export interface IReturnTeams {
  no: string
  teamName: string
  failReason: string | null
}

export interface IExcelReturn {
  corrcetCnt: number
  totalCnt: number
  wrongCnt: number
}

export interface IUpdateInfo extends IExcelReturn {
  correctTeams: IReturnTeams[]
  wrongTeams: IReturnTeams[]
}

export interface ITeamInfo {
  no: string
  teamName: string
}

export interface IResTeam {
  teamname: string
  no: string
  members: IMemberinfo[]
  leader: IMemberinfo | null
}

export interface ExcelUser {
  username: string
  studentNo: string
  tel: string | null
  email: string | null
  cardNo: string | null
  teamNo: string | null
  teamName: string | null
  role: string | null
  failReason: string | null
}

export interface IMemberExcelReturn extends IExcelReturn {
  wrongUsers: ExcelUser[]
  correctUsers: ExcelUser[]
}

export interface UpdateUser {
  username: string
  studentNo: string
  tel: string | null
  email: string | null
  cardNo: string | null
  teamNo: string | null
  teamName: string | null
  role: string | null
}

export interface ITeam {
  adminNo: string
  createTime: string
  id: string
  leaderNo: string
  no: string
  teamname: string
  updateTime: string
}

export interface ILeaderInfo {
  adminNo: string
  cardNo: string
  createTime: string
  email: string
  id: string
  leaderNo: string
  phone: string
  role: number
  studentNo: string
  teamNo: string
  updateTime: string
  username: string
}

export interface IMemberinfo {
  id: string
  username: string
  teamNo: string
  teamInfo: ITeam
  leaderNo: string
  leaderInfo: ILeaderInfo
  adminNo: string
  phone: string
  email: string
  role: number
  cardNo: string
  studentNo: string
  createTime: string
  updateTime: string
}

export interface IResMemberList extends IPagination {
  userlist: IMemberinfo[]
}

export interface ImemberList {
  no: string
  teamname: string
  members: ILeaderInfo[]
}

export interface ILMember {
  adminNo: string | null
  cardNo: string | null
  createTime: string
  email: string | null
  id: string
  leaderId: string | null
  phone: string | null
  role: number
  studentNo: string
  teamNo: string | null
  updateTime: string
  username: string
}

export interface IBackupRecords {
  createTime: string
  updateTime: string
  id: number
  remark: string | null
  studentId: number | null
  version: string
  userInfo: ILeaderInfo
}
export interface IResGetBackup extends IPagination {
  backupRecords: IBackupRecords[]
}
