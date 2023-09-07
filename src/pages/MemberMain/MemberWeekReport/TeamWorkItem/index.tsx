import React, { useEffect, useState } from 'react'
import style from '../index.module.scss'
import { type IDomEditor, type IEditorConfig, type IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { Input, InputNumber, TreeSelect, message } from 'antd'
import DeleteIcon from '../../../../assets/imgs/delete.png'
import { postAvatar } from '../../../../api/Member'
import { treeData } from '../../../../libs/data'
import { type ITeamWork } from '../../../../libs/model'
interface Props {
  deleteWork: (id: string) => void
  item: ITeamWork
  updateWork: (type: 'workType' | 'duration' | 'content', id: string, value: string | number) => void
}
export default function TeamWorkItem({ deleteWork, item, updateWork }: Props) {
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
  const onChangeTeamWorkType = (newValue: string) => {
    updateWork('workType', item.id, newValue)
  }

  const onChangeDuration = (newValue: number | null) => {
    if (!newValue) {
      message.info('服务时间不为空')
    } else {
      updateWork('duration', item.id, newValue)
    }
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
    <div className={style.border}>
      <img src={DeleteIcon} className={style.icon} onClick={() => deleteWork(item.id)}></img>
      <TreeSelect
        showSearch
        style={{ width: '100%' }}
        value={item.type?.toString()}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择团队类型"
        allowClear
        treeDefaultExpandAll
        onChange={onChangeTeamWorkType}
        treeData={treeData}
        treeNodeFilterProp="title"
      />
      <div className={style.timeLine}>
        <InputNumber value={item.duration} onChange={onChangeDuration} min={1} className={style.inputNumber} placeholder='请输入服务时长（每半天为一个档）'></InputNumber>
        <div className={style.label}>半天</div>
      </div>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={item.content}
          onCreated={setEditor}
          onChange={editor => updateWork('content', item.id, editor.getHtml())}
          mode="default"
          style={{ height: '300px', overflowY: 'hidden' }}
        />
      </div>
    </div>
  )
}
