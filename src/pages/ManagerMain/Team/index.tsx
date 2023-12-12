import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import {
  Button,
  Modal,
  Image,
  Upload,
  message,
  Table,
  Form,
  Input,
  Col
} from 'antd'
import { type RcFile } from 'antd/lib/upload'
import { UploadOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import Column from 'antd/lib/table/Column'
import TeamExcel from '../../../assets/imgs/teamExcel.jpg'
import {
  addOneTeamApi,
  exceladd,
  getinfodetails,
  moreadd
} from '../../../api/Manager'
import {
  type IMemberinfo,
  type IResTeam,
  type ITeamInfo,
  type IUpdateInfo
} from '../../../libs/model'
import { useForm } from 'antd/lib/form/Form'

export default function Team() {
  const [isCreateTeamS, setIsCreateTeamS] = useState(false)
  // 存储excel文件
  const [excelFile, setExcelFile] = useState<RcFile>()
  // response data loading
  const [responseLoading, setResponseLoading] = useState(false)
  // 保存上传小组信息
  const [responseData, setResponseData] = useState<IUpdateInfo>()
  // 创建单个小组
  const [isTeamModal, setIsTeamModal] = useState(false)
  // table loading
  const [loading, setLoading] = useState(false)
  // 保存table信息
  const [tableSource, setTableSource] = useState<IResTeam[]>()

  const [form] = useForm()
  // 关闭批量创建小组modal
  const handlecancelS = () => {
    setIsCreateTeamS(false)
    setResponseData(undefined)
    setExcelFile(undefined)
    setResponseLoading(false)
  }

  // 检查excel
  const beforeUpload = (file: RcFile) => {
    const isTypeTrue =
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (!isTypeTrue) {
      message.error(`${file.name} 文件只能为xls或者xlsx格式`)
    } else {
      setExcelFile(file)
    }
    return isTypeTrue
  }

  // 点击上传
  const uploadfile = async () => {
    if (!excelFile) return false
    setResponseLoading(true)
    const temp = new FormData()
    temp.append('file', excelFile)
    const res = await exceladd(temp)

    if (res?.code === 200) {
      setResponseData(res.data)
      setResponseLoading(false)
    }
  }

  const renderReason = (value: string) => {
    if (!value) {
      return <CheckCircleTwoTone twoToneColor="#52c41a" />
    } else {
      return <span className={style.text}>{value}</span>
    }
  }

  // 添加小组
  const addManyTeams = async () => {
    if (!responseData) return false
    const temp: ITeamInfo[] = responseData.correctTeams.reduce(
      (pre: ITeamInfo[], cur) => {
        pre.push({
          no: cur.no,
          teamName: cur.teamName
        })
        return pre
      },
      []
    )
    const res = await moreadd(temp)
    if (res?.code === 200) {
      message.info('创建成功')
      getTeamInfo()
      handlecancelS()
    }
  }

  // 获取小组信息
  const getTeamInfo = async () => {
    setLoading(true)
    const res = await getinfodetails()
    if (res?.code === 200) {
      setLoading(false)
      setTableSource(res.data)
    }
  }

  // 关闭单个创建小组modal
  const handelTeamS = () => {
    setIsTeamModal(false)
    form.resetFields()
  }

  // 创建单个modal
  const onFinish = async (values: any) => {
    const { no, teamName } = values
    const res = await addOneTeamApi(no, teamName)
    if (res?.code === 200) {
      message.success('小组创建成功')
      handelTeamS()
      getTeamInfo()
    } else {
      message.info(res?.message)
    }
  }

  useEffect(() => {
    getTeamInfo()
  }, [])
  return (
    <div className={style.back}>
      <div className={style.btn_box}>
        <Button className={style.btn} onClick={() => setIsCreateTeamS(true)}>
          批量创建小组
        </Button>
        <Button onClick={() => setIsTeamModal(true)}>创建单个小组</Button>
      </div>
      <div>
        <Table loading={loading} dataSource={tableSource} pagination={false}>
          <Column title="小组编号" dataIndex="no" key="no" />
          <Column title="小组名称" dataIndex="teamname" key="teamname" />
          <Column
            title="组长"
            dataIndex="leader"
            key="leader"
            render={(value: IMemberinfo | null, _) =>
              value ? <a>{value.username}</a> : '暂无'
            }
          ></Column>
          <Column
            title="小组成员"
            dataIndex="members"
            key="members"
            render={(value: IMemberinfo[], _) =>
              value.length
                ? value.map((item) => (
                    <a style={{ marginRight: '5px' }} key={item.id}>
                      {item.username}
                    </a>
                  ))
                : '暂无'
            }
          ></Column>
        </Table>
      </div>
      <Modal
        title="批量创建小组"
        open={isCreateTeamS}
        onCancel={handlecancelS}
        footer={null}
        width={800}
      >
        <Image src={TeamExcel} width={500}></Image>
        <div className={style.textDiv}>
          <div className={style.modalText}>
            提示1：上传excel表格第一行为列名，请严格按照列名填写小组信息
          </div>
          <div className={style.modalText}>提示2：请上传xls或xlsx格式文件</div>
          <div className={style.modalText}>
            提示3：小组编号为6位字母或数字,小组名称不超过10位
          </div>
        </div>
        <Upload
          showUploadList={false}
          beforeUpload={beforeUpload}
          accept=".xls, .xlsx"
          customRequest={() => {}}
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <span className={style.fileName}>{excelFile?.name}</span>
        <div className={style.uploadClick_box}>
          <Button onClick={() => uploadfile()}>点击上传</Button>
        </div>
        <div className={style.height}>
          {responseData && responseData.totalCnt ? (
            <>
              <Table
                loading={responseLoading}
                dataSource={[
                  ...responseData.correctTeams,
                  ...responseData.wrongTeams
                ]}
                pagination={false}
              >
                <Column title="编号" dataIndex="no" key="no" />
                <Column title="小组名称" dataIndex="teamName" key="teamName" />
                <Column
                  title="效果"
                  dataIndex="failReason"
                  key="failReason"
                  render={(value: string) => renderReason(value)}
                ></Column>
              </Table>
              <div>
                <div className={style.fileName}>
                  成功解析<strong>{responseData?.corrcetCnt}</strong>个小组
                </div>
                <div className={style.text}>
                  <strong>{responseData?.wrongCnt}</strong>个小组无法创建
                </div>
              </div>
              {responseData.corrcetCnt ? (
                <div className={style.file_box_btn}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => addManyTeams()}
                  >
                    确认添加上列{responseData.corrcetCnt}个账户
                  </Button>
                </div>
              ) : (
                ''
              )}
            </>
          ) : null}
        </div>
      </Modal>
      <Modal
        title="添加小组"
        open={isTeamModal}
        onCancel={handelTeamS}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="no"
            label="编号"
            rules={[
              { required: true, message: '请输入编号' },
              {
                pattern: /^[a-zA-Z0-9]{6}$/,
                message: '长度为六位，只能为数字和字母'
              }
            ]}
          >
            <Input placeholder="编号长度为六位，只能为数字和字母"></Input>
          </Form.Item>
          <Form.Item
            name="teamName"
            label="小组名称"
            rules={[
              { required: true, message: '请输入小组名称' },
              { max: 10, message: '小组名称长度10位以内' }
            ]}
          >
            <Input placeholder="小组名称长度10位以内"></Input>
          </Form.Item>
          <Form.Item>
            <div className={style.btns_box}>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
              <Button htmlType="button" onClick={handelTeamS}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
