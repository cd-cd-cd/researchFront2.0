import {
  Button,
  DatePicker,
  message,
  type DatePickerProps,
  Tooltip,
  Anchor
} from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import style from './index.module.scss'
import WeekPlan from './WeekPlan'
import NextWeekPlan from './NextWeekPlan'
import {
  type IWeekProgress,
  type ITeamWork,
  type IWeekPlan,
  type IBaseTeamWork
} from '../../../libs/model'
import TeamWorkItem from './TeamWorkItem'
import AddIcon from '../../../assets/imgs/add.png'
import { v4 as uuidv4 } from 'uuid'
import Preview from './Preview'
import { addweeklyreport } from '../../../api/Member'
import { type RangePickerProps } from 'antd/lib/date-picker'
import moment from 'moment'
import { context } from '../../../hooks/store'
export default function MemberWeekReport() {
  const { editRecord, setEditRecord } = useContext(context)
  const [teamWorks, setTeamWorks] = useState<ITeamWork[]>([
    {
      id: uuidv4(),
      type: null,
      title: null,
      duration: null,
      content: '',
      attach: [],
      show: false
    },
    {
      id: uuidv4(),
      type: null,
      title: null,
      duration: null,
      content: '',
      attach: [],
      show: false
    },
    {
      id: uuidv4(),
      type: null,
      title: null,
      duration: null,
      content: '',
      attach: [],
      show: false
    },
    {
      id: uuidv4(),
      type: null,
      title: null,
      duration: null,
      content: '',
      attach: [],
      show: false
    },
    {
      id: uuidv4(),
      type: null,
      title: null,
      duration: null,
      content: '',
      attach: [],
      show: false
    }
  ])
  const [teamWorkLength, setTeamWorkLength] = useState(0)
  const [time, setTime] = useState<string>()
  const [value, setValue] = useState<moment.Moment | null | undefined>()
  const [weekProgress, setWeekProgress] = useState<IWeekProgress>(
    editRecord
      ? editRecord.weekProgress
      : {
          content: '',
          attach: []
        }
  )
  const [weekPlan, setWeekPlan] = useState<IWeekPlan>(
    editRecord
      ? editRecord.weekPlan
      : {
          content: '',
          attach: []
        }
  )
  const [isPreview, setIsPreview] = useState(false)

  // 检查团队服务表单内容
  const checkTeamWorks = () => {
    if (teamWorkLength) {
      for (const item of teamWorks.slice(0, teamWorkLength)) {
        const { type, title, duration, content } = item
        if (!content || content === '<p><br></p>') {
          message.info('有团队服务未填写完成')
          return false
        } else if (!type) {
          message.info('有团队服务-类型未填写完成')
          return false
        } else if (!title) {
          message.info('有团队服务-标题未填写完成')
          return false
        } else if (!duration) {
          message.info('有团队服务-时长未填写完成')
          return false
        }
      }
    }
    return true
  }

  const onChange: DatePickerProps['onChange'] = (
    values: any,
    dataString: string
  ) => {
    setTime(dataString)
    setValue(values)
  }

  // 检查所有表单内容
  const checkForm = () => {
    if (!time) {
      message.info('周报时间未选择')
      return false
    } else if (
      !weekProgress?.content ||
      weekProgress?.content === '<p><br></p>'
    ) {
      message.info('本周进展未填写')
      return false
    } else if (!weekPlan.content || weekPlan.content === '<p><br></p>') {
      message.info('下周计划未填写')
      return false
    }
    return true
  }

  const clickPreview = () => {
    // 新建周报
    if (!editRecord) {
      const checkRes = checkTeamWorks() && checkForm() && value
      if (checkRes) {
        document.body.scrollTop = document.documentElement.scrollTop = 0
        setIsPreview(true)
      }
    } else {
      // 更新周报
      const checkRes = checkTeamWorks() && checkForm()
      if (checkRes) {
        document.body.scrollTop = document.documentElement.scrollTop = 0
        setIsPreview(true)
      }
    }
  }

  const submitClick = async () => {
    // 创建周报
    if (!editRecord) {
      const checkRes = checkTeamWorks() && checkForm() && value
      if (checkRes) {
        const year = (value as any).format('YYYY')
        let month = (value as any).format('MM')
        if (month.split('')[0] === '0') {
          month = month.split('')[1]
        }
        const week = time?.split('-')[1].slice(0, -1)
        const realTeamWorks = teamWorks
          .slice(0, teamWorkLength)
          .reduce((pre: IBaseTeamWork[], cur) => {
            pre.push({
              id: cur.id,
              type: cur.type,
              title: cur.title,
              duration: cur.duration,
              content: cur.content,
              attach: cur.attach
            })
            return pre
          }, [])
        const res = await addweeklyreport(
          time!,
          year,
          month,
          week!,
          weekProgress,
          weekPlan,
          realTeamWorks,
          true
        )
        if (res?.code === 200) {
          message.success('上传成功')
          realRest()
        } else {
          message.info(res?.message)
        }
      }
    } else {
      // 更新周报
      const checkRes = checkTeamWorks() && checkForm()
      if (checkRes) {
        const realTeamWorks = teamWorks
          .slice(0, teamWorkLength)
          .reduce((pre: IBaseTeamWork[], cur) => {
            pre.push({
              id: cur.id,
              type: cur.type,
              title: cur.title,
              duration: cur.duration,
              content: cur.content,
              attach: cur.attach
            })
            return pre
          }, [])
        const res = await addweeklyreport(
          editRecord.time,
          editRecord.year,
          editRecord.month,
          editRecord.week,
          weekProgress,
          weekPlan,
          realTeamWorks,
          false
        )
        if (res?.code === 200) {
          message.success('修改成功')
          resetAll()
        } else {
          message.info(res?.message)
        }
      }
    }
  }

  const addFirstTeamWork = () => {
    if (teamWorkLength === 0) {
      setTeamWorkLength(teamWorkLength + 1)
      const id = teamWorks[0].id
      setTeamWorks(
        teamWorks.map((item) => {
          if (item.id === id) {
            item.show = true
          }
          return item
        })
      )
    }
  }

  const addTeamWorks = () => {
    if (teamWorkLength === 5) {
      message.info('最多添加五项团队服务细则')
    } else {
      const id = teamWorks[teamWorkLength].id
      setTeamWorks(
        teamWorks.map((item) => {
          if (item.id === id) {
            item.show = true
          }
          return item
        })
      )
      setTeamWorkLength(teamWorkLength + 1)
    }
  }

  const deTeamWorks = (id: string) => {
    setTeamWorks(
      teamWorks.map((item) => {
        if (item.id === id) {
          item.show = false
          item.type = null
          item.duration = null
          item.content = ''
          item.attach = []
        }
        return item
      })
    )
    setTeamWorkLength(teamWorkLength - 1)
  }

  // 修改周报初始化页面数据
  const initEditPage = () => {
    if (editRecord) {
      setTime(editRecord.time)
      setValue(value)
      setWeekPlan(editRecord.weekPlan)
      setWeekProgress(editRecord.weekProgress)
      const len = editRecord.teamWorks.length
      setTeamWorkLength(len)
      const tempArr = []
      for (let i = 0; i < 5 - len; i++) {
        tempArr.push({
          id: uuidv4(),
          type: null,
          title: null,
          duration: null,
          content: '',
          attach: [],
          show: false
        })
      }
      const tempTeamWorks = editRecord.teamWorks.reduce(
        (pre: ITeamWork[], cur) => {
          pre.push({
            id: cur.id,
            type: cur.type,
            title: cur.title,
            duration: cur.duration,
            content: cur.content,
            attach: cur.attach,
            show: true
          })
          return pre
        },
        []
      )
      setTeamWorks([...tempTeamWorks, ...tempArr])
    }
  }
  const realRest = () => {
    setTime('')
    setValue(undefined)
    setWeekProgress({
      content: '',
      attach: []
    })
    setWeekPlan({
      content: '',
      attach: []
    })
    setTeamWorkLength(0)
    setTeamWorks([
      {
        id: uuidv4(),
        type: null,
        title: null,
        duration: null,
        content: '',
        attach: [],
        show: false
      },
      {
        id: uuidv4(),
        type: null,
        title: null,
        duration: null,
        content: '',
        attach: [],
        show: false
      },
      {
        id: uuidv4(),
        type: null,
        title: null,
        duration: null,
        content: '',
        attach: [],
        show: false
      },
      {
        id: uuidv4(),
        type: null,
        title: null,
        duration: null,
        content: '',
        attach: [],
        show: false
      },
      {
        id: uuidv4(),
        type: null,
        title: null,
        duration: null,
        content: '',
        attach: [],
        show: false
      }
    ])
  }

  const resetAll = () => {
    if (editRecord) {
      initEditPage()
    } else {
      realRest()
    }
  }

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day')
  }

  useEffect(() => {
    initEditPage()
    return () => {
      // 离开要清空编辑record
      setEditRecord(null)
    }
  }, [])

  return (
    <div className={style.back}>
      <div className={style.main} id="report">
        <Button
          className={style.reset_btn}
          id="reset"
          onClick={() => resetAll()}
        >
          重置
        </Button>
        <div className={style.title}>周报{editRecord ? '(修改)' : ''}</div>
        {editRecord ? (
          <div className={style.editTime} id="time">
            {editRecord.time}
          </div>
        ) : (
          <div className={style.date} id="time">
            <DatePicker
              disabledDate={disabledDate}
              onChange={onChange}
              value={value}
              picker="week"
            />
          </div>
        )}
        <WeekPlan
          weekProgress={weekProgress}
          setWeekProgress={setWeekProgress}
        ></WeekPlan>
        <NextWeekPlan
          weekPlan={weekPlan}
          setWeekPlan={setWeekPlan}
        ></NextWeekPlan>
        <div className={style.partOne}>
          <Tooltip title="点击创建团队服务">
            <span
              className={teamWorkLength ? style.noClick : style.headOneNoClick}
              onClick={() => addFirstTeamWork()}
            >
              三、团队服务
            </span>
          </Tooltip>
          {teamWorkLength ? (
            <>
              {teamWorks.slice(0, teamWorkLength).map((item, index) => (
                <TeamWorkItem
                  index={index}
                  teamWorkLength={teamWorkLength}
                  teamWorks={teamWorks}
                  info={item}
                  setTeamWorks={setTeamWorks}
                  key={item.id}
                  deTeamWorks={deTeamWorks}
                ></TeamWorkItem>
              ))}
              <img
                src={AddIcon}
                className={style.addIcon}
                onClick={() => addTeamWorks()}
              ></img>
            </>
          ) : null}
        </div>
        <div className={style.submit}>
          <Button onClick={() => clickPreview()}>预览</Button>
          <Button onClick={() => submitClick()}>提交</Button>
        </div>
      </div>
      {isPreview ? (
        <Preview
          submitClick={submitClick}
          time={time as string}
          teamWorks={teamWorkLength ? teamWorks : []}
          weekProgress={weekProgress}
          weekPlan={weekPlan}
          setIsPreview={() => setIsPreview(false)}
        />
      ) : null}
    </div>
  )
}
