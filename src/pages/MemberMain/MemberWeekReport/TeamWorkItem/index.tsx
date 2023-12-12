import React, { useEffect, useState } from 'react'
import style from '../index.module.scss'
import {
  t,
  type IDomEditor,
  type IEditorConfig,
  type IToolbarConfig
} from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { Button, Input, InputNumber, TreeSelect, Upload, message } from 'antd'
import DeleteIcon from '../../../../assets/imgs/delete.png'
import { postAvatar } from '../../../../api/Member'
import { treeData } from '../../../../libs/data'
import { type ITeamWork } from '../../../../libs/model'
import AddIcon from '../../../../assets/imgs/add.png'
import { UploadOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
interface Props {
  index: number
  teamWorkLength: number
  info: ITeamWork
  teamWorks: ITeamWork[]
  setTeamWorks: (x: ITeamWork[]) => void
  deTeamWorks: (id: string) => void
}
export default function TeamWorkItem({
  teamWorks,
  setTeamWorks,
  info,
  deTeamWorks,
  index,
  teamWorkLength
}: Props) {
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
    const isPNG =
      file.type === 'image/png' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg' ||
      file.type === 'image/webp'
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

  const onChangeTeamWorkType = (value: string, id: string) => {
    setTeamWorks(
      teamWorks.map((item) => {
        if (item.id === id) {
          item.type = value
        }
        return item
      })
    )
  }

  const onChangeDuration = (value: number | null, id: string) => {
    setTeamWorks(
      teamWorks.map((item) => {
        if (item.id === id) {
          item.duration = value
        }
        return item
      })
    )
  }

  const onChangeTitle = (value: string, id: string) => {
    setTeamWorks(
      teamWorks.map((item) => {
        if (item.id === id) {
          item.title = value
        }
        return item
      })
    )
  }

  const onChangeEditor = (value: string, id: string) => {
    setTeamWorks(
      teamWorks.map((item) => {
        if (item.id === id) {
          item.content = value
        }
        return item
      })
    )
  }

  // 检查大小
  const beforeUpload2 = async (file: File, id: string) => {
    if (teamWorks[index].attach.length === 3) {
      message.info('最多上传3个附件')
      return false
    } else {
      const temp = new FormData()
      temp.append('file', file)
      const res = await postAvatar(temp)
      if (res?.code === 200) {
        const tempData = res.data.photo
        setTeamWorks(
          teamWorks.map((item) => {
            if (item.id === id) {
              item.attach = [
                ...item.attach,
                { fileName: file.name, url: tempData }
              ]
            }
            return item
          })
        )
      } else {
        message.error('上传失败')
      }
    }
    const isLt2M = file.size / 1024 / 1024 < 20
    if (!isLt2M) {
      message.error('文件要小于20MB!')
      return false
    }
    return true
  }

  // 删除文件
  const deleteFile = (url: string, id: string) => {
    setTeamWorks(
      teamWorks.map((item) => {
        if (item.id === id) {
          item.attach = item.attach.filter((item2) => item2.url !== url)
        }
        return item
      })
    )
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
    <div>
      <div className={style.border}>
        {index === teamWorkLength - 1 ? (
          <img
            src={DeleteIcon}
            className={style.deleteIcon}
            onClick={() => deTeamWorks(info.id)}
          ></img>
        ) : null}
        <Input
          value={info.title ? info.title : ''}
          style={{ marginBottom: '5px' }}
          placeholder="请填写贡献标题,最多50字"
          max={50}
          onChange={(e) => onChangeTitle(e.target.value, info.id)}
        ></Input>
        <TreeSelect
          showSearch
          style={{ width: '100%' }}
          value={info.type?.toString()}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择团队类型"
          allowClear
          treeDefaultExpandAll
          onChange={(value: string) => onChangeTeamWorkType(value, info.id)}
          treeData={treeData}
          treeNodeFilterProp="title"
        />
        <div className={style.timeLine}>
          <InputNumber
            value={info.duration}
            onChange={(value: number | null) =>
              onChangeDuration(value, info.id)
            }
            min={1}
            className={style.inputNumber}
            placeholder="请输入服务时长（每半天为一个档）"
          ></InputNumber>
          <div className={style.label}>半天</div>
        </div>
        <div
          style={{ border: '1px solid #ccc', zIndex: 100, marginBottom: '5px' }}
        >
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ borderBottom: '1px solid #ccc' }}
          />
          <Editor
            defaultConfig={editorConfig}
            value={info.content}
            onCreated={setEditor}
            onChange={(editor) => onChangeEditor(editor.getHtml(), info.id)}
            mode="default"
            style={{ height: '300px', overflowY: 'hidden' }}
          />
        </div>
        <Upload
          showUploadList={false}
          beforeUpload={(file: File) => beforeUpload2(file, info.id)}
          customRequest={() => {}}
        >
          <Button icon={<UploadOutlined />}>选择附件</Button>
        </Upload>
        {teamWorks[index].attach.map((item) => (
          <div key={item.url} className={style.urlBox}>
            <a href={item.url} className={style.url}>
              {item.fileName}
            </a>
            <img
              src={DeleteIcon}
              className={style.deleteFile}
              onClick={() => deleteFile(item.url, info.id)}
            ></img>
          </div>
        ))}
      </div>
    </div>
  )
}
