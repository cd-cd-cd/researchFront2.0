import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import { type IWorkType, type IWeeklyReports, type IWeekProgress } from '../../../../libs/model'
import useReport from '../../../../hooks/useReport'
import { type IDomEditor, type IEditorConfig, type IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'

import { Button, message, Comment, Avatar } from 'antd'
import { type IGetreportcomment, addreportcomment, getreportcomment, postAvatar, delreportcomment } from '../../../../api/Manager'
import dayjs from 'dayjs'
interface Props {
  detail: IWeeklyReports
  detailReturn: () => void
  getUserList: () => void
  getSource: () => void
  reportSearch: () => void
  searchType: number | undefined
}
export default function Detail({ detail, detailReturn, getUserList, getSource, reportSearch, searchType }: Props) {
  const { renderType } = useReport()
  const [comments, setComments] = useState<IWeekProgress>({
    content: '',
    attach: []
  })
  // 0 管理员 1 组长
  const [commentType, setCommentType] = useState(0)
  // 保存评论
  const [infos, setInfos] = useState<IGetreportcomment>()
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

  // 回复周报
  const returnComments = async () => {
    if (comments.content === '<p><br></p>' || !comments.content) {
      message.info('请输入回复内容')
    } else {
      const res = await addreportcomment(detail.id, comments.content)
      if (res?.code === 200) {
        setComments({ ...comments, content: '' })
        getReportComments()
        message.success('回复成功')
      } else {
        message.info('请重试')
      }
    }
  }

  // 根据周报id，得到周报的所有回复，按照提交时间倒序
  const getReportComments = async () => {
    const res = await getreportcomment(detail.id)
    if (res?.code === 200) {
      setInfos(res.data)
      if (searchType === 0) {
        getSource()
      } else if (searchType === 1) {
        reportSearch()
      }
      getUserList()
    }
  }

  // 撤回评论
  const delComments = async (commentId: string) => {
    const res = await delreportcomment(commentId)
    if (res?.code === 200) {
      message.success('撤回成功')
      getReportComments()
    } else {
      message.info('失败')
    }
  }

  useEffect(() => {
    getReportComments()
  }, [commentType])

  return (
    <div className={style.detail}>
      <div className={style.main} id='report'>
        <div className={style.returnBtn}><Button onClick={detailReturn}>返回</Button></div>
        <div className={style.title}>周报</div>
        <div className={style.date} id='time'>
          {detail?.time}
        </div>
        <div className={style.partOne}>
          <div className={style.headOne}>一、本周进展</div>
          <div className={style.border}>
            <div dangerouslySetInnerHTML={{ __html: detail?.weekProgress.content }}></div>
            {
              detail?.weekProgress.attach.map(item => <div key={item.url} className={style.urlBox}>
                <a href={item.url} className={style.url}>{item.fileName}</a>
              </div>
              )
            }
          </div>
        </div>
        <div className={style.partOne}>
          <div className={style.headOne}>二、下周计划</div>
          <div className={style.border}>
            <div dangerouslySetInnerHTML={{ __html: detail?.weekPlan.content }}></div>
            {
              detail?.weekPlan.attach.map(item => <div key={item.url} className={style.urlBox}>
                <a href={item.url} className={style.url}>{item.fileName}</a>
              </div>
              )
            }
          </div>
        </div>
        {
          detail?.teamWorks.length
            ? <div className={style.partOne}>
              <div className={style.headOne}>三、团队服务</div>
              <div>
                {
                  detail?.teamWorks.map((item, index) => <div key={item.id} className={style.border}>
                    <div>
                      <div className={style.Teamworktitle}>{(index + 1).toString() as string + '. ' + (item.title as string)}</div>
                      <div className={style.type}>类型： {item.type ? renderType(item.type as IWorkType) : ''}</div>
                      <div className={style.time}>服务时长：{item.duration} 个半天</div>
                    </div>
                    <div style={{ margin: '2px' }} dangerouslySetInnerHTML={{ __html: item.content }}></div>
                    {
                      item.attach.map(item => <div key={item.url} className={style.urlBox}>
                        <a href={item.url} className={style.url}>{item.fileName}</a>
                      </div>
                      )
                    }
                  </div>)
                }
              </div>
            </div>
            : null
        }
      </div>
      <div className={style.commentDiv}>
        <div className={style.btn_box}>
          <Button type={commentType === 0 ? 'primary' : 'default'} onClick={() => setCommentType(0)}>管理员</Button>
          <Button type={commentType === 1 ? 'primary' : 'default'} onClick={() => setCommentType(1)}>组长</Button>
        </div>
        <div className={style.infos_div}>
          {
            commentType === 0
              ? infos?.adminGroupComments.map(item =>
                <Comment
                  key={item.id}
                  author={<a>{item.userInfo.username + '-' + item.userInfo.studentNo}</a>}
                  avatar={<Avatar src={item.userInfo.photo} alt={item.userInfo.username} />}
                  content={
                    <div>
                      <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                      {
                        item.isMyself === 1 && !item.content.includes('该评论已于')
                          ? <div className={style.returnDiv}>
                            <div className={style.returnComment} onClick={() => delComments(item.id)}>撤回</div>
                          </div>
                          : null
                      }
                    </div>
                  }
                  datetime={
                    <span>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  }
                />)
              : null
          }
          {
            commentType === 1
              ? infos?.leaderGroupComments.map(item =>
                <Comment
                  key={item.id}
                  author={<a>{item.userInfo.username + '-' + item.userInfo.studentNo}</a>}
                  avatar={<Avatar src={item.userInfo.photo} alt={item.userInfo.username} />}
                  content={
                    <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                  }
                  datetime={
                    <span>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  }
                />)
              : null
          }
        </div>
      </div>
      <div className={style.editorMain}>
            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
              <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: '1px solid #ccc' }}
              />
              <Editor
                defaultConfig={editorConfig}
                value={comments?.content}
                onCreated={setEditor}
                onChange={editor => setComments({ ...comments, content: editor.getHtml() })}
                mode="default"
                style={{ height: '300px', overflowY: 'hidden' }}
              />
            </div>
            <Button className={style.sendMessage} disabled={ commentType !== 0 } onClick={() => returnComments()}>回复</Button>
          </div>
    </div>
  )
}
