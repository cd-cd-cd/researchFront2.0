import { createContext } from 'react'
import { type ITabBarCommon } from '../libs/model'

interface StoreContext {
// tabBar
  tabBarList: ITabBarCommon[]
  setTabBarList: (tabBar: ITabBarCommon[]) => void

  // tabBarId
  tabBarId: number
  setTabBarId: (id: number) => void

  // report: IPart[]
  // setReport: (report: IPart[]) => void
}

const context = createContext<StoreContext>({
  tabBarList: [],
  setTabBarList: () => {},
  tabBarId: -1,
  setTabBarId: () => {}
  // report: [],
  // setReport: () => {}
})

const StoreProvider = context.Provider

export { context, StoreProvider }
