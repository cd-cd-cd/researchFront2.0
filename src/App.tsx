import React from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import LPersonalInfo from './pages/LeaderMain/LPersonalInfo'
import MPersonalInfo from './pages/MemberMain/MPersonalInfo'
import MInfo from './pages/ManagerMain/MInfo'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='member' element={<Home />}>
            <Route path='personInfo' element={<MPersonalInfo />}></Route>
          </Route>
          <Route path='leader' element={<Home />}>
          <Route path='personInfo' element={<LPersonalInfo />}></Route>
          </Route>
          <Route path='manager' element={<Home />}>
            <Route path='MInfo' element={<MInfo />}></Route>
          </Route>
        <Route path='*' element={<Navigate to='/login' />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
