import React, { useEffect, useState, useContext } from 'react'
import { Menu, type MenuProps, Modal, Tooltip } from 'antd'
import style from './index.module.scss'
import existIcon from '../../assets/imgs/exist.svg'
import headerIcon from '../../assets/imgs/science_icon.svg'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import TabBar from '../../components/TabBar'
import useTabBar from '../../hooks/useTabBar'
import { context } from '../../hooks/store'
import { leaderFunc, managerFunc, memberFunc } from '../../libs/data'
import { type IRole, type ITabBarCommon } from '../../libs/model'
import useClear from '../../hooks/useClear'

type MenuItem = Required<MenuProps>['items'][number]

function getItem (
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  theme?: 'light' | 'dark'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    theme
  } as MenuItem
}

export default function Home () {
  const location = useLocation()
  const navigator = useNavigate()
  const [func, setFunc] = useState<ITabBarCommon[]>([])
  const [role, setRole] = useState<IRole>()
  const { addTabBar } = useTabBar()
  const { clearTabBar } = useClear()
  const { setTabBarId, tabBarId } = useContext(context)
  // 退出modal提醒
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 根据路由显示header
  const headerText = () => {
    switch (role) {
      case 3:
        return '-组员端'
      case 2:
        return '-组长端'
      case 1:
        return '-管理员端'
      default:
        return null
    }
  }

  // 根据tabBarId增加
  const onClick: MenuProps['onClick'] = e => {
    const index = Number(e.key)
    addTabBar(func[index])
    setTabBarId(func[index].value)
  }

  useEffect(() => {
    // 得到角色
    const roleTemp = location.pathname.split('/')[1]
    switch (roleTemp) {
      case 'member':
        setRole(3)
        setFunc(memberFunc)
        addTabBar(memberFunc[0])
        break
      case 'leader':
        setRole(2)
        setFunc(leaderFunc)
        addTabBar(leaderFunc[0])
        break
      case 'manager':
        setRole(1)
        setFunc(managerFunc)
        addTabBar(managerFunc[0])
        break
      default:
        console.log('error')
    }
  }, [])

  useEffect(() => {
    const path = func[tabBarId]
    switch (role) {
      case 3:
        navigator(`/member/${path.name}`)
        break
      case 2:
        navigator(`/leader/${path.name}`)
        break
      case 1:
        navigator(`/manager/${path.name}`)
        break
      default:
        console.log('error')
    }
  }, [tabBarId])

  const items: MenuItem[] = func
    .map(item => getItem(item.label, item.value))

  const showModal = () => { setIsModalOpen(true) }

  const handleCancel = () => { setIsModalOpen(false) }

  // 退出
  const handleOk = () => {
    setIsModalOpen(false)
    // 退出清除tabBarList
    clearTabBar()
    // 清除token
    localStorage.clear()
    navigator('/login')
  }

  const info = <span style={{ color: '#333', cursor: 'pointer' }} onClick={showModal}>退出</span>

  return (
    <div className={style.home}>
      <header className={style.header}>
        <div className={style.header_left}>
          <img src={headerIcon} className={style.icon}></img>
          科研团队管理系统{headerText()}
        </div>
        <Tooltip
          title={info}
          color='#fff'
          >
          <img src={existIcon} className={style.existIcon} onClick={showModal}></img>
        </Tooltip>
      </header>
      <main className={style.main}>
        <aside className={style.aside}>
          <Menu
            onClick={onClick}
            style={{ width: 200 }}
            selectedKeys={[tabBarId.toString()]}
            mode="vertical"
            theme="light"
            items={items}
          />
        </aside>
        <div className={style.right}>
          <TabBar></TabBar>
          <Outlet/>
        </div>
      </main>
      <Modal title="确认退出" open={isModalOpen}
      onOk={handleOk} onCancel={handleCancel}
      cancelText={'取消'}
      okText={'确定'}
      >
        <p>您确定要退出吗？退出后未提交数据将清除</p>
      </Modal>
    </div>
  )
}
