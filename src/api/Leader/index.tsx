import { type ILMember, type IUpdateInfo } from '../../libs/model'
import request from '../../utils/request'

export interface IGetmemberinfos {
  createTime: string
  email: string
  phone: string
  photo: string
  studentNo: string
  username: string
}
// 2. 组长获得组内成员信息（分页）不要传入自己的信息 如果没有组员传空数组
export const getmemberinfos = async () => {
  return await request<IGetmemberinfos[]>({
    url: '/v1/user/management/getmemberinfos/',
    method: 'GET'
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
// 组长获取到某组信息
export const getTeamInfos = async () => {
  return await request<ITeam>({
    url: '/v1/team/info/getinfos/',
    method: 'GET'
  })
}

// 1. 修改组信息（组名、组内简介、组内成绩....）
export const updateinfo = async (
  id: string,
  teamname: string,
  description: string,
  performance: string,
  task: string
) => {
  return await request({
    url: '/v1/team/info/updateinfo/',
    method: 'POST',
    data: {
      id,
      teamname,
      description,
      performance,
      task
    }
  })
}

// 组长获得组信息
export const teamMembersInfos = async () => {
  return await request<ILMember[]>({
    url: '/v1/team/info/getmemberinfos/',
    method: 'GET'
  })
}
