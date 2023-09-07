import React from 'react'
import ReactDOM from 'react-dom/client'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import './index.css'
import App from './App'
import { ConfigProvider } from 'antd'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <ConfigProvider locale={zh_CN}>
    <App />
  </ConfigProvider>
)
