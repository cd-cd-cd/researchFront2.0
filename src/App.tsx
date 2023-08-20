import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import MInfo from './pages/ManagerMain/MInfo'
import Device from './components/CommonPage/Device'
import { type ITabBarCommon } from './libs/model'
import { StoreProvider } from './hooks/store'
import Register from './pages/Register'
import TeamManage from './pages/ManagerMain/TeamManage'
import GroupManage from './pages/LeaderMain/GroupManage'

function App() {
  const [tabBarList, setTabBarList] = useState<ITabBarCommon[]>([])
  const [tabBarId, setTabBarId] = useState(-1)
  return (
    <StoreProvider value={{
      tabBarList,
      setTabBarList,
      tabBarId,
      setTabBarId
    }}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path='member' element={<Home />}>
            <Route path='personInfo' element={<MInfo />}></Route>
            <Route path='device' element={<Device />}></Route>
          </Route>
          <Route path='leader' element={<Home />}>
            <Route path='personInfo' element={<MInfo />}></Route>
            <Route path='groupManage' element={<GroupManage/>}></Route>
            <Route path='device' element={<Device />}></Route>
          </Route>
          <Route path='manager' element={<Home />}>
            <Route path='MInfo' element={<MInfo />}></Route>
            <Route path='TeamManage' element={<TeamManage/>}></Route>
          </Route>
          <Route path='register' element={<Register/>}></Route>
          <Route path='*' element={<Navigate to='/login' />}></Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
