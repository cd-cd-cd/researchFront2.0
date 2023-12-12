import { useCallback, useContext } from 'react'
import { type ITabBarCommon } from '../libs/model'
import { context } from './store'

export default function useTabBar () {
  const { tabBarList, setTabBarList, setTabBarId, tabBarId } = useContext(context)
  // 增加tabBar
  const addTabBar = useCallback((tabBar: ITabBarCommon) => {
    const index = tabBarList.findIndex(item => item.value === tabBar.value)
    if (index === -1) {
      setTabBarList([...tabBarList, tabBar])
      setTabBarId(tabBar.value)
    }
  },
  [tabBarList, setTabBarList]
  )

  // 删除tabBar
  const deleteTabBar = (tabBar: number) => {
    // 删除目标在tabBarList中的位置
    const indexClick = tabBarList.findIndex(item => item.value === tabBar)
    // 已选定目标在tabBarList中的位置
    const index = tabBarList.findIndex(item => item.value === tabBarId)
    if (indexClick !== -1) {
      const newList = tabBarList.filter(item => item.value !== tabBar)
      if (indexClick === (tabBarList.length - 1) && index === indexClick) {
        setTabBarId(newList[newList.length - 1].value)
      } else if (index === indexClick) {
        setTabBarId(newList[index].value)
      }
      setTabBarList(newList)
    }
  }

  return {
    addTabBar,
    deleteTabBar
  }
}
