import React from 'react'
import style from '../../index.module.scss'
import { Button } from 'antd'
import { type IWeekProgress, type ITeamWork, type IWorkType, type IWeekPlan } from '../../../../../libs/model'
import useReport from '../../../../../hooks/useReport'
interface Props {
  time: string
  teamWorks: ITeamWork[]
  weekProgress: IWeekProgress
  weekPlan: IWeekPlan
  setIsPreview: () => void
}
export default function Preview({ time, teamWorks, weekProgress, weekPlan, setIsPreview }: Props) {
  const { renderType } = useReport()
  return (
    <div className={style.preview} id='preview'>
      <div className={style.main} id='report'>
        <div className={style.title}>周报</div>
        <div className={style.date} id='time'>
          {time}
        </div>
        <div className={style.partOne}>
          <div className={style.headOne}>一、本周进展</div>
          <div className={style.border}>
            <div dangerouslySetInnerHTML={{ __html: weekProgress.content }}></div>
            {
              weekProgress.attach.map(item => <div key={item.url} className={style.urlBox}>
                <a href={item.url} className={style.url}>{item.fileName}</a>
              </div>
              )
            }
          </div>
        </div>
        <div className={style.partOne}>
          <div className={style.headOne}>二、下周计划</div>
          <div className={style.border}>
            <div dangerouslySetInnerHTML={{ __html: weekPlan.content }}></div>
            {
              weekPlan.attach.map(item => <div key={item.url} className={style.urlBox}>
                <a href={item.url} className={style.url}>{item.fileName}</a>
              </div>
              )
            }
          </div>
        </div>
        {
          teamWorks.length
            ? <div className={style.partOne}>
              <div className={style.headOne}>三、团队服务</div>
              <div>
                {
                  teamWorks.filter(item => item.show).map((item, index) => <div key={item.id} className={style.border}>
                    <div>
                      <div className={style.Teamworktitle}>{index + 1}. {item.title}</div>
                      <div className={style.type}>类型： {item.type ? renderType(item.type as IWorkType) : ''}</div>
                      <div className={style.time}>服务时长：{item.duration} 个半天</div>
                    </div>
                    <div style={{ margin: '2px' }} dangerouslySetInnerHTML={{ __html: item.content }}></div>
                    {
                      item.attach.map(item => <div key={item.url} className={style.urlBox}>
                        <a href={item.url} className={style.url}>{item.fileName}</a>
                      </div>
                      )
                    }
                  </div>)
                }
              </div>
            </div>
            : null
        }
        <div className={style.submit}>
          <Button onClick={setIsPreview}>返回</Button>
        </div>
      </div>
    </div >
  )
}
