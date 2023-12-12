import React, { useState } from 'react'
import style from './index.module.scss'
import { checkrecord, type IResGetDeviceRecord } from '../../../../api/Manager'
import { Button, Input, message } from 'antd'
interface Props {
  info: IResGetDeviceRecord
  closeAndRefresh: () => void
  getApplyInfos: (id: string) => void
  drawerId: string
}
export default function MDeviceApply({ info, closeAndRefresh, getApplyInfos, drawerId }: Props) {
  const [isRefuse, setIsRefuse] = useState(false)
  const [text, setText] = useState<string>()

  const returnRefuse = () => {
    setIsRefuse(false)
    setText('')
  }

  // 申请审批
  const checkPass = async () => {
    const res = await checkrecord(info.id, 'pass', '')
    if (res?.code === 200) {
      message.success('设备已成功分配!')
      closeAndRefresh()
    } else {
      message.info(res?.message)
    }
  }

  // 拒绝
  const refuseClick = async () => {
    const res = await checkrecord(info.id, 'refuse', text)
    if (res?.code === 200) {
      message.success('已拒绝该申请')
      getApplyInfos(drawerId)
      returnRefuse()
      // getDeviceLists()
    } else {
      message.info(res?.message)
    }
  }
  return (
    <div className={style.show_box}>
      <div className={style.colOneToFour}>
        <span className={style.label2}>申请人:</span>
        <span>{info.applyUserInfo.studentNo + '-' + info.applyUserInfo.username}</span>
      </div>
      <div className={style.colOneToFour}>
        <span className={style.label2}>申请理由:</span>
        <span>{info.applyReason ? info.applyReason : '无'}</span>
      </div>
      <div className={style.colOneToFour}>
        <span className={style.label2}>设备归还日期:</span>
        <span>{info.deadlineTime}</span>
      </div>
      <div className={style.colOneToFour}>
        <span className={style.label2}>申请时间:</span>
        <span>{info.applyTime}</span>
      </div>
      <div>
        <Button style={{ marginRight: '10px' }} size='small' onClick={() => checkPass()}>同意</Button>
        {
          isRefuse
            ? <Button size='small' onClick={() => returnRefuse()}>返回</Button>
            : <Button size='small' onClick={() => setIsRefuse(true)}>拒绝</Button>
        }
      </div>
      {
        isRefuse
          ? <div className={style.textArea}>
            <Input.TextArea value={text} onChange={(e) => setText(e.target.value)}></Input.TextArea>
            <Button size='small' className={style.confirm} onClick={() => refuseClick()}>确定</Button>
          </div>
          : null
      }
    </div>
  )
}
