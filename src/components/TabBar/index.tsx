import React, { useContext, useState } from 'react'
import { context } from '../../hooks/store'
import style from './index.module.scss'
import deleteIcon from '../../assets/imgs/deleteIcon.svg'
import useTabBar from '../../hooks/useTabBar'

export default function TabBar () {
  const { tabBarList, tabBarId, setTabBarId } = useContext(context)
  const { deleteTabBar } = useTabBar()
  // 记录鼠标是否悬浮
  const [MouseEnter, setMouseEnter] = useState<number>()
  return (
    <div className={style.btnBack}>
      {
        tabBarList.map(item =>
          <div
            key={item.value}
            onMouseEnter={() => { setMouseEnter(item.value) }}
            onMouseLeave={() => { setMouseEnter(undefined) }}
            onClick={(e) => { e.stopPropagation(); setTabBarId(item.value) }}
            className={tabBarId === item.value ? style.button_click : style.button}
          >
            <span>{item.label}</span>
            {
              MouseEnter === item.value && MouseEnter !== 0
                ? <img
                  src={deleteIcon}
                  className={style.deleteIcon}
                  onClick={(e) => { e.stopPropagation(); deleteTabBar(item.value) }}
                ></img>
                : null
            }
          </div>
        )
      }
    </div>
  )
}
