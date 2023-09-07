import { Button, Drawer, Table, message, Image } from 'antd'
import style from './index.module.scss'
import Column from 'antd/lib/table/Column'
import React, { useEffect, useState } from 'react'
import { type IGetmemberinfos, getTeamInfos, getmemberinfos, type ITeam } from '../../../api/Leader'
import GroupManagerDrawer from './GroupManagerDrawer'
import dayjs from 'dayjs'

interface ISource {
  key: string
  createTime: string
  email: string
  phone: string
  photo: string
  studentNo: string
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
    const res = await getmemberinfos()
    if (res?.code === 200) {
      setSource(res.data.reduce((pre: ISource[], cur) => {
        pre.push({
          key: cur.studentNo,
          createTime: dayjs(cur.createTime).format('YYYY-MM-DD'),
          email: cur.email,
          phone: cur.phone,
          photo: cur.photo,
          studentNo: cur.studentNo,
          username: cur.username
        })
        return pre
      }, []))
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
      <div>
        <Button onClick={() => clickOpenDrawer()} className={style.lookInfoBtn}>查看组信息</Button>
      </div>
      <Table
        loading={loading}
        dataSource={source}
        pagination={false}
      >
        <Column title="头像" dataIndex="photo" key="photo"
        render={(value: string) => <><Image src={value} width={55}></Image></>}
        />
        <Column title="姓名" dataIndex="username" key="username" />
        <Column title="学号" dataIndex="studentNo" key="studentNo" />
        <Column title="邮箱" dataIndex="email" key="email" />
        <Column title="手机号" dataIndex="phone" key="phone" />
        <Column title="创建时间" dataIndex="createTime" key="createTime" />
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
