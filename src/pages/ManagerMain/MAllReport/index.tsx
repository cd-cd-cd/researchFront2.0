import { DatePicker, Button, type DatePickerProps, message, Table, Modal } from 'antd'
import { type RangePickerProps } from 'antd/lib/date-picker'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { getusertimes, getusertimeteamwork, type ITime } from '../../../api/Manager'
import { type IUserTimesTeamWorkInfo, type IUserTimeInfo, type ITeamWorkItem, type IList } from '../../../libs/model'
import Column from 'antd/lib/table/Column'
import useReport from '../../../hooks/useReport'
import style from './index.module.scss'

export default function MAllReport() {
  const { renderType } = useReport()
  const [time, setTime] = useState<string[]>([])
  const [value, setValue] = useState<RangePickerProps['value']>()
  // 控制table loading
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>(0)
  const [reportSource, setReportSource] = useState<IUserTimeInfo[]>()
  const [teamSource, setTeamSource] = useState<IUserTimesTeamWorkInfo[]>()
  // 保存查询方式 // 0 查周报 1 查贡献
  const [searchType, setSearchType] = useState<number>()
  const [isDetail, setIsDetail] = useState(false)
  const [modalInfo, setModalInfo] = useState<ITeamWorkItem>()

  const onChange = (
    value: RangePickerProps['value'],
    dateString: [string, string]
  ) => {
    setValue(value)
    setTime(dateString)
  }

  const checkTime = () => {
    if (!time[0] || !time[1]) {
      message.info('请选择时间')
      return false
    } else {
      return true
    }
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
  const checkTime2 = (startTime: ITime, endTime: ITime) => {
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

  // 查周报
  const getReport = async (firstClick: boolean) => {
    if (checkTime() && value && value[0] && value[1]) {
      setSearchType(0)
      if (firstClick) {
        setCurrent(1)
      }
      setLoading(true)
      const startTimeInfo = returnYMW(value[0], time[0])
      const endTimeInfo = returnYMW(value[1], time[1])
      if (checkTime2(startTimeInfo, endTimeInfo)) {
        const res = await getusertimes(current, 10, startTimeInfo, endTimeInfo)
        if (res?.code === 200) {
          setLoading(false)
          setReportSource(res.data.userTimesInfo)
          setTotal(res.data.total)
        } else {
          message.error('请求出错，请联系管理员')
        }
      }
    }
  }

  // 查贡献
  const getTeamWork = async (firstClick: boolean) => {
    if (checkTime() && value && value[0] && value[1]) {
      setSearchType(1)
      if (firstClick) {
        setCurrent(1)
      }
      setLoading(true)
      const startTimeInfo = returnYMW(value[0], time[0])
      const endTimeInfo = returnYMW(value[1], time[1])
      if (checkTime2(startTimeInfo, endTimeInfo)) {
        const res = await getusertimeteamwork(current, 10, startTimeInfo, endTimeInfo)
        if (res?.code === 200) {
          setLoading(false)
          setTeamSource(res.data.userTimesTeamWorkInfo)
          setTotal(res.data.total)
        } else {
          message.error('请求出错，请联系管理员')
        }
      }
    }
  }

  useEffect(() => {
    switch (searchType) {
      case 0:
        getReport(false)
        break
      case 1:
        getTeamWork(false)
        break
      default:
        console.log('')
    }
  }, [current])
  return (
    <div>
      <div>
        <DatePicker.RangePicker style={{ marginLeft: '5px' }} disabledDate={disabledDate} onChange={onChange} picker="week" />
        <Button type={searchType === 0 ? 'primary' : 'default'} style={{ marginLeft: '5px' }} onClick={() => getReport(true)}>查询周报</Button>
        <Button type={searchType === 1 ? 'primary' : 'default'} style={{ marginLeft: '5px' }} onClick={() => getTeamWork(true)}>查询贡献程度</Button>
      </div>
      {
        searchType === 0
          ? <Table
            loading={loading}
            dataSource={reportSource}
            pagination={paginationProps}
          >
            <Column title="学号" dataIndex="studentNo" key="studentNo" />
            <Column title="姓名" dataIndex="name" key="name" />
            <Column title="周报提交次数" dataIndex="times" key="times" />
          </Table>
          : <Table
            loading={loading}
            dataSource={teamSource}
            pagination={paginationProps}
          >
            <Column title="学号" dataIndex="studentNo" key="studentNo" />
            <Column title="姓名" dataIndex="name" key="name" />
            <Column title="贡献次数" dataIndex="workTimes" key="workTimes" />
            <Column title="贡献总时长（半天）" dataIndex="workTotalDuration" key="workTotalDuration" />
            <Column title="详情" render={(_: any, record: IUserTimesTeamWorkInfo) => record.teamWorksList.map((item, index) => <a onClick={() => { setModalInfo(item); setIsDetail(true) }} style={{ display: 'block' }} key={item.id}>{(index + 1) + '. ' + renderType(item.type) + ' ' + item.duration + '半天'}</a>)}></Column>
          </Table>
      }
      <Modal
        title={modalInfo?.title}
        footer={null}
        open={isDetail}
        onCancel={() => setIsDetail(false)}
      >
        <div style={{ margin: '2px' }} dangerouslySetInnerHTML={{ __html: modalInfo?.content ? modalInfo?.content : '' }}></div>
        {
          modalInfo
            ? (JSON.parse(modalInfo?.attach as string) as IList[])
                .map(item => <div key={item.url} className={style.urlBox}>
                <a href={item.url} className={style.url}>{item.fileName}</a>
              </div>)
            : null
        }
      </Modal>
    </div>
  )
}
