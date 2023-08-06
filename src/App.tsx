import React from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='*' element={<Navigate to='/login' />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
