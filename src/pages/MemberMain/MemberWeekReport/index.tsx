import { Button, DatePicker, message, type DatePickerProps, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import WeekPlan from './WeekPlan'
import NextWeekPlan from './NextWeekPlan'
import { type ITeamWork } from '../../../libs/model'
import TeamWorkItem from './TeamWorkItem'
import AddIcon from '../../../assets/imgs/add.png'
import { v4 as uuidv4 } from 'uuid'

export default function MemberWeekReport() {
  const [time, setTime] = useState<string>()
  const [value, setValue] = useState()
  const [weekPlanHtml, setWeekPlanHtml] = useState('')
  const [nextWeekHtml, setNextWeekHtml] = useState('')
  const [teamWorks, setTeamWorks] = useState<ITeamWork[]>([])

  const onChange: DatePickerProps['onChange'] = (
    values: any,
    dataString: string
  ) => {
    setTime(dataString)
    setValue(values)
  }

  // 增加团队服务
  const addTeamWork = () => {
    setTeamWorks([...teamWorks, { id: uuidv4(), type: null, duration: null, content: '' }])
  }

  // 减少团队服务
  const deleteWork = (id: string) => {
    setTeamWorks(teamWorks.filter(item => item.id !== id))
  }

  // 更新团队服务
  const updateWork = (type: 'workType' | 'duration' | 'content', id: string, value: string | number) => {
    setTeamWorks(teamWorks.map(item => {
      if (item.id === id) {
        if (type === 'workType') {
          item.type = value as string
        } else if (type === 'duration') {
          item.duration = value as number
        } else if (type === 'content') {
          item.content = value as string
        }
      }
      return item
    }))
  }

  // 检查团队服务表单内容
  const checkTeamWorks = () => {
    for (const item of teamWorks) {
      const { type, duration, content } = item
      if (!type || !duration || !content.length) {
        message.info('有团队服务未填写完成')
        return false
      }
    }
    return true
  }

  // 检查所有表单内容
  const checkForm = () => {
    if (!time) {
      message.info('周报时间未选择')
      return false
    } else if (!weekPlanHtml) {
      message.info('本周进展未填写')
      return false
    } else if (!nextWeekHtml) {
      message.info('下周计划未填写')
      return false
    }
    return true
  }

  const submitClick = () => {
    const checkRes = checkTeamWorks() && checkForm()
    if (checkRes) {
      console.log('time', time)
      console.log('本周进展', weekPlanHtml)
      console.log('下周计划', nextWeekHtml)
      console.log('团队服务', teamWorks)
    }
  }

  const resetAll = () => {
    setTime('')
    setValue(undefined)
    setWeekPlanHtml('')
    setNextWeekHtml('')
    setTeamWorks([])
  }
  return (
    <div>
      <div className={style.main} id='report'>
        <Button className={style.reset_btn} id='reset' onClick={() => resetAll()}>重置</Button>
        <div className={style.title}>周报</div>
        <div className={style.date} id='time'>
          <DatePicker onChange={onChange} value={value} picker="week" />
        </div>
        <WeekPlan weekPlanHtml={weekPlanHtml} setWeekPlanHtml={setWeekPlanHtml}></WeekPlan>
        <NextWeekPlan nextWeekHtml={nextWeekHtml} setNextWeekHtml={setNextWeekHtml}></NextWeekPlan>
        <div className={style.partOne}>
          <Tooltip title="点击创建团队服务">
            <span className={teamWorks.length ? style.noClick : style.headOneNoClick} onClick={() => addTeamWork()}>三、团队服务</span>
          </Tooltip>
          {
            teamWorks.map(item => <TeamWorkItem deleteWork={deleteWork} key={item.id} updateWork={updateWork} item={item}></TeamWorkItem>)
          }
        </div>
        <div className={style.submit}>
          <Button onClick={() => submitClick()}>提交</Button>
        </div>
      </div>
    </div>
  )
}
