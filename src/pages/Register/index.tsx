import React from 'react'
import style from './index.module.scss'
import headerIcon from '../../assets/imgs/science_icon.svg'
import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { type IRegisterValues } from '../../libs/model'
import { managerRegister } from '../../api/Manager'

export default function Register() {
  const [form] = Form.useForm()
  const navigator = useNavigate()
  const onFinish = async (values: IRegisterValues) => {
    const { username, password, confirmPassword } = values
    if (password !== confirmPassword) {
      message.info('两次密码不一致！')
    } else {
      const res = await managerRegister(username, password, 1)
      if (res?.code === 200) {
        message.success("注册成功")
      } else {
        message.info(res?.message)
      }
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const onReset = () => {
    form.resetFields()
  }

  const gotoRegister = () => {
    navigator('/login')
  }
  return (
    <div className={style.login_part}>
      <header className={style.header}>
        <img src={headerIcon} className={style.icon}></img>
        科研团队管理系统
      </header>
      <main className={style.main}>
        <div className={style.login_box}>
          <p className={style.title}>管理员注册</p>
          <Form
            className={style.login_form}
            form={form}
            name='login'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name='username'
              rules={[
                { required: true, message: '用户名不为空' },
                { min: 6, message: '用户名不少于6位数' }
              ]}
            >
              <Input placeholder='请输入用户名'>
              </Input>
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: '密码不为空' },
                { min: 6, message: '密码不少于6位数' }
              ]}
            >
              <Input.Password placeholder='请输入密码'></Input.Password>
            </Form.Item>
            <Form.Item
              name='confirmPassword'
              rules={[
                { required: true, message: '密码不为空' },
                { min: 6, message: '密码不少于6位数' }
              ]}
            >
              <Input.Password placeholder='请再次输入密码'></Input.Password>
            </Form.Item>
            <Form.Item>
              <div className={style.buttons}>
                <Button className={style.button} type='primary' htmlType="submit">注册</Button>
                <Button className={style.button} htmlType="button" onClick={onReset}>重置</Button>
              </div>
            </Form.Item>
            <Form.Item>
              <div>
                <p className={style.registerText} onClick={gotoRegister}>返回登录页面</p>
              </div>
            </Form.Item>
          </Form>
        </div>
      </main>
      <footer className={style.footer}>科研团队管理系统 - Scientific research team management system - 2023</footer>
    </div>
  )
}
