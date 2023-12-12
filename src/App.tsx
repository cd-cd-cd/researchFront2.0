import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import MInfo from './pages/ManagerMain/MInfo'
import { type IWeeklyReports, type ITabBarCommon } from './libs/model'
import { StoreProvider } from './hooks/store'
import Register from './pages/Register'
import TeamManage from './pages/ManagerMain/TeamManage'
import GroupManage from './pages/LeaderMain/GroupManage'
import MDevice from './pages/ManagerMain/MDevice'
import MemberDevice from './pages/MemberMain/MemberDevice'
import MemberWeekReport from './pages/MemberMain/MemberWeekReport'
import LDevice from './pages/LeaderMain/LDevice'
import MemberHistoryReport from './pages/MemberMain/MemberHistoryReport'
import MSBReport from './pages/ManagerMain/MSBReport'
import MAllReport from './pages/ManagerMain/MAllReport'
import LeaderHistoryReport from './pages/LeaderMain/LeaderHistoryReport'
import LSBReport from './pages/LeaderMain/LSBReport'
import Team from './pages/ManagerMain/Team'
import MNewMembers from './pages/ManagerMain/MNewMembers'
import DataBackup from './pages/ManagerMain/DataBackup'
import NewMDevice from './pages/ManagerMain/NewMDevice'

function App() {
  const [tabBarList, setTabBarList] = useState<ITabBarCommon[]>([])
  const [tabBarId, setTabBarId] = useState(-1)
  const [editRecord, setEditRecord] = useState<IWeeklyReports | null>(null)
  return (
    <StoreProvider
      value={{
        tabBarList,
        setTabBarList,
        tabBarId,
        setTabBarId,
        editRecord,
        setEditRecord
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="member" element={<Home />}>
            <Route path="personInfo" element={<MInfo />}></Route>
            {/* <Route path="memberDevice" element={<MemberDevice />}></Route> */}
            <Route
              path="MemberWeekReport"
              element={<MemberWeekReport />}
            ></Route>
            <Route
              path="MemberHistoryReport"
              element={<MemberHistoryReport />}
            ></Route>
          </Route>
          <Route path="leader" element={<Home />}>
            <Route path="personInfo" element={<MInfo />}></Route>
            <Route path="groupManage" element={<GroupManage />}></Route>
            {/* <Route path="ldevice" element={<LDevice />}></Route> */}
            <Route
              path="LeaderWeekReport"
              element={<MemberWeekReport />}
            ></Route>
            <Route
              path="LeaderHistoryReport"
              element={<LeaderHistoryReport />}
            ></Route>
            <Route path="LSBReport" element={<LSBReport />}></Route>
            {/* <Route path="LAllReport" element={<MAllReport />}></Route> */}
          </Route>
          <Route path="manager" element={<Home />}>
            <Route path="MInfo" element={<MInfo />}></Route>
            <Route path="MNewMembers" element={<MNewMembers />}></Route>
            {/* <Route path="TeamManage" element={<TeamManage />}></Route> */}
            <Route path="Team" element={<Team />}></Route>
            <Route path="NewMDevice" element={<NewMDevice />}></Route>
            {/* <Route path="MDevice" element={<MDevice />}></Route> */}
            <Route path="MSBReport" element={<MSBReport />}></Route>
            <Route path="MAllReport" element={<MAllReport />}></Route>
            <Route path="DataBackup" element={<DataBackup />}></Route>
          </Route>
          <Route path="register" element={<Register />}></Route>
          <Route path="*" element={<Navigate to="/login" />}></Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
