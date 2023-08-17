import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import { getManagerInfo, modifyInfo, modifyPassWord, postAvatar } from '../../../api/Manager'
import { type IManagerRole } from '../../../libs/model'
import { Button, Form, Input, Modal, Upload, message } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import useVarify from '../../../hooks/useVarify'
import { type RcFile, type UploadChangeParam, type UploadFile, type UploadProps } from 'antd/lib/upload'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import SpinLoad from '../../../components/SpinLoad'

interface IItem {
  label: 'phoneNumber' | 'email' | ''
  value: string
}

export default function MInfo() {
  const [info, setInfo] = useState<IManagerRole>()
  const getInfo = async () => {
    const res = await getManagerInfo()
    if (res?.code === 200) {
      setInfo(res.data)
    }
  }

  const [avatar, setAvatar] = useState<Blob | undefined>()
  const [item, setItem] = useState<IItem>()
  const [warn, setWarn] = useState<string>()
  const [maskLoading, setMaskLoading] = useState(false)
  const { checkPhone, checkEmail } = useVarify()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [form] = useForm()
  // 控制修改头像
  const [avatarVisible, setAvatarVisible] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const resetItem = () => {
    setItem({ label: '', value: '' })
    setWarn('')
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }

  // 刷新
  const refresh = () => {
    getInfo()
    resetItem()
  }

  const checkBasicInfo = async () => {
    if (item?.label === 'phoneNumber') {
      if (checkPhone(item.value)) {
        const res = await modifyInfo(info?.avatar ? info.avatar : '', info?.email ? info?.email : '', item.value)
        if (res?.code === 200) {
          refresh()
          message.success('修改成功')
        } else {
          message.info(res?.message)
        }
        setWarn('')
      } else {
        setWarn('联系电话格式有误')
      }
    } else if (item?.label === 'email') {
      if (checkEmail(item.value)) {
        const res = await modifyInfo(info?.avatar ? info.avatar : '', item.value, info?.phone ? info?.phone : '')
        if (res?.code === 200) {
          refresh()
          message.success('修改成功')
        } else {
          message.info(res?.message)
        }
        setWarn('')
      } else {
        setWarn('邮箱格式有误')
      }
    }
  }

  const onFinish = async (values: any) => {
    const { oldPassword, password, confirmPassword } = values
    if (password !== confirmPassword) {
      message.info('两次密码不一致')
    } else {
      const res = await modifyPassWord(oldPassword, password, confirmPassword)
      if (res?.code === 200) {
        message.success('修改成功')
        handleCancel()
      } else {
        message.info(res?.message)
      }
    }
  }

  // 修改头像
  const clickChangeAvatar = async () => {
    if (!avatar) {
      message.info('请上传图片')
    } else {
      const temp = new FormData()
      temp.append('file', avatar)
      const res = await postAvatar(temp)
      if (res?.code === 200) {
        setImageUrl(res.data.photo)
        setMaskLoading(true)
        const res2 = await modifyInfo(res.data.photo, info?.email ? info.email : '', info?.phone ? info.phone : '')
        if (res2?.code === 200) {
          setMaskLoading(false)
          setAvatar(undefined)
          setImageUrl('')
          getInfo()
          message.success('头像设置成功')
          setAvatarVisible(false)
        } else {
          message.info(res2?.message)
        }
      }
    }
  }

  // 检查图片格式和大小
  const beforeUpload = (file: RcFile) => {
    const isPNG = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/webp'
    if (!isPNG) {
      message.error(`${file.name} 图片只能位png、jpeg、jpg或webp格式`)
    }
    const isLt2M = file.size / 1024 / 1024 < 20
    if (!isLt2M) {
      message.error('图片要小于20MB!')
    }
    if (isPNG && isLt2M) {
      setAvatar(file)
    }
    return isPNG && isLt2M
  }

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  )

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  useEffect(() => {
    getInfo()
  }, [])
  return (
    <div className={style.back}>
      <div className={style.info_box}>
        <span className={style.title}>个人信息</span>
        <div className={style.person_bpx}>
          <div className={style.avatar} onClick={() => setAvatarVisible(true)}>
            <img src={info?.avatar} className={style.avatarIcon}></img>
          </div>
          <div className={style.info}>
            <span>账号：</span><span>{info?.studentNo}</span>
            <span>姓名：</span><span>{info?.username}</span>
            <span>联系电话：</span>
            <div
              className={style.changeInfo}
            >{
                item?.label !== 'phoneNumber'
                  ? (info?.phone ? info.phone : <div className={style.nullText}>还未设置手机号</div>)
                  : <div>
                    <Input
                      className={style.input}
                      value={item?.value}
                      onChange={(e) => { setItem({ label: 'phoneNumber', value: e.target.value }) }}
                    ></Input>
                    <div className={style.warn}>{warn}</div>
                  </div>
              }
              {
                item?.label === 'phoneNumber'
                  ? <div className={style.btns}>
                    <Button type='default' size='small' onClick={() => resetItem()}>取消</Button>
                    <Button type='primary' size='small' className={style.confirm} onClick={() => checkBasicInfo()}>确认</Button>
                  </div>
                  : <a
                    className={style.modify}
                    onClick={() => { setItem({ label: 'phoneNumber', value: info?.phone as string }) }}
                  >修改</a>
              }
            </div>
            <span>邮箱：</span>
            <div
              className={style.changeInfo}
            >{
                item?.label !== 'email'
                  ? (info?.email ? info.email : <div className={style.nullText}>还未设置邮箱</div>)
                  : <div>
                    <Input
                      className={style.input}
                      value={item?.value}
                      onChange={(e) => { setItem({ label: 'email', value: e.target.value }) }}
                    ></Input>
                    <div className={style.warn}>{warn}</div>
                  </div>
              }
              {
                item?.label === 'email'
                  ? <div className={style.btns}>
                    <Button type='default' size='small' onClick={() => resetItem()}>取消</Button>
                    <Button type='primary' size='small' className={style.confirm} onClick={() => checkBasicInfo()}>确认</Button>
                  </div>
                  : <a
                    className={style.modify}
                    onClick={() => { setItem({ label: 'email', value: info?.email as string }) }}
                  >修改</a>
              }
            </div>
          </div>
        </div>
      </div>
      <div className={style.password_box}>
        <span className={style.title}>安全设置</span>
        <div className={style.secure_box}>
          <span>修改密码</span>
          <a className={style.modify} onClick={showModal}>修改</a>
        </div>
      </div>
      <Modal title="修改密码"
        open={isModalOpen}
        onCancel={() => { form.resetFields(); setIsModalOpen(false) }}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name='passwordChange'
          onFinish={onFinish}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[
              { required: true, message: '请输入原密码' },
              { pattern: /^[a-zA-Z0-9]{6,16}$/, message: '6-16位，字母或数字组合' }
            ]}
          >
            <Input type='password' />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              { required: true, message: '请输入新密码' },
              { pattern: /^[a-zA-Z0-9]{6,16}$/, message: '6-16位，字母或数字组合' }
            ]}
          >
            <Input type="password" placeholder='6-16位，字母或数字组合' />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[
              { required: true, message: '请再次输入密码' },
              { pattern: /^[a-zA-Z0-9]{6,16}$/, message: '6-16位，字母或数字组合' }
            ]}
          >
            <Input type='password' />
          </Form.Item>
          <Form.Item>
            <div className={style.btn_box}>
              <Button type="primary" htmlType="submit" >
                确认修改
              </Button>
              <Button htmlType="button" onClick={() => handleCancel()}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="上传新头像"
        open={avatarVisible}
        onOk={clickChangeAvatar}
        cancelText='取消'
        okText='确定'
        onCancel={() => { setAvatarVisible(false); setImageUrl(''); setAvatar(undefined) }}
        destroyOnClose
      >
        <div className={style.back_mask}>
          {
            maskLoading ? <SpinLoad></SpinLoad> : ''
          }
          <div className={style.bigBox}>
            <div className={style.init_box}>
              <img src={info?.avatar} className={style.init_img}></img>
            </div>
            <div className={style.upload_box}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                onChange={handleChange}
                customRequest={(option) => {
                  const before = beforeUpload(option.file as RcFile)
                  if (before) {
                    const reader = new FileReader()
                    reader.readAsDataURL(option.file as RcFile)
                    reader.onloadend = function (e) {
                      setImageUrl(e.target!.result as string)
                      setLoading(false)
                    }
                  } else {
                    setLoading(false)
                  }
                }}
              >
                <div>{imageUrl ? <img src={imageUrl} style={{ width: '100%' }} /> : uploadButton}</div>
              </Upload>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
