import { Button, Drawer, Table, message, Image } from 'antd'
import style from './index.module.scss'
import Column from 'antd/lib/table/Column'
import React, { useEffect, useState } from 'react'
import {
  type IGetmemberinfos,
  getTeamInfos,
  getmemberinfos,
  type ITeam,
  teamMembersInfos
} from '../../../api/Leader'
import GroupManagerDrawer from './GroupManagerDrawer'
import dayjs from 'dayjs'

interface ISource {
  key: string
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
export default function GroupManage() {
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<ISource[]>([])
  const [teamInfo, setTeamInfo] = useState<ITeam>()
  // drawer's open
  const [open, setOpen] = useState(false)
  // 组长获得组内信息
  const getinfos = async () => {
    const res = await teamMembersInfos()
    if (res?.code === 200) {
      console.log(res.data)
      setSource(
        res.data.reduce((pre: ISource[], cur) => {
          pre.push({
            key: cur.id,
            adminNo: cur.adminNo,
            cardNo: cur.cardNo,
            createTime: cur.createTime,
            email: cur.email,
            id: cur.id,
            leaderId: cur.leaderId,
            phone: cur.phone,
            role: cur.role,
            studentNo: cur.studentNo,
            teamNo: cur.teamNo,
            updateTime: cur.updateTime,
            username: cur.username
          })
          return pre
        }, [])
      )
    } else {
      message.info(res?.message)
    }
  }

  // 得到组信息
  const getTeamInfo = async () => {
    const res = await getTeamInfos()
    if (res?.code === 200) {
      setTeamInfo(res.data)
    } else {
      message.info(res?.message)
    }
  }

  // 打开drawer
  const clickOpenDrawer = () => {
    setOpen(true)
    getTeamInfo()
  }
  useEffect(() => {
    getinfos()
  }, [])
  return (
    <div>
      {/* <div>
        <Button onClick={() => clickOpenDrawer()} className={style.lookInfoBtn}>查看组信息</Button>
      </div> */}
      <Table loading={loading} dataSource={source} pagination={false}>
        <Column title="姓名" dataIndex="username" key="username" />
        <Column title="学工号" dataIndex="studentNo" key="studentNo" />
        <Column title="邮箱" dataIndex="email" key="email" />
        <Column title="手机号" dataIndex="phone" key="phone" />
        <Column title="身份证" dataIndex="cardNo" key="cardNo" />
        <Column
          title="创建时间"
          dataIndex="createTime"
          key="createTime"
          render={(value: string) => dayjs(value).format('YYYY-MM-DD')}
        />
      </Table>
      <GroupManagerDrawer
        open={open}
        setOpen={setOpen}
        teamInfo={teamInfo!}
        getTeamInfo={getTeamInfo}
      ></GroupManagerDrawer>
    </div>
  )
}
