import React from 'react'
import style from './index.module.scss'
import headerIcon from '../../assets/imgs/science_icon.svg'
import { Button, Form, Input, Radio } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Login () {
  const [form] = Form.useForm()
  const navigator = useNavigate()
  const onFinish = async () => {
    // const res = await login(values.role, values.username, values.password)
    // if (res?.status === 10001) {
    //   localStorage.setItem('token', res.data.token)
    //   localStorage.setItem('id', res.data.id)
    //   message.success('登录成功')
    //   const { role } = values
    //   if (role === 0) {
    //     localStorage.setItem('role', '0')
    //     navigator('/student')
    //   } else if (role === 1) {
    //     localStorage.setItem('role', '1')
    //     navigator('/teacher')
    //   } else if (role === 2) {
    //     localStorage.setItem('role', '2')
    //     navigator('/manager')
    //   }
    // }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const onReset = () => {
    form.resetFields()
  }

  return (
    <div className={style.login_part}>
      <header className={style.header}>
        <img src={headerIcon} className={style.icon}></img>
        科研团队管理系统
      </header>
      <main className={style.main}>
        <div className={style.login_box}>
          <Form
            className={style.login_form}
            form={form}
            name='login'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label='选择角色'
              name='role'
              rules={[
                { required: true, message: '请选择角色' }
              ]}
              initialValue={0}
            >
              <Radio.Group>
                <Radio value={0}>学生</Radio>
                <Radio value={1}>老师</Radio>
                <Radio value={2}>管理员</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name='username'
              rules={[
                { required: true, message: '用户名不为空' }
              ]}
            >
              <Input placeholder='请输入用户名'>
              </Input>
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: '密码不为空' }
              ]}
            >
              <Input.Password placeholder='请输入密码'></Input.Password>
            </Form.Item>
            <Form.Item>
              <div className={style.buttons}>
                <Button className={style.button} type='primary' htmlType="submit">登录</Button>
                <Button className={style.button} htmlType="button" onClick={onReset}>重置</Button>
              </div>
            </Form.Item>
            <Form.Item>
              <div>
                <p className={style.warning_text}>本网站禁止爬虫采集或转载商业化</p>
                <p>本网站建议使用谷歌浏览器</p>
              </div>
            </Form.Item>
          </Form>
        </div>
      </main>
      <footer className={style.footer}>科研团队管理系统 - Scientific research team management system - 2023</footer>
    </div>
  )
}
