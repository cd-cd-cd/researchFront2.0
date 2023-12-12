import { createContext } from 'react'
import { type ITeamWork, type ITabBarCommon, type IWeeklyReports } from '../libs/model'

interface StoreContext {
// tabBar
  tabBarList: ITabBarCommon[]
  setTabBarList: (tabBar: ITabBarCommon[]) => void

  // tabBarId
  tabBarId: number
  setTabBarId: (id: number) => void

  // 保存修改edit
  editRecord: IWeeklyReports | null
  setEditRecord: (record: IWeeklyReports | null) => void
}

const context = createContext<StoreContext>({
  tabBarList: [],
  setTabBarList: () => {},
  tabBarId: -1,
  setTabBarId: () => {},
  editRecord: null,
  setEditRecord: () => {}
})

const StoreProvider = context.Provider

export { context, StoreProvider }
