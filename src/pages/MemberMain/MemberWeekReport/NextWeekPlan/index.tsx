import React, { useEffect, useState } from 'react'
import style from '../index.module.scss'
import { type IDomEditor, type IEditorConfig, type IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { Button, Upload, message } from 'antd'
import { postAvatar } from '../../../../api/Member'
import { type IWeekPlan } from '../../../../libs/model'
import { UploadOutlined } from '@ant-design/icons'
import DeleteIcon from '../../../../assets/imgs/delete.png'

interface Props {
  weekPlan: IWeekPlan
  setWeekPlan: (x: IWeekPlan) => void
}

export default function NextWeekPlan({ weekPlan, setWeekPlan }: Props) {
  // 图片类型定义
  type InsertPicType = (url: string) => void

  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null) // TS 语法

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [
      'todo',
      'group-indent',
      'insertTable',
      'group-more-style',
      'group-video',
      'insertImage',
      'codeBlock',
      'blockquote'
    ]
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {}
  }

  // 检查图片格式和大小
  const beforeUpload = (file: File) => {
    const isPNG = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/webp'
    if (!isPNG) {
      message.error(`${file.name} 图片只能位png、jpeg、jpg或webp格式`)
    }
    const isLt2M = file.size / 1024 / 1024 < 20
    if (!isLt2M) {
      message.error('图片要小于20MB!')
    }
    return isPNG && isLt2M
  }

  // 检查大小
  const beforeUpload2 = async (file: File) => {
    if (weekPlan.attach.length === 3) {
      message.info('最多上传3个附件')
      return false
    } else {
      const temp = new FormData()
      temp.append('file', file)
      const res = await postAvatar(temp)
      if (res?.code === 200) {
        const tempData = res.data.photo
        setWeekPlan({ ...weekPlan, attach: [...weekPlan.attach, { fileName: file.name, url: tempData }] })
      }
    }
    const isLt2M = file.size / 1024 / 1024 < 20
    if (!isLt2M) {
      message.error('文件要小于20MB!')
      return false
    }
    return true
  }

  editorConfig.MENU_CONF!['uploadImage'] = {
    async customUpload(richPic: File, insertFn: InsertPicType) {
      if (beforeUpload(richPic)) {
        const temp = new FormData()
        temp.append('file', richPic)
        const res = await postAvatar(temp)
        if (res?.code === 200) {
          insertFn(res.data.photo)
        }
      }
    }
  }

  // 删除文件
  const deleteFile = (url: string) => {
    setWeekPlan({ ...weekPlan, attach: weekPlan.attach.filter(item => item.url !== url) })
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])
  return (
    <div className={style.partOne}>
      <div className={style.headOne}>二、下周计划</div>
      <div style={{ border: '1px solid #ccc', zIndex: 100, marginBottom: '5px' }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={weekPlan.content}
          onCreated={setEditor}
          onChange={editor => setWeekPlan({ ...weekPlan, content: editor.getHtml() })}
          mode="default"
          style={{ height: '300px', overflowY: 'hidden' }}
        />
      </div>
      <Upload
        showUploadList={false}
        beforeUpload={beforeUpload2}
        customRequest={() => { }}
      >
        <Button icon={<UploadOutlined />}>选择附件</Button>
      </Upload>
      {
        weekPlan.attach.map(item => <div key={item.url} className={style.urlBox}>
          <a href={item.url} className={style.url}>{item.fileName}</a>
          <img src={DeleteIcon} className={style.deleteFile} onClick={() => deleteFile(item.url)}></img>
        </div>
        )
      }
    </div>
  )
}
