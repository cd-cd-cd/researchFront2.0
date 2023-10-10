import React from 'react'
import ReactDOM from 'react-dom/client'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import './index.css'
import App from './App'
import { ConfigProvider } from 'antd'
import moment from 'moment'

moment.locale('zh-cn')

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
)
