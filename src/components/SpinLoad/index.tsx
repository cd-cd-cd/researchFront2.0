import React from 'react'
import style from './index.module.scss'
import { Spin } from 'antd'
export default function SpinLoad () {
  return (
    <div className={style.mask}><Spin spinning={false}/> </div>
  )
}
