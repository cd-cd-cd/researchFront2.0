import React from 'react'
import style from './index.module.scss'
import { Button, Tag, message } from 'antd'
import { type IDeviceApply } from '../../../../libs/model'
import { cencelrecord, type IResGetApplyRecord } from '../../../../api/Member'
interface Props {
  info: IResGetApplyRecord
  getDeviceLists: () => void
  getApplyLists: () => void
}

export default function ApplyItem({ info, getDeviceLists, getApplyLists }: Props) {
  // 渲染申请状态
  const renderApplyState = (state: IDeviceApply) => {
    switch (state) {
      case 1:
        return <Tag color='gray'>已过期</Tag>
      case 2:
        return <Tag color='green'>待审批</Tag>
      case 3:
        return <Tag color='blue'>正在使用</Tag>
      case 4:
        return <Tag color='orange'>使用结束</Tag>
      case 5:
        return <Tag color='red'>审批拒绝</Tag>
      case 6:
        return <Tag color='gray'>申请已撤回</Tag>
    }
  }

  // 撤回申请
  const returnApply = async (id: string) => {
    const res = await cencelrecord(id)
    if (res?.code === 200) {
      message.success('撤回成功')
      getDeviceLists()
      getApplyLists()
    } else {
      message.info(res?.message)
    }
  }
  return (
    <div className={style.show_box}>
      <div className={style.main_head}>
        {
          renderApplyState(info.status)
        }
        {
          info.status === 2 ? <Button size='small' onClick={() => returnApply(info.id)}>撤回申请</Button> : null
        }
      </div>
      <div className={style.colOneToFour}>
        <span className={style.label2}>编号:</span>
        <span>{info.equipmentInfo.serialNumber}</span>
      </div>
      <div className={style.colOneToFour}>
        <span className={style.label2}>名称:</span>
        <span>{info.equipmentInfo.name}</span>
      </div>
      <div className={style.colOneToFour}>
        <span className={style.label2}>设备归还日期:</span>
        <span>{info.deadlineTime}</span>
      </div>
      <div className={style.colOneToFour}>
        <span className={style.label2}>申请理由:</span>
        <span>{info.applyReason ? info.applyReason : '无'}</span>
      </div>
      <div className={style.colOneToFour}>
        <span className={style.label2}>申请时间:</span>
        <span>{info.applyTime}</span>
      </div>
      {
        info.refuseReason
          ? <div className={style.colOneToFour}>
            <span className={style.label2}>拒绝理由:</span>
            <span>{info.refuseReason}</span>
          </div>
          : null
      }
      {
        info.checkUserInfo
          ? <>
          <div className={style.colOneToFour}>
            <span className={style.label2}>审批人:</span>
            <span>{info.checkUserInfo.studentNo + info.checkUserInfo.username}</span>
          </div>
          <div className={style.colOneToFour}>
            <span className={style.label2}>审批时间:</span>
            <span>{info.checkUserInfo.createTime}</span>
          </div>
          </>
          : null
      }
    </div>
  )
}
