import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import { addbackup, addrecover, getbackups } from '../../../api/Manager'
import { Button, Input, Modal, Table, message } from 'antd'
import Column from 'antd/lib/table/Column'
import { type ILeaderInfo, type IBackupRecords } from '../../../libs/model'

export default function DataBackup() {
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<IBackupRecords[]>()
  // 备注
  const [remarkData, setRemarkData] = useState('')
  // 恢复
  const [modal, setModal] = useState(false)
  // 记录版本号
  const [version, setVersion] = useState('')

  // 得到数据备份数据
  const getData = async () => {
    setLoading(true)
    const res = await getbackups(current, 10)
    if (res?.code === 200) {
      setSource(res.data.backupRecords)
      setTotal(res.data.total)
      setLoading(false)
    }
  }

  const paginationProps = {
    pageSize: 10,
    current,
    total,
    onChange: (pageNum: number) => {
      setCurrent(pageNum)
    }
  }

  // 备份
  const backUp = async () => {
    const res = await addbackup(remarkData)
    if (res?.code === 200) {
      message.success('备份成功')
      setRemarkData('')
      getData()
    }
  }
  // 恢复版本
  const handleOk = async () => {
    if (!version) return
    const res = await addrecover(version)
    if (res?.code === 200) {
      setModal(false)
      getData()
      setVersion('')
      message.success('版本恢复成功')
    }
  }
  useEffect(() => {
    getData()
  }, [current])
  return (
    <div>
      <div className={style.btns}>
        <Input
          placeholder="填写备注"
          maxLength={100}
          showCount
          className={style.input}
          value={remarkData}
          onChange={(e) => setRemarkData(e.target.value.trim())}
        ></Input>
        <Button onClick={() => backUp()}>备份当前数据</Button>
      </div>
      <div>
        <Table
          loading={loading}
          dataSource={source}
          pagination={paginationProps}
        >
          <Column title="数据版本号" dataIndex="version" key="version" />
          <Column
            title="操作人"
            dataIndex="userInfo"
            key="userInfo"
            render={(value: ILeaderInfo, _) => (value ? value.studentNo : '')}
          />
          <Column title="创建时间" dataIndex="createTime" key="createTime" />
          <Column title="备注" dataIndex="remark" key="remark" />
          <Column
            title="恢复版本数据"
            render={(_: any, record: IBackupRecords) => (
              <a
                onClick={() => {
                  setModal(true)
                  setVersion(record.version)
                }}
              >
                恢复
              </a>
            )}
          ></Column>
        </Table>
      </div>
      <Modal
        title="提醒"
        open={modal}
        onOk={handleOk}
        onCancel={() => setModal(false)}
      >
        <p>你确定要恢复{version}版本数据吗？该操作会导致数据重置，请谨慎操作</p>
      </Modal>
    </div>
  )
}
