import React, { useEffect, useState } from 'react'
import { Button, Drawer, Form, Input, Modal, Popconfirm, Select, Table, Tag, message, Image, Upload } from 'antd'
import style from './index.module.scss'
import { useForm } from 'antd/lib/form/Form'
import Column from 'antd/lib/table/Column'
import excelImg from '../../../assets/imgs/excelModal.png'
import { UploadOutlined } from '@ant-design/icons'
import { type IResGetPersonByStudentNo, createUser, delmember, getMember, getNoGroupMember, getPersonByStudentNo, getteaminfos, newGroup, updateleader, delteam, addMembers, uploadExcel } from '../../../api/Manager'
import { type IRole, type IMembersTable, type IRange, type ITeamInfoLists, type IResUploadExcel, type IFileTableSource } from '../../../libs/model'
import dayjs from 'dayjs'
import { type RcFile } from 'antd/lib/upload'

interface IOption {
  label: string
  value: string
}
export default function TeamManage() {
  // drawer's open
  const [open, setOpen] = useState(false)
  // 存储抽屉人信息
  const [personInfo, setPersonInfo] = useState<IResGetPersonByStudentNo>()
  // 组信息
  const [groupLists, setGroupLists] = useState<ITeamInfoLists>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [members, setMembers] = useState<IMembersTable[]>([])
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [range, setRange] = useState('all')
  const [total, setTotal] = useState<number>(0)
  // 存储流浪组员
  const [noGroupMembersOption, setNoGroupMembersOption] = useState<IOption[]>()
  // 添加组员列表是否打开
  const [isOptionOpen, setIsOptionOpen] = useState(false)
  // 保存添加的组员
  const [memberStudentNos, setMemberStudentNos] = useState<string[]>()
  // 记录【组内切换组员】按钮是否点击
  const [isClickChangeBtn, setIsClickChangeBtn] = useState(false)
  // 记录切换的组员
  const [changeMember, setChangeMember] = useState<string>()
  // 组员option
  const [membersOption, setMembersOption] = useState<IOption[]>([])
  // 批量生成组员modal
  const [isUploadMembersModal, setIsUploadMembersModal] = useState(false)
  // 存储excel文件
  const [excelFile, setExcelFile] = useState<RcFile>()
  // 保存返回上传excel数据
  const [responseData, setResponseData] = useState<IFileTableSource[]>()
  // 保存excel res所有信息
  const [allResponseData, setAllResponseData] = useState<IResUploadExcel>()
  // response data loading
  const [responseLoading, setResponseLoading] = useState(false)
  const [form] = useForm()
  const handleCancel = () => {
    setIsOptionOpen(false)
    setIsModalOpen(false)
    form.resetFields()
  }

  const onFinish = async (values: any) => {
    const { username, name } = values
    const res = await createUser(username, name)
    if (res?.code === 200) {
      message.success('成员创建成功')
      getList(range as IRange)
      handleCancel()
    } else {
      message.info(res?.message)
    }
  }

  const renderRole = (role: IRole) => {
    switch (role) {
      case 2:
        return <Tag color='blue'>组长</Tag>
      case 3:
        return <Tag color='green'>普通组员</Tag>
    }
  }

  const getList = async (range: IRange) => {
    setLoading(true)
    const res = await getMember(range, current, 8)
    if (res?.code === 200) {
      const temp: IMembersTable[] = res.data.records.reduce((pre: IMembersTable[], cur) => {
        pre.push({
          key: cur.id,
          createTime: dayjs(cur.createTime).format('YYYY-MM-DD'),
          email: cur.email,
          phone: cur.phone,
          photo: cur.photo,
          role: cur.role,
          studentNo: cur.studentNo,
          username: cur.username
        })
        return pre
      }, [])
      setMembers(temp)
      setTotal(res.data.total)
      setLoading(false)
    }
  }

  const handleChange = (value: IRange) => {
    setRange(value)
    setCurrent(1)
  }

  const paginationProps = {
    pageSize: 8,
    current,
    total,
    onChange: (pageNum: number) => {
      setCurrent(pageNum)
    }
  }

  // 根据抽屉人信息 得到组长组员信息
  const getLeaderMembers = async (studentNo: string) => {
    const res = await getteaminfos(studentNo)
    setGroupLists(res?.data)
    if (res?.data.member_infos) {
      setMembersOption(res?.data.member_infos.reduce((pre: IOption[], cur) => {
        pre.push({
          value: cur.student_no,
          label: cur.username
        })
        return pre
      }, []))
    }
  }
  // 打开抽屉 查看抽屉人信息 查看组所有信息
  const viewGroupInfo = async (memberInfo: IMembersTable) => {
    getPersonInfo(memberInfo.studentNo)
    getLeaderMembers(memberInfo.studentNo)
    setOpen(true)
  }

  // 通过学号获取到抽屉人信息 并存储起来(学号 姓名 角色)
  const getPersonInfo = async (studentNo: string) => {
    const res = await getPersonByStudentNo(studentNo)
    if (res?.code === 200) {
      setPersonInfo(res?.data)
    }
  }

  // 更新抽屉
  const refreshDrawer = () => {
    if (personInfo?.studentNo) {
      getPersonInfo(personInfo.studentNo)
      getLeaderMembers(personInfo.studentNo)
      getList(range as IRange)
    }
  }
  // 设置组长
  const setLeader = async () => {
    if (personInfo?.studentNo) {
      const res = await newGroup(personInfo?.studentNo)
      if (res?.code === 200) {
        message.success('设置成功')
        // 重新更新抽屉人信息&&组信息
        refreshDrawer()
        getList(range as IRange)
      } else {
        message.info(res?.message)
      }
    }
  }

  // 点击添加组员按钮
  const clickAddMemberBtn = async () => {
    setIsOptionOpen(true)
    const res = await getNoGroupMember()
    if (res?.code === 200) {
      const temp: IOption[] = res.data.reduce((pre: IOption[], cur) => {
        pre.push({
          value: cur.student_no,
          label: cur.username
        })
        return pre
      }, [])
      setNoGroupMembersOption(temp)
    } else {
      message.info(res?.message)
    }
  }

  // 将莫组员从某组踢出
  const deleteMember = async (student_no: string) => {
    const res = await delmember(student_no)
    if (res?.code === 200) {
      message.success('删除成功')
      if (personInfo?.studentNo) {
        getLeaderMembers(personInfo?.studentNo)
      }
    } else {
      message.info(res?.message)
    }
  }

  const handleChangeOption = (value: string[]) => {
    setMemberStudentNos(value)
  }

  // 点击管理员切换组长确定按钮
  const updateLeader = async () => {
    console.log('leaderInfo', groupLists?.leader_infos.studentNo)
    if (changeMember && groupLists?.leader_infos.studentNo) {
      const res = await updateleader(groupLists?.leader_infos.studentNo, changeMember)
      if (res?.code === 200) {
        getList(range as IRange)
        setChangeMember('')
        setIsClickChangeBtn(false)
        refreshDrawer()
        message.success('切换成功')
      } else {
        message.info(res?.message)
      }
    }
  }

  const handleChangeMember = (value: string) => {
    setChangeMember(value)
  }

  // 解散团队
  const deleteTeam = async () => {
    if (groupLists?.leader_infos.studentNo) {
      const res = await delteam(groupLists?.leader_infos.studentNo)
      if (res?.code === 200) {
        refreshDrawer()
        message.success('该组解散成功')
      } else {
        message.info(res?.message)
      }
    }
  }

  // 添加组员
  const addMembersBtn = async () => {
    if (memberStudentNos?.length && groupLists?.leader_infos.studentNo) {
      const res = await addMembers(groupLists?.leader_infos.studentNo, memberStudentNos.join(','))
      if (res?.code === 200) {
        message.success('添加成功')
        setMemberStudentNos([])
        setIsOptionOpen(false)
        refreshDrawer()
      } else {
        message.info(res?.message)
      }
    }
  }
  // 关闭抽屉
  const closeDrawer = () => {
    setChangeMember('')
    setIsClickChangeBtn(false)
    setIsOptionOpen(false)
    setMemberStudentNos([])
    setOpen(false)
  }

  // 关闭上传excel modal
  const handlecancelMember = () => {
    setIsUploadMembersModal(false)
    setExcelFile(undefined)
    setResponseData(undefined)
    setResponseLoading(false)
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
      const res = await uploadExcel(temp)
      if (res?.code === 200) {
        setResponseLoading(true)
        setAllResponseData(res.data)
        const temp1: IFileTableSource[] = res.data.correctUsers.reduce((pre: IFileTableSource[], cur) => {
          pre.push({
            key: cur.studentNo,
            studentNo: cur.studentNo,
            username: cur.username,
            password: cur.password,
            reason: cur.failReason ? cur.failReason : '√'
          })
          return pre
        }, [])
        const temp2: IFileTableSource[] = res.data.wrongUsers.reduce((pre: IFileTableSource[], cur) => {
          pre.push({
            key: cur.studentNo,
            studentNo: cur.studentNo,
            username: cur.username,
            password: cur.password,
            reason: cur.failReason ? cur.failReason : '√'
          })
          return pre
        }, [])
        temp1.concat(temp2)
        setResponseData(temp1)
        setResponseLoading(false)
      } else {
        message.info(res?.message)
      }
    } else {
      message.info('还未选择文件!')
    }
  }
  useEffect(() => {
    getList('all')
  }, [])

  useEffect(() => {
    getList(range as IRange)
  }, [current])

  useEffect(() => {
    getList(range as IRange)
  }, [range])
  return (
    <div>
      <div className={style.top_div}>
        <div>
          <Select
            style={{ width: '100px' }}
            defaultValue={'all'}
            onChange={handleChange}
            options={[
              {
                value: 'all',
                label: '全部'
              },
              {
                value: 'member',
                label: '组员'
              },
              {
                value: 'leader',
                label: '组长'
              }
            ]}
          ></Select>
        </div>
        <div>
          <Button onClick={() => setIsModalOpen(true)}>创建成员账号</Button>
          <Button className={style.top_div_btn} onClick={() => setIsUploadMembersModal(true)}>批量创建成员账号</Button>
        </div>
      </div>
      <Table
        loading={loading}
        dataSource={members}
        pagination={paginationProps}
      >
        <Column title="姓名" dataIndex="username" key="username" />
        <Column title="学号" dataIndex="studentNo" key="studentNo" />
        <Column
          title="角色"
          dataIndex="role"
          key="role"
          render={(role: IRole, _: any) => renderRole(role)}
        />
        <Column title="邮箱" dataIndex="email" key="email" />
        <Column title="手机号" dataIndex="phone" key="phone" />
        <Column title="组信息" dataIndex="groupInfo" key="groupInfo"
          render={(_, record: IMembersTable) => <a onClick={() => viewGroupInfo(record)}>查看</a>}
        ></Column>
        <Column title="创建时间" dataIndex="createTime" key="createTime" />
      </Table>
      <Modal
        title="添加成员"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name='createStu'
          onFinish={onFinish}
        >
          <Form.Item
            name='name'
            label='姓名'
            rules={[
              { required: true, message: '请输入姓名' },
              { max: 20, message: '姓名长度20以内' },
              { pattern: /^([\u4e00-\u9fa5]{2,20}|[a-zA-Z.\s]{2,20})$/, message: '姓名不合法' }
            ]}
          >
            <Input placeholder='请输入姓名'></Input>
          </Form.Item>
          <Form.Item
            name='username'
            label='成员学号'
            rules={[
              { required: true, message: '请输入学号' },
              { pattern: /^[0-9]+.?[0-9]*$/, message: '学号不合法' },
              { max: 20, message: '学号长度20以内' }
            ]}
          >
            <Input placeholder='请输入学号'></Input>
          </Form.Item>
          <p className={style.remind_text}>提醒成员初始密码为学号后六位</p>
          <Form.Item>
            <div className={style.btn_box}>
              <Button type="primary" htmlType="submit">
                确认添加
              </Button>
              <Button htmlType="button" onClick={handleCancel}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="批量创建成员账号"
        open={isUploadMembersModal}
        onCancel={handlecancelMember}
        footer={null}
        width={800}
      >
        <Image src={excelImg} width={500}></Image>
        <div className={style.modalText}>提示1：上传excel表格第一行为列名，请严格按照列名填写学生信息</div>
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
                dataSource={responseData}
                pagination={false}
              >
                <Column title="学号" dataIndex="studentNo" key="studentNo" />
                <Column title="姓名" dataIndex="username" key="username" />
                <Column title="密码" dataIndex="password" key="password" />
                <Column title="备注" dataIndex="reason" key="reason"></Column>
              </Table>
              <div>
          <div className={style.fileName}>成功解析<strong>{allResponseData?.corrcetCnt}</strong>个账户</div>
          <div className={style.fileName}><strong>{allResponseData?.wrongCnt}</strong>位账户无法创建</div>
        </div>
        <div className={style.file_box_btn}>
          <Button type="primary" htmlType="submit">
            确认添加上列账户
          </Button>
        </div>
              </>
              : null
          }
        </div>
      </Modal>
      <Drawer
        title="组信息"
        placement="right"
        onClose={() => closeDrawer()} open={open}
        width='600px'
      >
        <div className={style.drawer}>
          <div className={style.groupHead}>
            <div>
              {personInfo?.role ? renderRole(personInfo?.role) : null}{personInfo?.username} - {personInfo?.studentNo}
            </div>
            {
              personInfo?.role === 2
                ? <div>
                  {
                    !isOptionOpen
                      ? <Button size='small' onClick={() => clickAddMemberBtn()}>添加组员</Button>
                      : <Button size='small' onClick={() => { setIsOptionOpen(false); setMemberStudentNos([]) }}>取消添加组员</Button>
                  }</div>
                : null
            }
          </div>
          {
            isOptionOpen
              ? <div className={style.selectOption}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '90%' }}
                  placeholder="选择需要添加的组员"
                  onChange={handleChangeOption}
                  value={memberStudentNos}
                  options={noGroupMembersOption}
                />
                <Button size='small' onClick={() => addMembersBtn()}>确定</Button>
              </div>
              : null
          }
          <div className={style.groupInfo}>
            {
              groupLists?.leader_infos
                ? <>
                  <div>
                    <Tag color='geekblue'>组长</Tag>
                    {
                      groupLists?.leader_infos ? groupLists.leader_infos.username : ''
                    }
                    {
                      (Array.isArray(groupLists.member_infos) && groupLists.member_infos.length !== 0)
                        ? <>
                          {
                            !isClickChangeBtn
                              ? <Button size='small' style={{ marginLeft: '10px' }} onClick={() => setIsClickChangeBtn(true)}>组内切换组长</Button>
                              : <>
                                <Button size='small' style={{ marginLeft: '10px' }} onClick={() => setIsClickChangeBtn(false)}>取消</Button>
                                <Select
                                  allowClear
                                  size='small'
                                  style={{ width: '30%', marginLeft: '5px' }}
                                  placeholder="选择组员"
                                  onChange={handleChangeMember}
                                  options={membersOption}
                                />
                                <Button size='small' onClick={() => updateLeader()}>确定</Button>
                              </>
                          }
                        </>
                        : null
                    }
                  </div>
                  <div className={style.memberBox}>
                    <Tag color='blue' className={style.tag}>组员</Tag>
                    <div className={style.memberlist}>
                      {
                        !groupLists?.member_infos || (Array.isArray(groupLists.member_infos) && groupLists.member_infos.length === 0)
                          ? '暂无组员'
                          : groupLists.member_infos.map(user =>
                            <Popconfirm
                              key={user.student_no}
                              onConfirm={() => deleteMember(user.student_no)}
                              title='你确定要将该组员从组内移除吗？'
                              okText="确定"
                              cancelText="取消"
                            >
                              <a>{user.username}</a>
                            </Popconfirm>
                          )
                      }
                    </div>
                  </div>
                </>
                : <div className={style.noGroup}>
                  <span>该组员暂未加入任何组</span>
                  <Button onClick={() => setLeader()}>将该组员设置为组长</Button>
                </div>
            }
          </div>
          <div className={style.bottom}>
            {
              personInfo?.role === 2
                ? <Popconfirm
                  title='确认要解散该组吗？解散后该组成员也会被解散'
                  onConfirm={() => deleteTeam()}
                  okText="确定"
                  cancelText="取消"
                >
                  <a style={{ marginLeft: '5px' }}>解散该组</a>
                </Popconfirm>
                : null
            }
          </div>
        </div>
      </Drawer>
    </div>
  )
}
