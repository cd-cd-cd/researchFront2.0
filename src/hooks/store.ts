import { createContext } from 'react'
import { type ITeamWork, type ITabBarCommon } from '../libs/model'

interface StoreContext {
// tabBar
  tabBarList: ITabBarCommon[]
  setTabBarList: (tabBar: ITabBarCommon[]) => void

  // tabBarId
  tabBarId: number
  setTabBarId: (id: number) => void
}

const context = createContext<StoreContext>({
  tabBarList: [],
  setTabBarList: () => {},
  tabBarId: -1,
  setTabBarId: () => {}
})

const StoreProvider = context.Provider

export { context, StoreProvider }
