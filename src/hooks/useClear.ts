import { useContext } from 'react'
import { context } from './store'

export default function useClear () {
  const { setTabBarId, setTabBarList } = useContext(context)
  // 退出清空 tabBarList tabBarId
  const clearTabBar = () => {
    setTabBarId(-1)
    setTabBarList([])
  }
  return {
    clearTabBar
  }
}
