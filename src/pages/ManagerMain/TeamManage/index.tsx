import { Button, Drawer, Form, Input, Modal, Select, Table, Tag, message } from 'antd'
import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import { useForm } from 'antd/lib/form/Form'
import Column from 'antd/lib/table/Column'
import { createUser, getMember, getteaminfos, newGroup } from '../../../api/Manager'
import { type IRole, type IMembersTable, type IRange, type ITeamInfoLists } from '../../../libs/model'
import dayjs from 'dayjs'

export default function TeamManage() {
  const [open, setOpen] = useState(false)
  const [personInfo, setPersonInfo] = useState<IMembersTable>()
  const [groupLists, setGroupLists] = useState<ITeamInfoLists>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [members, setMembers] = useState<IMembersTable[]>()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [range, setRange] = useState('all')
  const [total, setTotal] = useState<number>(0)
  const [form] = useForm()
  const handleCancel = () => {
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

  const viewGroupInfo = async (memberInfo: IMembersTable) => {
    const res = await getteaminfos(memberInfo.studentNo)
    console.log(res?.data)
    setGroupLists(res?.data)
    setOpen(true)
    setPersonInfo(memberInfo)
  }

  const setLeader = async () => {
    if (personInfo?.studentNo) {
      const res = await newGroup(personInfo?.studentNo)
      if (res?.code === 200) {
        message.success('设置成功')
        setPersonInfo({ ...personInfo, role: 2 })
        viewGroupInfo(personInfo)
        getList(range as IRange)
      } else {
        message.info(res?.message)
      }
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
          <Button className={style.top_div_btn}>批量创建成员账号</Button>
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
      <Drawer
        title="组信息"
        placement="right"
        onClose={() => setOpen(false)} open={open}
        width='600px'
      >
        <div>
          <div className={style.groupHead}>
            <div>
              {
                personInfo?.role === 2
                  ? <Button size='small' style={{ marginRight: '5px' }}>切换</Button>
                  : null
              }
              {personInfo?.role ? renderRole(personInfo?.role) : null}{personInfo?.username} - {personInfo?.studentNo}
            </div>
            {
              personInfo?.role === 2
                ? <div><Button size='small'>添加组员</Button></div>
                : null
            }
          </div>
          <div className={style.groupInfo}>
            {
              groupLists?.leader_infos
                ? <>
                  <div>
                    <Tag color='geekblue'>组长</Tag>
                    {
                      groupLists?.leader_infos ? groupLists.leader_infos.username : ''
                    }
                  </div>
                  <div className={style.memberBox}>
                    <Tag color='blue'>组员</Tag>
                    <div className={style.memberlist}>
                      {
                        !groupLists?.member_infos || (Array.isArray(groupLists.member_infos) && groupLists.member_infos.length === 0)
                          ? '暂无组员'
                          : groupLists.member_infos.map(user => <span key={user.student_no}>{user.username}</span>)
                      }
                    </div>
                  </div>
                </>
                : <div className={style.noGroup}>
                  <span>该组员暂未加入任何组</span>
                  <Button onClick={() => setLeader()}>为该组员成立小组</Button>
                </div>
            }
          </div>
        </div>
      </Drawer>
    </div>
  )
}
