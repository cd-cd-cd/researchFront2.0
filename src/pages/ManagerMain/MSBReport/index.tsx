import { DatePicker, type DatePickerProps, Select, Table, Button, message, Modal, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import { type ITime, getSomeBodyReporters, getUsers, getuserteamwork, getusertimereport } from '../../../api/Manager'
import { type RangePickerProps } from 'antd/lib/date-picker'
import moment from 'moment'
import Column from 'antd/lib/table/Column'
import { type IWorkType, type IBaseTeamWork, type IWeeklyReports, type ITeamWorkItem, type IDetailInfo } from '../../../libs/model'
import dayjs from 'dayjs'
import useReport from '../../../hooks/useReport'
import Detail from './Detail'

interface IOption {
  label: string
  value: string
}

export default function MSBReport() {
  const [time, setTime] = useState<string[]>([])
  const [value, setValue] = useState<RangePickerProps['value']>()
  const [userList, setUserLists] = useState<IOption[]>([])
  // 控制table loading
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>(0)
  const [source, setSource] = useState<IWeeklyReports[]>([])
  // 保存选择学生studentNo
  const [chooseNO, setChooseNo] = useState<string>()
  const { renderType } = useReport()
  const [detail, setDetail] = useState<IWeeklyReports>()
  const [teamworkInfos, setTeamWorkInfo] = useState<ITeamWorkItem[]>([])
  // 保存查询方式
  const [searchType, setSearchType] = useState<number>()
  // 0 查某人 1 某人某时间周报 2某人某时间团队贡献

  // 控制查看modal
  const [teamModal, setTeamModal] = useState(false)
  const [detailInfo, setDetailInfo] = useState<IDetailInfo>({ title: '', attach: [], content: '' })
  // 检查学生和时间范围
  const checkNoAndRange = () => {
    if (!time[0] || !time[1]) {
      message.info('时间未选择')
      return false
    } else if (!chooseNO) {
      message.info('未选择用户')
      return false
    }
    return true
  }

  const handleChange = (value: string) => {
    setChooseNo(value)
    setSearchType(0)
  }

  // 得到组内/团队内组员
  const getUserList = async () => {
    const res = await getUsers()
    if (res?.code === 200) {
      setUserLists(res.data.reduce((pre: IOption[], cur) => {
        pre.push({
          label: (cur.user.username + '-' + cur.user.studentNo) + (cur.notReadCnt !== 0 ? ' ' + cur.notReadCnt + '条未读' : ''),
          value: cur.user.studentNo
        })
        return pre
      }, []))
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

  const onChange = (
    value: RangePickerProps['value'],
    dateString: [string, string]
  ) => {
    setValue(value)
    setTime(dateString)
  }

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    // Can not select days before today and today
    return current && current > moment().endOf('day')
  }

  const returnYMW = (value: moment.Moment, time: string) => {
    const year = (value as any).format('YYYY')
    let month = (value as any).format('MM')
    if (month.split('')[0] === '0') {
      month = month.split('')[1]
    }
    const week = (time?.split('-')[1].slice(0, -1))
    return { year, week }
  }
  const paginationProps = {
    pageSize: 10,
    current,
    total,
    onChange: (pageNum: number) => {
      setCurrent(pageNum)
    }
  }

  // 查询时间
  const checkTime = (startTime: ITime, endTime: ITime) => {
    const start_Year = startTime.year
    const start_Week = startTime.week
    const end_Year = endTime.year
    const end_Week = endTime.week
    if (Number(start_Year) < Number(end_Year)) {
      return true
    } else if (Number(start_Year) === Number(end_Year) && end_Week >= start_Week) {
      return true
    } else {
      message.info('时间设置有误')
      return false
    }
  }

  // 查询某用户所有周报
  const getSource = async (firstClick: boolean) => {
    if (chooseNO) {
      setSearchType(0)
      if (firstClick) {
        setCurrent(1)
      }
      setLoading(true)
      const res = await getSomeBodyReporters(chooseNO, current, 10)
      if (res?.code === 200) {
        setLoading(false)
        setTotal(res.data.total)
        setSource(res.data.weeklyReports)
      } else {
        message.error('请求出错，请联系管理员')
      }
    } else {
      message.info('请选择用户')
    }
  }

  // 某人某时间段团队贡献
  const clickSearch = async (firstClick: boolean) => {
    if (checkNoAndRange() && value && value[0] && value[1]) {
      setSearchType(2)
      if (firstClick) {
        setCurrent(1)
      }
      setLoading(true)
      const startTimeInfo = returnYMW(value[0], time[0])
      const endTimeInfo = returnYMW(value[1], time[1])
      if (checkTime(startTimeInfo, endTimeInfo)) {
        const res = await getuserteamwork(current, 10, chooseNO!, startTimeInfo, endTimeInfo)
        if (res?.code === 200) {
          setLoading(false)
          setTeamWorkInfo(res.data.weeklyTeamWork)
        } else {
          message.error('请求出错，请联系管理员')
        }
      }
    }
  }

  // 某人某时间段周报
  const reportSearch = async (firstClick: boolean) => {
    if (checkNoAndRange() && value && value[0] && value[1]) {
      setSearchType(1)
      if (firstClick) {
        setCurrent(1)
      }
      setLoading(true)
      const startTimeInfo = returnYMW(value[0], time[0])
      const endTimeInfo = returnYMW(value[1], time[1])
      if (checkTime(startTimeInfo, endTimeInfo)) {
        const res = await getusertimereport(current, 10, chooseNO!, startTimeInfo, endTimeInfo)
        if (res?.code === 200) {
          setLoading(false)
          setTotal(res.data.total)
          setSource(res.data.weeklyReports)
        } else {
          message.error('请求出错，请联系管理员')
        }
      }
    }
  }

  // 点击查看详情
  const clickDetailMoal = (record: ITeamWorkItem) => {
    setTeamModal(true)
    setDetailInfo({ title: record.title, content: record.content, attach: JSON.parse(record.attach) })
  }

  useEffect(() => {
    switch (searchType) {
      case 0:
        getSource(false)
        break
      case 1:
        reportSearch(false)
        break
      case 2:
        clickSearch(false)
        break
      default:
        console.log('')
    }
  }, [current])

  const clickView = (record: IWeeklyReports) => {
    setDetail(record)
  }

  useEffect(() => {
    getUserList()
  }, [])
  return (
    <div className={style.back}>
      <div className={style.header}>
        <Select
          showSearch
          style={{ width: '250px' }}
          placeholder='请选择用户'
          onChange={handleChange}
          options={userList}
        ></Select>
        <DatePicker.RangePicker style={{ marginLeft: '5px' }} disabledDate={disabledDate} onChange={onChange} picker="week" />
        <Button type={searchType === 0 ? 'primary' : 'default'} style={{ marginLeft: '5px' }} onClick={() => getSource(true)} >查询用户<b>所有周报</b></Button>
        <Button type={searchType === 1 ? 'primary' : 'default'} style={{ marginLeft: '5px' }} onClick={() => reportSearch(true)}>查询指定时间段<b>周报</b>情况</Button>
        <Button type={searchType === 2 ? 'primary' : 'default'} style={{ marginLeft: '5px' }} onClick={() => clickSearch(true)}>查询指定时间段<b>团队贡献</b>情况</Button>
      </div>
      {
        searchType === 0 || searchType === 1
          ? <Table
            loading={loading}
            dataSource={source}
            pagination={paginationProps}
          >
            <Column title="周" dataIndex="time" key="time" />
            <Column title="创建时间" dataIndex="createTime" key="createTime" render={(value: string) => dayjs(value).format('YYYY-MM-DD')} />
            <Column title="更新时间" dataIndex="updateTime" key="updateTime" render={(value: string) => dayjs(value).format('YYYY-MM-DD')} />
            <Column title="团队贡献" dataIndex="teamWorks" key="teamWorks" render={(value: IBaseTeamWork[]) => value.map((item, index) =>
              <div key={item.id}>{(index + 1).toString() + '. ' + renderType(item.type as IWorkType) + '  ' + item.duration + '半天'}</div>
            )}></Column>
            <Column title='周报状态(管理员)' dataIndex="adminStatus" key="adminStatus" render={(value: 0 | 1 | 2) => renderastatus(value)}></Column>
            <Column title="操作" render={(_: any, record: IWeeklyReports) => <div className={style.a_box}><a onClick={() => clickView(record)}>点击查看</a></div>} />
          </Table>
          : <Table
            loading={loading}
            dataSource={teamworkInfos}
            pagination={paginationProps}
          >
            <Column title="年" dataIndex="year" key="year" />
            <Column title="周" dataIndex="week" key="week" />
            <Column title="标题" dataIndex="title" key="title" />
            <Column title="类型" dataIndex="type" key="type" render={(value: IWorkType) => renderType(value)} />
            <Column title="团队贡献时长" dataIndex="duration" key="duration" render={(value: string) => value + '（半天）'}></Column>
            <Column title="创建时间" dataIndex="createTime" key="createTime" render={(value: string) => dayjs(value).format('YYYY-MM-DD')} />
            <Column title="更新时间" dataIndex="updateTime" key="updateTime" render={(value: string) => dayjs(value).format('YYYY-MM-DD')} />
            <Column title="详情" render={(_: any, record: ITeamWorkItem) => <a onClick={() => clickDetailMoal(record)}>点击查看详情</a>} />
          </Table>
      }
      {
        detail ? <Detail getSource={() => getSource(false)} reportSearch={() => reportSearch(false)} searchType={searchType} getUserList={getUserList} detail={detail} detailReturn={() => setDetail(undefined)}></Detail> : null
      }
      {
        <Modal
          title={detailInfo.title}
          open={teamModal}
          footer={null}
          onCancel={() => setTeamModal(false)}
        >
          <div className={style.border}>
            <div style={{ margin: '2px' }} dangerouslySetInnerHTML={{ __html: detailInfo?.content }}></div>
            {
              detailInfo.attach.map(item => <div key={item.url} className={style.urlBox}>
                <a href={item.url} className={style.url}>{item.fileName}</a>
              </div>
              )
            }
          </div>
        </Modal>
      }
    </div>
  )
}
