// home
export type IRole = 0 | 1 | 2

export interface IOption {
  value: string
  label: string
}

export interface ITabBarCommon {
  label: string
  value: number
  name: string
}

// 登录api
export interface ILoginReq {
  student_no: string
  password: string
}

export interface ILoginRes {
  error_message: string
  token: string
}
