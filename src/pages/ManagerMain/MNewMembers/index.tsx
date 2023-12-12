import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  type RadioChangeEvent,
  Select,
  Upload,
  message,
  Image,
  Table,
  Tag,
  type CheckboxOptionType
} from 'antd'
import { type RcFile } from 'antd/lib/upload'
import { UploadOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'
import {
  type IExcel,
  editMembersInfos,
  excelregister,
  getinfodetails,
  getlist,
  infoExcel,
  registermore,
  simpleMemberRegister
} from '../../../api/Manager'
import {
  type UpdateUser,
  type IMemberExcelReturn,
  type IOption,
  type IMemberinfo,
  type ITeam,
  type ILeaderInfo
} from '../../../libs/model'
import MemberExcel from '../../../assets/imgs/memberExcel.jpg'
import Column from 'antd/lib/table/Column'
import dayjs from 'dayjs'

export default function MNewMembers() {
  // 存储excel文件
  const [excelFile, setExcelFile] = useState<RcFile>()
  // 控制批量创建成员窗口
  const [createMenbersModal, setCreateMenbersModal] = useState(false)
  // 控制创建单个成员窗口
  const [isMember, setIsMember] = useState(false)
  // 填充创建单个成员窗口 - 小组select
  const [selectTeam, setSelectTeam] = useState<IOption[]>()
  // 控制角色是否可填
  const [isDisableRole, setDisableRole] = useState(true)
  // response data loading
  const [responseLoading, setResponseLoading] = useState(false)
  // 保存上传成员信息
  const [responseData, setResponseData] = useState<IMemberExcelReturn>()
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  // 保存成员信息
  const [memberList, setMemberList] = useState<IMemberinfo[]>()
  // 控制修改，modal
  const [editModal, setEditModal] = useState(false)
  // 修改modal 角色是否可填
  const [editDisabled, setEditDisabled] = useState(true)
  // 保存修改成员id
  const [editId, setEditId] = useState<string>()
  const [optionsWithDisabled, setOptionWithDisabled] = useState([
    { label: '组长', value: 1, disabled: false },
    { label: '组员', value: 2, disabled: false }
  ])

  const resetRadioOption = () => {
    setOptionWithDisabled([
      { label: '组长', value: 1, disabled: false },
      { label: '组员', value: 2, disabled: false }
    ])
  }

  const [form] = useForm()
  const [editForm] = useForm()

  // 关闭批量创建成员modal
  const handleCancelMs = () => {
    setCreateMenbersModal(false)
    setResponseData(undefined)
    setExcelFile(undefined)
    setResponseLoading(false)
  }

  // 关闭单个创建成员modal
  const handelCancelM = () => {
    setIsMember(false)
    setDisableRole(true)
    form.resetFields()
    resetRadioOption()
  }

  // 关闭修改modal
  const cancelEditModal = () => {
    setEditModal(false)
    setEditDisabled(true)
    editForm.resetFields()
    resetRadioOption()
  }

  // 得到小组信息
  const getTeamInfo = async () => {
    const res = await getinfodetails()
    if (res?.code === 200) {
      setSelectTeam(
        res.data.reduce((pre: IOption[], cur) => {
          pre.push({
            value:
              cur.no +
              ' ' +
              cur.teamname +
              (cur.leader ? ' ' + cur.leader?.studentNo : ''),
            label:
              cur.teamname +
              '-' +
              cur.no +
              ' ' +
              (cur.leader ? cur.leader.username : '暂无组长')
          })
          return pre
        }, [])
      )
    }
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
    const res = await excelregister(temp)

    if (res?.code === 200) {
      setResponseData(res.data)
      setResponseLoading(false)
    }
  }

  // 创建单个modal
  const onFinish = async (values: any) => {
    const { username, studentNo, tel, email, cardNo, team, role } = values
    let roleText
    if (role) {
      if (role === 1) {
        roleText = '组长'
      } else if (role === 2) {
        roleText = '组员'
      }
    }
    let teamNo, teamName
    if (team) {
      const temp = team.split(' ')
      teamNo = temp[0]
      teamName = temp[1]
    }
    const res = await simpleMemberRegister(
      username,
      studentNo,
      tel,
      email,
      cardNo,
      teamNo,
      teamName,
      roleText
    )
    if (res?.code === 200) {
      message.success('成员账号创建成功')
      handelCancelM()
      getMembers()
    } else {
      message.info(res?.message)
    }
  }

  // 改变所属小组
  const changeSelect = (value: any) => {
    // 如果为空 角色也要为空
    if (!value) {
      form.setFieldValue('role', undefined)
      setDisableRole(true)
    } else {
      console.log(value.split(' '))
      if (value.split(' ').length === 3) {
        setOptionWithDisabled(
          optionsWithDisabled.map((item) => {
            if (item.value === 1) {
              item.disabled = true
            }
            return item
          })
        )
      } else {
        resetRadioOption()
      }
      form.setFieldValue('role', 2)
      setDisableRole(false)
    }
    // 如果不为空 角色默认变更为组员
  }

  // 改变所属小组 (修改)
  const changeSelect2 = (value: any) => {
    // 如果为空 角色也要为空
    if (!value) {
      editForm.setFieldValue('role', undefined)
      setEditDisabled(true)
    } else {
      const temp = value.split(' ')
      const no = editForm.getFieldValue('studentNo')
      if (temp.length === 3) {
        setOptionWithDisabled(
          optionsWithDisabled.map((item) => {
            if (item.value === 1 && temp[2] !== no) {
              item.disabled = true
            } else {
              item.disabled = false
            }
            return item
          })
        )
      } else {
        resetRadioOption()
      }
      editForm.setFieldValue('role', 2)
      setEditDisabled(false)
    }
    // 如果不为空 角色默认变更为组员
  }

  const renderReason = (value: string) => {
    if (!value) {
      return <CheckCircleTwoTone twoToneColor="#52c41a" />
    } else {
      return <span className={style.text}>{value}</span>
    }
  }

  // 添加成员
  const addManyTeams = async () => {
    if (!responseData) return false
    const temp: UpdateUser[] = responseData.correctUsers.reduce(
      (pre: UpdateUser[], cur) => {
        pre.push({
          username: cur.username,
          studentNo: cur.studentNo,
          tel: cur.tel,
          email: cur.email,
          cardNo: cur.cardNo,
          teamNo: cur.teamNo,
          teamName: cur.teamName,
          role: cur.role
        })
        return pre
      },
      []
    )
    const res = await registermore(temp)
    if (res?.code === 200) {
      message.info('创建成功')
      getMembers()
      handleCancelMs()
    }
  }

  // 得到成员信息
  const getMembers = async () => {
    setLoading(true)
    const res = await getlist(current, 10)
    if (res?.code === 200) {
      setMemberList(res.data.userlist)
      setTotal(res.data.total)
      setLoading(false)
    }
  }

  // 导出excel基本信息
  const portBasicInfo = async () => {
    const res = await infoExcel()
    console.log(res?.code)
    if (res?.code === 200) {
      const temp = atob(res.data.body)
      const binaryStream = new Uint8Array(temp.length)
      for (let i = 0; i < temp.length; i++) {
        binaryStream[i] = temp.charCodeAt(i)
      }
      const blob = new Blob([binaryStream], {
        type: 'application/vnd.ms-excel'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = '成员信息.xls'
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
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

  const renderRole = (role: number) => {
    switch (role) {
      case 1:
        return <Tag color="grey">管理员</Tag>
      case 2:
        return <Tag color="blue">组长</Tag>
      case 3:
        return <Tag color="green">组员</Tag>
      case 4:
        return <Tag color="orange">未入组成员</Tag>
    }
  }

  const insertRole = (role: number) => {
    switch (role) {
      case 3:
        return 2
      case 2:
        return 1
      default:
        return undefined
    }
  }

  // 修改
  const editApi = async (values: any) => {
    let { username, studentNo, tel, email, cardNo, team, role } = values
    if (!email) email = null
    if (!tel) tel = null
    if (!cardNo) cardNo = null
    let roleText = null
    if (role) {
      if (role === 1) {
        roleText = '组长'
      } else if (role === 2) {
        roleText = '组员'
      } else {
        roleText = null
      }
    }
    let teamNo, teamName
    if (team) {
      const temp = team.split(' ')
      teamNo = temp[0]
      teamName = temp[1]
    }
    if (!editId) return
    const res = await editMembersInfos(
      editId,
      username,
      studentNo,
      tel,
      email,
      cardNo,
      teamNo,
      teamName,
      roleText
    )
    if (res?.code === 200) {
      message.success('修改成功')
      cancelEditModal()
      getMembers()
    } else {
      message.info(res?.message)
    }
  }

  // 点击修改
  const clickEdit = (record: IMemberinfo) => {
    setEditId(record.id)
    getTeamInfo()
    setEditModal(true)
    setEditDisabled(!record.teamInfo)
    const source = {
      id: record.id,
      username: record.username,
      studentNo: record.studentNo,
      tel: record.phone,
      email: record.email,
      cardNo: record.cardNo,
      team: record.teamInfo
        ? record.teamInfo.no +
          ' ' +
          record.teamInfo.teamname +
          (record.leaderInfo ? ' ' + record.leaderInfo.studentNo : '')
        : '',
      role: insertRole(record.role)
    }
    const temp = source.team.split(' ')
    const no = source.studentNo
    if (temp.length === 3) {
      setOptionWithDisabled(
        optionsWithDisabled.map((item) => {
          // 如果自己不是组长 组长设为禁止 如果自己是组长 则任意设置
          if (item.value === 1 && temp[2] !== no) {
            item.disabled = true
          } else {
            item.disabled = false
          }
          return item
        })
      )
    } else {
      resetRadioOption()
    }
    editForm.setFieldsValue(source)
  }

  useEffect(() => {
    getMembers()
  }, [current])

  return (
    <div className={style.back}>
      <div className={style.btn_box}>
        <Button
          className={style.btn}
          onClick={() => setCreateMenbersModal(true)}
        >
          批量创建成员
        </Button>
        <Button
          style={{ marginRight: 'auto' }}
          onClick={() => {
            setIsMember(true)
            getTeamInfo()
          }}
        >
          创建单个成员
        </Button>
        <div className={style.right_btn}>
          <Button onClick={() => portBasicInfo()}>导出成员基本信息</Button>
        </div>
      </div>
      <div>
        <Table
          loading={loading}
          dataSource={memberList}
          pagination={paginationProps}
        >
          <Column title="学工号" dataIndex="studentNo" key="studentNo" />
          <Column title="姓名" dataIndex="username" key="username" />
          <Column title="手机号" dataIndex="phone" key="phone" />
          <Column title="邮箱" dataIndex="email" key="email" />
          <Column title="身份证" dataIndex="cardNo" key="cardNo" />
          <Column
            title="所属小组"
            dataIndex="teamInfo"
            key="teamInfo"
            render={(value: ITeam | undefined, _) =>
              value ? value.no + '-' + value.teamname : ''
            }
          />
          <Column
            title="组长"
            dataIndex="leaderInfo"
            key="leaderInfo"
            render={(value: ILeaderInfo, _) => (value ? value.username : '')}
          />
          <Column
            title="角色"
            dataIndex="role"
            key="role"
            render={(value, _) => renderRole(value)}
          />
          <Column
            title="操作"
            render={(_, record: IMemberinfo) => (
              <a onClick={() => clickEdit(record)}>修改</a>
            )}
          ></Column>
        </Table>
      </div>
      <Modal
        title="批量创建成员"
        open={createMenbersModal}
        onCancel={handleCancelMs}
        footer={null}
        width={1300}
      >
        <Image src={MemberExcel} width={500}></Image>
        <div className={style.textDiv}>
          <div className={style.modalText}>
            提示1：上传excel表格第一行为列名，请严格按照列名填写成员信息
          </div>
          <div className={style.modalText}>提示2：请上传xls或xlsx格式文件</div>
          <div className={style.modalText}>
            提示3：请保证小组编号与小组名称对应
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
                  ...responseData.correctUsers,
                  ...responseData.wrongUsers
                ]}
                pagination={false}
              >
                <Column title="姓名" dataIndex="username" key="username" />
                <Column title="学工号" dataIndex="studentNo" key="studentNo" />
                <Column title="电话" dataIndex="tel" key="tel" />
                <Column title="邮箱" dataIndex="email" key="email" />
                <Column title="身份证号" dataIndex="cardNo" key="cardNo" />
                <Column title="小组编号" dataIndex="teamNo" key="teamNo" />
                <Column title="小组名称" dataIndex="teamName" key="teamName" />
                <Column title="角色" dataIndex="role" key="role" />
                <Column
                  title="效果"
                  dataIndex="failReason"
                  key="failReason"
                  render={(value: string) => renderReason(value)}
                ></Column>
              </Table>
              <div>
                <div className={style.fileName}>
                  成功解析<strong>{responseData?.corrcetCnt}</strong>个成员账户
                </div>
                <div className={style.text}>
                  <strong>{responseData?.wrongCnt}</strong>个账户无法创建
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
        title="添加成员"
        open={isMember}
        onCancel={handelCancelM}
        footer={null}
      >
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              {
                pattern: /^([\u4e00-\u9fa5]{2,20}|[a-zA-Z.\s]{2,20})$/,
                message: '姓名不合法'
              }
            ]}
          >
            <Input placeholder="请输入姓名"></Input>
          </Form.Item>
          <Form.Item
            name="studentNo"
            label="学工号"
            rules={[
              { required: true, message: '学工号不为空' },
              { len: 8, message: '学工号为八位' }
            ]}
          >
            <Input placeholder="请输入学工号"></Input>
          </Form.Item>
          <Form.Item
            name="tel"
            label="手机号"
            rules={[
              {
                pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                message: '手机号不合法'
              }
            ]}
          >
            <Input placeholder="手机号可空"></Input>
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                pattern:
                  /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/,
                message: '邮箱不合法'
              }
            ]}
          >
            <Input placeholder="邮箱可空"></Input>
          </Form.Item>
          <Form.Item
            name="cardNo"
            label="身份证"
            rules={[
              {
                pattern:
                  /^(1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|8[1-2])\d{4}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}([0-9]|X)$/,
                message: '身份证不合法'
              }
            ]}
          >
            <Input placeholder="身份证可空"></Input>
          </Form.Item>
          <Form.Item name="team" label="所属小组">
            <Select
              placeholder="选择所属小组，可空"
              style={{ width: '100%' }}
              allowClear
              onChange={changeSelect}
              options={selectTeam}
            ></Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[
              {
                required: form.getFieldValue('team'),
                message: '请选择所属小组'
              }
            ]}
          >
            <Radio.Group
              options={optionsWithDisabled}
              disabled={isDisableRole}
            ></Radio.Group>
          </Form.Item>
          <Form.Item>
            <div className={style.btns_box}>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
              <Button htmlType="button" onClick={handelCancelM}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="修改成员信息"
        open={editModal}
        onCancel={cancelEditModal}
        footer={null}
      >
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          form={editForm}
          onFinish={editApi}
        >
          <Form.Item
            name="username"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              {
                pattern: /^([\u4e00-\u9fa5]{2,20}|[a-zA-Z.\s]{2,20})$/,
                message: '姓名不合法'
              }
            ]}
          >
            <Input placeholder="请输入姓名"></Input>
          </Form.Item>
          <Form.Item
            name="studentNo"
            label="学工号"
            rules={[
              { required: true, message: '学工号不为空' },
              { len: 8, message: '学工号为八位' }
            ]}
          >
            <Input placeholder="请输入学工号"></Input>
          </Form.Item>
          <Form.Item
            name="tel"
            label="手机号"
            rules={[
              {
                pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                message: '手机号不合法'
              }
            ]}
          >
            <Input placeholder="手机号可空"></Input>
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                pattern:
                  /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/,
                message: '邮箱不合法'
              }
            ]}
          >
            <Input placeholder="邮箱可空"></Input>
          </Form.Item>
          <Form.Item
            name="cardNo"
            label="身份证"
            rules={[
              {
                pattern:
                  /^(1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|8[1-2])\d{4}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}([0-9]|X)$/,
                message: '身份证不合法'
              }
            ]}
          >
            <Input placeholder="身份证可空"></Input>
          </Form.Item>
          <Form.Item name="team" label="所属小组">
            <Select
              placeholder="选择所属小组，可空"
              style={{ width: '100%' }}
              allowClear
              onChange={changeSelect2}
              options={selectTeam}
            ></Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[
              {
                required: form.getFieldValue('team'),
                message: '请选择所属小组'
              }
            ]}
          >
            <Radio.Group
              options={optionsWithDisabled}
              disabled={editDisabled}
            ></Radio.Group>
          </Form.Item>
          <Form.Item>
            <div className={style.btns_box}>
              <Button type="primary" htmlType="submit">
                确认修改
              </Button>
              <Button htmlType="button" onClick={cancelEditModal}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
