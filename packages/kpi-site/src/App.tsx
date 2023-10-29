/* eslint-disable no-param-reassign */
import { Children, forwardRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { CSSTransition, GroupTransition, SwitchTransition } from './transition'
import './style.css'

const Red = forwardRef((props: any, ref: any) => {
  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 400,
        borderRadius: '4px',
        backgroundColor: 'red',
      }}
    />
  )
})
const Blue = forwardRef((props: any, ref: any) => {
  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 400,
        borderRadius: '4px',
        backgroundColor: 'blue',
      }}
    />
  )
})

const idd = 3
export default function App() {
  const [when, setWhen] = useState(true)
  const [list, setList] = useState(() => [1, 2, 3])
  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => {
            setList(list.length === 3 ? [1, 5, 11, 4, 2, 3, 8, 9, 7, 6, 12, 10] : [1, 2, 3])
          }}
        >
          change
        </button>
        <button
          type="button"
          onClick={() => {
            setList((p) => [...p, Math.round(Math.random() * 100000)])
          }}
        >
          push
        </button>
        <button
          type="button"
          onClick={() => {
            setList((p) => {
              const a = p.concat()
              a.pop()
              return a
            })
          }}
        >
          pop
        </button>
        <button
          type="button"
          onClick={() => {
            setWhen((p) => !p)
          }}
        >
          force update
        </button>
        {/* <button
          type="button"
          onClick={() => {
            const list2 = list.concat()
            const idx = Math.round(Math.random() * list2.length)
            list2.splice(idx, 0, ++idd)
            setList(list2)
          }}
        >
          insert
        </button>
        <button
          type="button"
          onClick={() => {
            const list2 = list.concat()
            const idx = Math.round(Math.random() * list2.length)
            list2.splice(idx, 1)
            setList(list2)
          }}
        >
          remove
        </button>
        <button
          type="button"
          onClick={() => {
            const list2 = list.concat().sort(() => (Math.random() > 0.5 ? 1 : -1))
            setList(list2)
          }}
        >
          shuffle
        </button> */}
      </div>

      {/* 列表 */}
      <ul>
        <GroupTransition name="fade">
          {list.map((id) => (
            <div key={id} className="a">
              {id}
            </div>
          ))}
        </GroupTransition>
      </ul>
    </div>
  )
}
