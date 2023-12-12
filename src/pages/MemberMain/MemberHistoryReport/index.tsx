import { Table, Tag } from 'antd'
import Column from 'antd/lib/table/Column'
import React, { useContext, useEffect, useState } from 'react'
import { getMyWeekReport } from '../../../api/Member'
import {
  type IWorkType,
  type IBaseTeamWork,
  type IWeeklyReports
} from '../../../libs/model'
import dayjs from 'dayjs'
import useReport from '../../../hooks/useReport'
import Detail from './Detail'
import style from './index.module.scss'
import { context } from '../../../hooks/store'
import weekOfYear from 'dayjs/plugin/weekOfYear'
// dayjs.extend(weekOfYear)

export default function MemberHistoryReport() {
  const { renderType } = useReport()
  // 控制table loading
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>(0)
  const [source, setSource] = useState<IWeeklyReports[]>([])
  const [detail, setDetail] = useState<IWeeklyReports>()
  const { setTabBarId, setEditRecord } = useContext(context)

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

  // 判断是否显示修改
  const isModify = (record: IWeeklyReports) => {
    const date = Date.now()
    const day = dayjs(date).day()
    let week = dayjs(date).week()
    const year = dayjs(date).year()
    if (day === 0) {
      week = week - 1
    }
    if (record.adminStatus === 0 && record.leaderStatus === 0) {
      return (
        <div className={style.a_box}>
          <a onClick={() => goEdit(record)}>修改</a>
        </div>
      )
    }

    if (week.toString() === record.week && year.toString() === record.year) {
      return (
        <div className={style.a_box}>
          <a onClick={() => goEdit(record)}>修改</a>
        </div>
      )
    }

    return null
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
  const renderastatus = (
    status: 0 | 1 | 2,
    record: IWeeklyReports,
    key: 'leaderStatus' | 'adminStatus'
  ) => {
    switch (status) {
      case 0:
        return <Tag color="gray">未查看</Tag>
      case 1:
        return <Tag color="green">已读</Tag>
      case 2:
        if (key === 'leaderStatus') {
          return <Tag color="blue">{record.leaderComment}条评论</Tag>
        } else if (key === 'adminStatus') {
          return <Tag color="blue">{record.adminComment}条评论</Tag>
        }
    }
  }

  const goEdit = async (record: IWeeklyReports) => {
    const role = localStorage.getItem('role')
    setEditRecord(record)
    setTabBarId(1)
  }

  useEffect(() => {
    getLists()
  }, [current])
  return (
    <div className={style.back}>
      <Table loading={loading} dataSource={source} pagination={paginationProps}>
        <Column title="周" dataIndex="time" key="time" />
        <Column
          title="创建时间"
          dataIndex="createTime"
          key="createTime"
          render={(value: string) => dayjs(value).format('YYYY-MM-DD')}
        />
        <Column
          title="更新时间"
          dataIndex="updateTime"
          key="updateTime"
          render={(value: string) => dayjs(value).format('YYYY-MM-DD')}
        />
        <Column
          title="团队贡献"
          dataIndex="teamWorks"
          key="teamWorks"
          render={(value: IBaseTeamWork[]) =>
            value.map((item, index) => (
              <div key={item.id}>
                {(index + 1).toString() +
                  '. ' +
                  renderType(item.type as IWorkType)}
              </div>
            ))
          }
        ></Column>
        <Column
          title="周报状态(管理员)"
          dataIndex="adminStatus"
          key="adminStatus"
          render={(value: 0 | 1 | 2, record: IWeeklyReports) =>
            renderastatus(value, record, 'adminStatus')
          }
        ></Column>
        <Column
          title="周报状态(组长)"
          dataIndex="leaderStatus"
          key="leaderStatus"
          render={(value: 0 | 1 | 2, record: IWeeklyReports) =>
            renderastatus(value, record, 'leaderStatus')
          }
        ></Column>
        <Column
          title="操作"
          render={(_: any, record: IWeeklyReports) => (
            <div className={style.a_box}>
              <a onClick={() => clickDetail(record)}>点击查看</a>
            </div>
          )}
        />
        <Column
          title="修改"
          render={(_: any, record: IWeeklyReports) => isModify(record)}
        />
      </Table>
      {detail ? (
        <Detail detail={detail} detailReturn={detailReturn}></Detail>
      ) : null}
    </div>
  )
}
