import { Image, Button, DatePicker, Form, Input, Modal, Table, Tag, Upload, message, Drawer, Popconfirm } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import style from './index.module.scss'
import React, { useEffect, useState } from 'react'
import { type IEquipmentState, type IDevice, type IDeviceEquipment, type IResDeviceExcel } from '../../../libs/model'
import { type IRecipient, addDevice, getDeviceInfos, modifyDevice, addequipmentexcel, confirmAddExcel, managerUseDevice, getequipmentrecord, type IResGetDeviceRecord, recoverapplyrecord } from '../../../api/Manager'
import Column from 'antd/lib/table/Column'
import dayjs from 'dayjs'
import moment, { Moment } from 'moment'
import { type RcFile } from 'antd/lib/upload'
import { UploadOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import excelImg from '../../../assets/imgs/deviceExcel.jpg'
import { type RangePickerProps } from 'antd/lib/date-picker'
import MDeviceApply from '../../ManagerMain/MDevice/MDeviceApply'
import { type IResGetApplyRecord, addApplyRecord, getapplyrecord } from '../../../api/Member'
import ApplyItem from '../../MemberMain/MemberDevice/ApplyItem'

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

export default function LDevice() {
  // 添加设备form
  const [form] = useForm()
  const [modifyForm] = useForm()
  const [formApply] = useForm()
  // 添加设备Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // 修改设备Modal
  const [isModify, setIsModify] = useState(false)
  // 控制批量添加设别Modal
  const [isAddDeviceModal, setIsAddDeviceModal] = useState(false)
  // 控制table loading
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>(0)
  // 存储table source
  const [source, setSource] = useState<ISource[]>()
  // 保存修改设备id
  const [modifyId, setModifyId] = useState<string>('')
  // 存储excel文件
  const [excelFile, setExcelFile] = useState<RcFile>()
  // response data loading
  const [responseLoading, setResponseLoading] = useState(false)
  // 保存返回上传excel数据
  const [responseData, setResponseData] = useState<IResDeviceExcel>()
  // 控制drawer
  const [isDrawer, setIsDrawer] = useState(false)
  // 保存申请信息
  const [applyInfos, setApplyInfos] = useState<IResGetDeviceRecord[]>()
  // 保存drawerid
  const [drawerId, setDrawerId] = useState<string>('')
  // 控制设备申请modal
  const [isDeviceApplyModal, setIsDeviceApplyModal] = useState(false)
  // 保存某个设备信息
  const [applyDeviceInfo, setApplyDeviceInfo] = useState<IDevice>()
  // 控制drawer
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  // 保存申请历史
  const [applyHistory, setApplyHistory] = useState<IResGetApplyRecord[]>()
  // 关闭添加设备modal
  const closeModal = () => {
    form.resetFields()
    setIsAddModalOpen(false)
  }
  // 关闭修改Modal
  const closeModify = () => {
    modifyForm.resetFields()
    setIsModify(false)
  }

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

  // 添加单个设备
  // 添加设备
  const addEquipment = async (Value: IDevice) => {
    const res = await addDevice(
      Value.serialNumber,
      Value.name,
      Value.version,
      Value.originalValue,
      Value.performanceIndex,
      Value.address,
      Value.warehouseEntryTime,
      Value.remark,
      Value.HostRemarks
    )
    if (res?.code === 200) {
      message.success('添加成功')
      getDeviceLists()
      closeModal()
    } else {
      message.info(res?.message)
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
      return value.studentNo + value.username
    } else {
      return '无'
    }
  }
  // 点击修改按钮
  const modifyClick = async (record: IDevice) => {
    const newRecord = { ...record, warehouseEntryTime: moment(record.warehouseEntryTime) }
    setModifyId(record.id)
    modifyForm.setFieldsValue(newRecord)
    setIsModify(true)
  }

  // 提交修改
  const modifySubmit = async (values: IDevice) => {
    const res = await modifyDevice(
      modifyId,
      values.serialNumber,
      values.name,
      values.version,
      values.originalValue,
      values.performanceIndex,
      values.address,
      values.warehouseEntryTime,
      values.HostRemarks,
      values.remark
    )
    if (res?.code === 200) {
      message.success("修改成功")
      closeModify()
      getDeviceLists()
    } else {
      message.info(res?.message)
    }
  }

  // 检查excel
  const beforeUpload = (file: RcFile) => {
    const isTypeTrue = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (!isTypeTrue) {
      message.error(`${file.name} 文件只能为xls或者xlsx格式`)
    } else {
      setExcelFile(file)
    }
    return isTypeTrue
  }

  // 点击上传excel按钮
  const uploadfile = async () => {
    if (excelFile) {
      const temp = new FormData()
      temp.append('file', excelFile)
      const res = await addequipmentexcel(temp)
      if (res?.code === 200) {
        setResponseData(res.data)
      } else {
        message.info(res?.message)
      }
    } else {
      message.info('还未选择文件!')
    }
  }

  // 确认添加
  const confirmAdd = async () => {
    if (responseData?.correctEquipment) {
      const res = await confirmAddExcel(responseData?.correctEquipment)
      if (res?.code === 200) {
        message.success('上传成功')
        returnToTable()
        getDeviceLists()
      } else {
        message.info(res?.message)
      }
    } else {
      message.info('没有可上传的设备信息')
    }
  }

  const renderReason = (value: string) => {
    if (!value) {
      return <CheckCircleTwoTone twoToneColor="#52c41a" />
    } else {
      return <span className={style.text}>{value}</span>
    }
  }

  const returnToTable = () => {
    setIsAddDeviceModal(false)
    setExcelFile(undefined)
    setResponseData(undefined)
  }

  // 获得某一设备申请详情
  const getApplyInfos = async (id: string) => {
    const res = await getequipmentrecord(id)
    if (res?.code === 200) {
      setApplyInfos(res.data)
    }
  }

  // 打开drawer
  const openDrawer = (id: string) => {
    setIsDrawer(true)
    getApplyInfos(id)
    setDrawerId(id)
  }

  // 关闭drawer
  const closeDrawer = () => {
    setIsDrawer(false)
  }

  // 关闭and更新
  const closeAndRefresh = () => {
    setIsDrawer(false)
    getDeviceLists()
  }

  const disabledDateChoose: RangePickerProps['disabledDate'] = current => {
    // Can not select days before today
    return current && current <= moment().subtract(1, 'days').endOf('day')
  }

  // 打开设备申请Modal
  const openDeviceModal = (record: IDevice) => {
    setIsDeviceApplyModal(true)
    setApplyDeviceInfo(record)
  }
  // 关闭设备申请Modal
  const closeDeviceApplyModal = () => {
    setIsDeviceApplyModal(false)
    formApply.resetFields()
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

  // 查看申请记录
  const openDrawer2 = async () => {
    setIsOpenDrawer(true)
    getApplyLists()
  }
  // 关闭drawer
  const closeDrawer2 = () => {
    setIsOpenDrawer(false)
  }

  // 得到申请记录
  const getApplyLists = async () => {
    const res = await getapplyrecord()
    if (res?.code === 200) {
      setApplyHistory(res.data)
    }
  }

  useEffect(() => {
    getDeviceLists()
  }, [current])

  useEffect(() => {
    getDeviceLists()
  }, [])
  return (
    <div>
      <div className={style.header_box}>
        <Button onClick={() => setIsAddModalOpen(true)}>添加设备</Button>
        <Button onClick={() => setIsAddDeviceModal(true)}>批量添加设备</Button>
        <Button onClick={() => openDrawer2()}>申请记录</Button>
      </div>
      <Modal title="添加设备"
        forceRender
        style={{ width: '600px' }}
        open={isAddModalOpen}
        footer={null}
        onCancel={() => closeModal()}>
        <Form
          onFinish={addEquipment}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          form={form}
        >
          <Form.Item
            name='serialNumber'
            label='编号'
            rules={[
              { required: true, message: '设备编号不为空' },
              { max: 50, message: '编号长度不超过50' }
            ]}
          >
            <Input placeholder='设备编号'></Input>
          </Form.Item>
          <Form.Item
            name='name'
            label='名称'
            rules={[
              { required: true, message: '设备名称不为空' },
              { max: 50, message: '设备名称长度不超过50' }
            ]}
          >
            <Input placeholder='设备名称'></Input>
          </Form.Item>
          <Form.Item
            name='version'
            label='型号'
            rules={[
              { required: true, message: '设备型号不为空' },
              { max: 50, message: '型号长度不超过50' }
            ]}
          >
            <Input placeholder='设备型号'></Input>
          </Form.Item>
          <Form.Item
            name='originalValue'
            label='原值'
          >
            <Input placeholder='设备原值'></Input>
          </Form.Item>
          <Form.Item
            name='performanceIndex'
            label='设备性能指标'
            rules={[
              { max: 255, message: '设备性能指标描述不超过255' }
            ]}
          >
            <Input.TextArea placeholder='设备性能指标'></Input.TextArea>
          </Form.Item>
          <Form.Item
            name='address'
            label='存放地'
            rules={[
              { max: 50, message: '地址长度不超过50' }
            ]}
          >
            <Input placeholder='设备存放地'></Input>
          </Form.Item>
          <Form.Item
            name='warehouseEntryTime'
            label='入库时间'
            rules={[{ required: true, message: '设备入库时间不为空' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name='HostRemarks'
            label='主机备注'
            rules={[{ max: 255, message: '主机备注长度不超过255' }]}
          >
            <Input.TextArea placeholder='如设备为主机，那么备注显示器，包含几个显示器，设备编号、显示器接口、显示器尺寸'></Input.TextArea>
          </Form.Item>
          <Form.Item
            name='remark'
            label='备注'
            rules={[{ max: 255, message: '备注长度不超过255' }]}
          >
            <Input.TextArea placeholder='设备备注'></Input.TextArea>
          </Form.Item>
          <Form.Item>
            <div className={style.btn_box}>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
              <Button htmlType="button" onClick={() => closeModal()}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="修改设备"
        forceRender
        style={{ width: '650px' }}
        open={isModify}
        footer={null}
        onCancel={() => closeModify()}>
        <Form
          onFinish={modifySubmit}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          form={modifyForm}>
          <Form.Item
            name='serialNumber'
            label='编号'
            rules={[
              { required: true, message: '设备编号不为空' },
              { max: 50, message: '编号长度不超过50' }
            ]}
          >
            <Input placeholder='设备编号'></Input>
          </Form.Item>
          <Form.Item
            name='name'
            label='名称'
            rules={[
              { required: true, message: '设备名称不为空' },
              { max: 50, message: '设备名称长度不超过50' }
            ]}
          >
            <Input placeholder='设备名称'></Input>
          </Form.Item>
          <Form.Item
            name='version'
            label='型号'
            rules={[
              { required: true, message: '设备型号不为空' },
              { max: 50, message: '型号长度不超过50' }
            ]}
          >
            <Input placeholder='设备型号'></Input>
          </Form.Item>
          <Form.Item
            name='originalValue'
            label='原值'
            rules={[
              { max: 50, message: '原值长度不超过50' }
            ]}
          >
            <Input placeholder='设备原值'></Input>
          </Form.Item>
          <Form.Item
            name='performanceIndex'
            label='设备性能指标'
            rules={[
              { max: 255, message: '设备性能指标描述不超过255' }
            ]}
          >
            <Input.TextArea placeholder='设备性能指标'></Input.TextArea>
          </Form.Item>
          <Form.Item
            name='address'
            label='存放地'
            rules={[
              { max: 50, message: '地址长度不超过50' }
            ]}
          >
            <Input placeholder='设备存放地'></Input>
          </Form.Item>
          <Form.Item
            name='warehouseEntryTime'
            label='入库时间'
            rules={[{ required: true, message: '设备入库时间不为空' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name='HostRemarks'
            label='主机备注'
            rules={[{ max: 255, message: '主机备注长度不超过255' }]}
          >
            <Input.TextArea placeholder='如设备为主机，那么备注显示器，包含几个显示器，设备编号、显示器接口、显示器尺寸'></Input.TextArea>
          </Form.Item>
          <Form.Item
            name='remark'
            label='备注'
            rules={[{ max: 255, message: '备注长度不超过255' }]}
          >
            <Input.TextArea placeholder='设备备注'></Input.TextArea>
          </Form.Item>
          <Form.Item>
            <div className={style.btn_box}>
              <Button type="primary" htmlType="submit">
                确认修改
              </Button>
              <Button htmlType="button" onClick={() => closeModify()}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="批量添加设备"
        open={isAddDeviceModal}
        onCancel={returnToTable}
        footer={null}
        width={1300}
      >
        <Image src={excelImg} width={900}></Image>
        <div className={style.modalText}>提示1：上传excel表格第一行为列名，请严格按照列名填写设备信息</div>
        <div className={style.modalText}>提示2：请上传xls格式文件</div>
        <Upload
          showUploadList={false}
          beforeUpload={beforeUpload}
          accept='.xls, .xlsx'
          customRequest={() => { }}
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <span className={style.fileName}>{excelFile?.name}</span>
        <div className={style.uploadClick_box}>
          <Button onClick={() => uploadfile()}>点击上传</Button>
        </div>
        <div className={style.height}>
          {
            responseData
              ? <>
                <Table
                  loading={responseLoading}
                  dataSource={[...responseData.correctEquipment, ...responseData.wrongEquipment]}
                  pagination={false}
                >
                  <Column title="编号" dataIndex="serialNumber" key="serialNumber" />
                  <Column title="名称" dataIndex="name" key="name" />
                  <Column title="型号" dataIndex="version" key="version" />
                  <Column title="原值" dataIndex="originalValue" key="originalValue" />
                  <Column title="设备性能指标" dataIndex="performanceIndex" key="performanceIndex" />
                  <Column title="存放地" dataIndex="address" key="address" />
                  <Column title="入库时间" dataIndex="warehouseEntryTime" key="warehouseEntryTime" />
                  <Column title="主机备注" dataIndex="HostRemarks" key="HostRemarks" />
                  <Column title="备注" dataIndex="remark" key="remark" />
                  <Column title="效果" dataIndex="failReason" key="failReason"
                    render={(value: string) => renderReason(value)}
                  ></Column>
                </Table>
                <div>
                  <div className={style.fileName}>成功解析<strong>{responseData?.corrcetCnt}</strong>个设备信息</div>
                  <div className={style.text}><strong>{responseData?.wrongCnt}</strong>个设备信息无法创建</div>
                </div>
                <Button onClick={() => confirmAdd()} style={{ marginRight: '20px' }}>确认添加</Button>
                <Button onClick={() => returnToTable()}>返回</Button>
              </>
              : null
          }
        </div>
      </Modal>
      <div className={style.height2}>
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
          <Column title="入库时间" dataIndex="warehouseEntryTime" key="warehouseEntryTime" />
          <Column title="主机备注" dataIndex="HostRemarks" key="HostRemarks" />
          <Column title="备注" dataIndex="remark" key="remark" />
          <Column title="状态" dataIndex="status" key="status" render={(value: IEquipmentState) => renderState(value)} />
          <Column title="前领用人" dataIndex="formerRecipient" key="formerRecipient"
            render={(value: IRecipient | null) => renderPerson(value)}
          />
          <Column title="领用人" dataIndex="recipient" key="recipient"
            render={(value: IRecipient | null, record: ISource) => renderPerson(value)
            }
          />
          <Column title='操作'
            render={(_: any, record: IDevice) =>
              <div className={style.a_box}>
                <Button size='small' onClick={() => modifyClick(record)}>修改</Button>
                {record.status === 1 ? <Button onClick={() => openDeviceModal(record)} size='small'>申请</Button> : null}
                {
                  record.applyNumber !== 0 ? <Button size='small' onClick={() => openDrawer(record.id)}>{record.applyNumber}人申请</Button> : null
                }
              </div>
            }
          ></Column>
        </Table>
      </div>
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
          form={formApply}
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
      <Drawer
        title="申请详情"
        open={isDrawer}
        placement="right"
        onClose={() => closeDrawer()}
        width={580}
      >
        <div className={style.labelDiv}>
          {applyInfos?.length ? <>设备编号: {applyInfos[0].equipmentInfo.serialNumber}</> : null}
        </div>
        <div className={style.labelDiv}>
          {applyInfos?.length ? <>设备名称: {applyInfos[0].equipmentInfo.name}</> : null}
        </div>
        {
          applyInfos?.map(item => <MDeviceApply closeAndRefresh={closeAndRefresh} key={item.id} info={item} getApplyInfos={getApplyInfos} drawerId={drawerId}></MDeviceApply>)
        }
      </Drawer>
      <Drawer
          title='申请记录'
          open={isOpenDrawer}
          onClose={closeDrawer2}
          width={600}
        >
          {
            applyHistory?.map(item => <ApplyItem getApplyLists={getApplyLists} getDeviceLists={getDeviceLists} key={item.id} info={item}></ApplyItem>)
          }
        </Drawer>
      </div>
  )
}
