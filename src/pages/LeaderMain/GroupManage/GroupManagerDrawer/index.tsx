import { Drawer, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import { updateinfo, type ITeam } from '../../../../api/Leader'

interface Props {
  open: boolean
  setOpen: (x: boolean) => void
  teamInfo: ITeam
  getTeamInfo: () => void
}
export default function GroupManagerDrawer({ open, setOpen, teamInfo, getTeamInfo }: Props) {
  const [isEdit, setIsEdit] = useState(false)
  const [editInfo, setEditInfo] = useState(teamInfo)
  const closeDrawer = () => {
    setOpen(false)
  }

  const editBack = () => {
    setIsEdit(false)
    setEditInfo(teamInfo)
  }

  const check = () => {
    if (!editInfo.teamname || !editInfo.description || !editInfo.performance || !editInfo.task) {
      message.info('信息不能为空')
      return false
    }
    if (editInfo.teamname.length > 20) {
      message.info('组名不超过20字')
      return false
    } else if (editInfo.description.length > 500) {
      message.info('小组简介不超过500字')
      return false
    } else if (editInfo.task.length > 500) {
      message.info('小组任务不超过500字')
      return false
    } else if (editInfo.performance.length > 500) {
      message.info('小组成绩不超过500字')
      return false
    } else {
      return true
    }
  }
  const clickEdit = async () => {
    if (check()) {
      const res = await updateinfo(teamInfo.id, editInfo.teamname, editInfo.description, editInfo.performance, editInfo.task)
      if (res?.code === 200) {
        setIsEdit(false)
        getTeamInfo()
        message.success('修改成功')
      } else {
        message.info(res?.message)
      }
    }
  }

  return (
    <Drawer
      title="组信息"
      placement="right"
      onClose={() => closeDrawer()}
      open={open}
      width='600px'
    >
      <div className={style.groupInfo}>
        <div className={style.row}>
          <div className={style.label}>组名:</div>
          {
            isEdit
              ? <Input className={style.input} value={editInfo?.teamname} onChange={(e) => setEditInfo({ ...editInfo, teamname: e.target.value })}></Input>
              : <div>{teamInfo ? teamInfo.teamname : '暂无'}</div>
          }
        </div>
        <div className={style.row}>
          <div className={style.label}>小组任务:</div>
          {
            isEdit
              ? <Input.TextArea className={style.TextArea} value={editInfo?.task} onChange={(e) => setEditInfo({ ...editInfo, task: e.target.value })}></Input.TextArea>
              : <div>{teamInfo ? teamInfo.task : '暂无'}</div>
          }
        </div>
        <div className={style.row}>
          <div className={style.label}>小组成绩:</div>
          {
            isEdit
              ? <Input.TextArea className={style.TextArea} value={editInfo?.performance} onChange={(e) => setEditInfo({ ...editInfo, performance: e.target.value })}></Input.TextArea>
              : <div>{teamInfo ? teamInfo.performance : '暂无'}</div>
          }
        </div>
        <div className={style.row}>
          <div className={style.label}>小组简介:</div>
          {
            isEdit
              ? <Input.TextArea className={style.TextArea} value={editInfo?.description} onChange={(e) => setEditInfo({ ...editInfo, description: e.target.value })}></Input.TextArea>
              : <div>{teamInfo ? teamInfo.description : '暂无'}</div>
          }
        </div>
        <div>
          {
            isEdit
              ? <div className={style.aBox}>
                <a onClick={() => editBack()}>返回</a>
                <a onClick={() => clickEdit()}>修改</a>
              </div>
              : <a className={style.editClick} onClick={() => setIsEdit(true)}>编辑</a>
          }
        </div>
      </div>
    </Drawer>
  )
}
