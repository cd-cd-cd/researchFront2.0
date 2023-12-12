import {
  DatePicker,
  Button,
  type DatePickerProps,
  message,
  Table,
  Modal,
  Select
} from 'antd'
import { type RangePickerProps } from 'antd/lib/date-picker'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
  getSelectMembers,
  getusertimes,
  getusertimeteamwork,
  type ITime
} from '../../../api/Manager'
import {
  type IUserTimesTeamWorkInfo,
  type IUserTimeInfo,
  type ITeamWorkItem,
  type IList,
  type ISearchTeam,
  type IOption,
  type ImemberList
} from '../../../libs/model'
import Column from 'antd/lib/table/Column'
import useReport from '../../../hooks/useReport'
import style from './index.module.scss'
export default function MAllReport() {
  const { renderType } = useReport()

  // 控制table loading
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>(0)
  const [reportSource, setReportSource] = useState<IUserTimeInfo[]>()
  const [teamSource, setTeamSource] = useState<IUserTimesTeamWorkInfo[]>()
  const [isDetail, setIsDetail] = useState(false)
  const [modalInfo, setModalInfo] = useState<ITeamWorkItem>()
  // 保存组信息
  const [teamInfos, setTeaminfos] = useState<IOption[]>()
  // 保存组信息(全部)
  const [teamInfosAll, setTeamInfosAll] = useState<ImemberList[]>()
  // 保存成员信息
  const [memberInfos, setMemberInfos] = useState<IOption[]>()
  // 保存点击的成员
  const [clickMembers, setClickMembers] = useState<string>()
  // 保存查询范围
  const [searchRange, setSearchRange] = useState<ISearchTeam>({
    time: undefined,
    value: undefined,
    searchType: undefined,
    teamMark: undefined,
    personMark: undefined
  })

  const [flag, setFlag] = useState(false)

  const onChange = (
    value: RangePickerProps['value'],
    dateString: [string, string]
  ) => {
    setSearchRange({
      ...searchRange,
      value,
      time: dateString
    })
  }

  const changeMembers = (value: any) => {
    setClickMembers(value)
    setSearchRange({ ...searchRange, personMark: value })
  }

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day')
  }

  const returnYMW = (value: moment.Moment, time: string) => {
    const year = (value as any).format('YYYY')
    let month = (value as any).format('MM')
    if (month.split('')[0] === '0') {
      month = month.split('')[1]
    }
    const week = time?.split('-')[1].slice(0, -1)
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

  // // 查询时间
  // const checkTime2 = (startTime: ITime, endTime: ITime) => {
  //   const start_Year = startTime.year
  //   const start_Week = startTime.week
  //   const end_Year = endTime.year
  //   const end_Week = endTime.week
  //   if (Number(start_Year) < Number(end_Year)) {
  //     return true
  //   } else if (
  //     Number(start_Year) === Number(end_Year) &&
  //     end_Week >= start_Week
  //   ) {
  //     return true
  //   } else {
  //     message.info('时间设置有误')
  //     return false
  //   }
  // }

  // 检验搜索范围
  const checkRange = () => {
    const { time, value, searchType, personMark, teamMark } = searchRange
    // 检查时间
    if (!time || !time[0] || !time[1] || !value || !value[0] || !value[1]) {
      message.info('搜索时间不为空!')
      return false
    }
    if (searchType !== 0 && searchType !== 1) {
      message.info('搜索类型不为空')
      return false
    }
    if (!teamMark) {
      message.info('请选择查询小组范围')
      return false
    } else if (teamMark !== '0' && !personMark) {
      message.info('请选择查询成员范围')
      return false
    }
    return true
  }

  // 组长获得组内信息
  const getinfos = async () => {
    const res = await getSelectMembers()
    if (res?.code === 200) {
      setTeamInfosAll(res.data)
      const temp = res.data.reduce((pre: IOption[], cur) => {
        pre.push({
          value: cur.no,
          label: cur.teamname
        })
        return pre
      }, [])
      temp.unshift({
        value: '0',
        label: '全部'
      })
      setTeaminfos(temp)
    } else {
      message.info(res?.message)
    }
  }

  const changeTeam = (value: string) => {
    // 点击清楚成员下拉框
    setClickMembers('0')
    setSearchRange({ ...searchRange, personMark: '0', teamMark: value })
    if (value === '0' || !value) {
      setMemberInfos(undefined)
    } else {
      const temp = teamInfosAll?.filter((item) => item.no === value)[0]
      if (!temp?.members.length) return
      const temp2 = temp?.members.reduce((pre: IOption[], cur) => {
        pre.push({
          value: cur.studentNo,
          label: cur.username
        })
        return pre
      }, [])
      temp2?.unshift({
        value: '0',
        label: '全部'
      })
      setMemberInfos(temp2)
    }
  }

  // 类型
  const changeType = (value: number) => {
    setSearchRange({ ...searchRange, searchType: value })
  }

  // 点击查询
  const searchFunc = async () => {
    if (checkRange()) {
      const { time, value, searchType, personMark, teamMark } = searchRange
      let no
      if (teamMark === '0') {
        no = ''
      } else if (teamMark !== '0' && personMark === '0') {
        no = teamMark
      } else if (teamMark !== '0' && personMark !== '0') {
        no = personMark
      }
      if (!time || !time[0] || !time[1] || !value || !value[0] || !value[1]) {
        return false
      }
      // 0 周报 1 贡献
      if (searchType === 0) {
        const res = await getusertimes(
          current,
          10,
          returnYMW(value[0], time[0]),
          returnYMW(value[1], time[1]),
          no
        )
        if (res?.code === 200) {
          setTotal(res.data.total)
          setReportSource(res.data.userTimesInfo)
        }
      } else if (searchType === 1) {
        const res = await getusertimeteamwork(
          current,
          10,
          returnYMW(value[0], time[0]),
          returnYMW(value[1], time[1]),
          no
        )
        if (res?.code === 200) {
          setFlag(true)
          setTotal(res.data.total)
          setTeamSource(res.data.userTimesTeamWorkInfo)
        }
      }
    }
  }

  useEffect(() => {
    if (flag) {
      searchFunc()
    }
  }, [current])

  useEffect(() => {
    getinfos()
  }, [])
  return (
    <div>
      <div>
        <Select
          placeholder="请选择小组"
          style={{ width: 200 }}
          onChange={changeTeam}
          options={teamInfos}
        />
        {memberInfos?.length ? (
          <Select
            placeholder="请选择成员"
            style={{ width: 200 }}
            onChange={changeMembers}
            options={memberInfos}
            value={clickMembers}
          />
        ) : (
          ''
        )}
        <DatePicker.RangePicker
          style={{ marginLeft: '5px' }}
          disabledDate={disabledDate}
          onChange={onChange}
          picker="week"
        />
        <Select
          placeholder="请选择查询类型"
          style={{ width: 200 }}
          onChange={changeType}
          options={[
            {
              value: 0,
              label: '查询周报'
            },
            {
              value: 1,
              label: '查询贡献'
            }
          ]}
        />
        <Button onClick={() => searchFunc()}>查询</Button>
      </div>
      {searchRange.searchType === 0 ? (
        <Table
          loading={loading}
          dataSource={reportSource}
          pagination={paginationProps}
        >
          <Column title="学号" dataIndex="studentNo" key="studentNo" />
          <Column title="姓名" dataIndex="name" key="name" />
          <Column title="小组" dataIndex="teamName" key="teamName" />
          <Column title="周报提交次数" dataIndex="times" key="times" />
        </Table>
      ) : (
        ''
      )}
      {searchRange.searchType === 1 ? (
        <Table
          loading={loading}
          dataSource={teamSource}
          pagination={paginationProps}
        >
          <Column title="学号" dataIndex="studentNo" key="studentNo" />
          <Column title="姓名" dataIndex="name" key="name" />
          <Column title="贡献次数" dataIndex="workTimes" key="workTimes" />
          <Column
            title="贡献总时长（半天）"
            dataIndex="workTotalDuration"
            key="workTotalDuration"
          />
          <Column
            title="详情"
            render={(_: any, record: IUserTimesTeamWorkInfo) =>
              record.teamWorksList.map((item, index) => (
                <a
                  onClick={() => {
                    setModalInfo(item)
                    setIsDetail(true)
                  }}
                  style={{ display: 'block' }}
                  key={item.id}
                >
                  {index +
                    1 +
                    '. ' +
                    renderType(item.type) +
                    ' ' +
                    item.duration +
                    '半天'}
                </a>
              ))
            }
          ></Column>
        </Table>
      ) : (
        ''
      )}
      <Modal
        title={modalInfo?.title}
        footer={null}
        open={isDetail}
        onCancel={() => setIsDetail(false)}
      >
        <div
          style={{ margin: '2px' }}
          dangerouslySetInnerHTML={{
            __html: modalInfo?.content ? modalInfo?.content : ''
          }}
        ></div>
        {modalInfo
          ? (JSON.parse(modalInfo?.attach as string) as IList[]).map((item) => (
              <div key={item.url} className={style.urlBox}>
                <a href={item.url} className={style.url}>
                  {item.fileName}
                </a>
              </div>
            ))
          : null}
      </Modal>
    </div>
  )
}
