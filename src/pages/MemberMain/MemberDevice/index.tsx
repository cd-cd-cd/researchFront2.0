import { Button, DatePicker, Drawer, Form, Input, Modal, Table, Tag, message } from 'antd'
import style from './index.module.scss'
import React, { useEffect, useState } from 'react'
import { type IEquipmentState, type IDevice } from '../../../libs/model'
import { type IRecipient, getDeviceInfos } from '../../../api/Manager'
import Column from 'antd/lib/table/Column'
import dayjs from 'dayjs'
import { type RangePickerProps } from 'antd/lib/date-picker'
import moment from 'moment'
import { useForm } from 'antd/lib/form/Form'
import { type IResGetApplyRecord, addApplyRecord, getapplyrecord } from '../../../api/Member'
import ApplyItem from './ApplyItem'

interface ISource {
  key: string
  id: string
  serialNumber: string
  name: string
  version: string
  originalValue: string
  performanceIndex: string
  address: string
  warehouseEntryTime: string
  remark: string
  formerRecipient: IRecipient | null
  recipient: IRecipient | null
  status: IEquipmentState
  applyNumber: number
}

export default function MemberDevice() {
  // 控制table loading
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>(0)
  // 存储table source
  const [source, setSource] = useState<ISource[]>()
  // 控制设备申请modal
  const [isDeviceApplyModal, setIsDeviceApplyModal] = useState(false)
  // 保存某个设备信息
  const [applyDeviceInfo, setApplyDeviceInfo] = useState<IDevice>()
  const [form] = useForm()
  // 控制drawer
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  // 保存申请历史
  const [applyHistory, setApplyHistory] = useState<IResGetApplyRecord[]>()
  // 得到设备信息
  const getDeviceLists = async () => {
    setLoading(true)
    const res = await getDeviceInfos(current, 8)
    if (res?.code === 200) {
      setLoading(false)
      const temp: ISource[] = res.data.equipments.reduce((pre: ISource[], cur) => {
        pre.push({
          key: cur.id,
          id: cur.id,
          serialNumber: cur.serialNumber,
          name: cur.name,
          version: cur.version,
          originalValue: cur.originalValue,
          performanceIndex: cur.performanceIndex,
          address: cur.address,
          warehouseEntryTime: dayjs(cur.warehouseEntryTime).format('YYYY-MM-DD'),
          remark: cur.remark,
          formerRecipient: cur.formerRecipient,
          recipient: cur.recipient,
          status: cur.status,
          applyNumber: cur.applyNumber
        })
        return pre
      }, [])
      setTotal(res.data.total)
      setSource(temp)
    }
  }

  // 状态
  const renderState = (state: IEquipmentState) => {
    if (state === 1) {
      return <Tag color='green'>闲置</Tag>
    } else if (state === 2) {
      return <Tag color='blue'>在用</Tag>
    }
  }

  const paginationProps = {
    pageSize: 8,
    current,
    total,
    onChange: (pageNum: number) => {
      setCurrent(pageNum)
    }
  }

  const renderPerson = (value: IRecipient | null) => {
    if (value) {
      return value.studentNo + '-' + value.username
    } else {
      return '无'
    }
  }
  // 打开设备申请Modal
  const openDeviceModal = (record: IDevice) => {
    setIsDeviceApplyModal(true)
    setApplyDeviceInfo(record)
  }
  // 关闭设备申请Modal
  const closeDeviceApplyModal = () => {
    setIsDeviceApplyModal(false)
    form.resetFields()
    getDeviceLists()
  }

  // 提交申请请求
  const deviceApply = async (values: any) => {
    if (applyDeviceInfo?.id) {
      const date = values.deadline_time.toDate().toISOString().split('T').join(' ')
      const res = await addApplyRecord(applyDeviceInfo.id, values.apply_reason, date)
      if (res?.code === 200) {
        message.success('申请成功')
        closeDeviceApplyModal()
      } else {
        message.info(res?.message)
      }
    }
  }

  const disabledDateChoose: RangePickerProps['disabledDate'] = current => {
    // Can not select days before today
    return current && current <= moment().subtract(1, 'days').endOf('day')
  }

  // 得到申请记录
  const getApplyLists = async () => {
    const res = await getapplyrecord()
    if (res?.code === 200) {
      setApplyHistory(res.data)
    }
  }

  // 查看申请记录
  const openDrawer = async () => {
    setIsOpenDrawer(true)
    getApplyLists()
  }
  // 关闭drawer
  const closeDrawer = () => {
    setIsOpenDrawer(false)
  }

  useEffect(() => {
    getDeviceLists()
  }, [current])

  useEffect(() => {
    getDeviceLists()
  }, [])
  return (
    <div>
      <div>
        <Button onClick={() => openDrawer()}>申请记录</Button>
      </div>
      <div className={style.height2}>
        <Modal
          title="设备申请"
          open={isDeviceApplyModal}
          onCancel={closeDeviceApplyModal}
          footer={null}
        >
          <Form
            onFinish={deviceApply}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
            form={form}
          >
            <Form.Item
              label='编号'
            >
              {applyDeviceInfo?.serialNumber}
            </Form.Item>
            <Form.Item
              label='设备名称'
            >
              {applyDeviceInfo?.name}
            </Form.Item>
            <Form.Item
              name='deadline_time'
              label='归还日期'
              rules={[{ required: true, message: '归还日期不为空' }]}
            >
              <DatePicker disabledDate={disabledDateChoose} />
            </Form.Item>
            <Form.Item
              name='apply_reason'
              label='申请原因'
            >
              <Input.TextArea></Input.TextArea>
            </Form.Item>
            <Form.Item>
              <div className={style.btn_box}>
                <Button type="primary" htmlType="submit">
                  确认申请
                </Button>
                <Button htmlType="button" onClick={() => closeDeviceApplyModal()}>
                  取消
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        <Table
          loading={loading}
          dataSource={source}
          pagination={paginationProps}
        >
          <Column title="编号" dataIndex="serialNumber" key="serialNumber" />
          <Column title="名称" dataIndex="name" key="name" />
          <Column title="型号" dataIndex="version" key="version" />
          <Column title="原值" dataIndex="originalValue" key="originalValue" />
          <Column title="设备性能指标" dataIndex="performanceIndex" key="performanceIndex" />
          <Column title="存放地" dataIndex="address" key="address" />
          <Column title="主机备注" dataIndex="HostRemarks" key="HostRemarks" />
          <Column title="备注" dataIndex="remark" key="remark" />
          <Column title="状态" dataIndex="status" key="status" render={(value: IEquipmentState) => renderState(value)} />
          <Column title="前领用人" dataIndex="formerRecipient" key="formerRecipient"
            render={(value: IRecipient | null) => renderPerson(value)}
          />
          <Column title="领用人" dataIndex="recipient" key="recipient"
            render={(value: IRecipient | null) => renderPerson(value)}
          />
          <Column title='操作'
            render={(_: any, record: IDevice) =>
              <div className={style.a_box}>
                {record.status === 1 ? <Button onClick={() => openDeviceModal(record)} size='small'>申请</Button> : null}
                {
                  record.applyNumber !== 0 ? <a>{record.applyNumber}人申请</a> : null
                }
              </div>
            }
          ></Column>
        </Table>
        <Drawer
          title='申请记录'
          open={isOpenDrawer}
          onClose={closeDrawer}
          width={600}
        >
          {
            applyHistory?.map(item => <ApplyItem getApplyLists={getApplyLists} getDeviceLists={getDeviceLists} key={item.id} info={item}></ApplyItem>)
          }
        </Drawer>
      </div>
    </div>
  )
}
