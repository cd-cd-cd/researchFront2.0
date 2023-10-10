import { Table, Tag } from 'antd'
import Column from 'antd/lib/table/Column'
import React, { useEffect, useState } from 'react'
import Detail from './Detail'
import { type IBaseTeamWork, type IWorkType, type IWeeklyReports } from '../../../libs/model'
import useReport from '../../../hooks/useReport'
import { getMyWeekReport } from '../../../api/Member'
import style from './index.module.scss'
import dayjs from 'dayjs'

export default function LeaderHistoryReport () {
  const { renderType } = useReport()
  // 控制table loading
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>(0)
  const [source, setSource] = useState<IWeeklyReports[]>([])
  const [detail, setDetail] = useState<IWeeklyReports>()

  // 得到历史周报
  const getLists = async () => {
    setLoading(true)
    const res = await getMyWeekReport(current, 10)
    if (res?.code === 200) {
      setLoading(false)
      setTotal(res.data.total)
      setSource(res.data.weeklyReports)
    }
  }

  // 点击查看详情
  const clickDetail = (record: IWeeklyReports) => {
    setDetail(record)
  }

  // 返回detail
  const detailReturn = () => {
    setDetail(undefined)
  }

  const paginationProps = {
    pageSize: 10,
    current,
    total,
    onChange: (pageNum: number) => {
      setCurrent(pageNum)
    }
  }

  // renderstate
  const renderastatus = (status: 0 | 1 | 2) => {
    switch (status) {
      case 0:
        return <Tag color='gray'>未查看</Tag>
      case 1:
        return <Tag color='green'>已读</Tag>
      case 2:
        return <Tag color='blue'>已评论</Tag>
    }
  }

  useEffect(() => {
    getLists()
  }, [current])
  return (
    <div className={style.back}>
      <Table
        loading={loading}
        dataSource={source}
        pagination={paginationProps}
      >
        <Column title="周" dataIndex="time" key="time" />
        <Column title="创建时间" dataIndex="createTime" key="createTime" render={(value: string) => dayjs(value).format('YYYY-MM-DD')}/>
        <Column title="更新时间" dataIndex="updateTime" key="updateTime" render={(value: string) => dayjs(value).format('YYYY-MM-DD')}/>
        <Column title="团队贡献" dataIndex="teamWorks" key="teamWorks" render={(value: IBaseTeamWork[]) => value.map((item, index) => <div key={item.id}>{(index + 1).toString() + '. ' + renderType(item.type as IWorkType)}</div>)}></Column>
        <Column title='周报状态(管理员)' dataIndex="adminStatus" key="adminStatus" render={(value: 0 | 1 | 2) => renderastatus(value)}></Column>
        <Column title="操作" render={(_: any, record: IWeeklyReports) => <div className={style.a_box}><a onClick={() => clickDetail(record)}>点击查看</a></div>} />
      </Table>
      {
        detail ? <Detail detail={detail} detailReturn={detailReturn}></Detail> : null
      }
    </div>
  )
}
