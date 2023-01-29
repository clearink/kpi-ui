/* eslint-disable import/no-extraneous-dependencies */
import { Outlet } from 'react-router-dom'

export default function BlankLayout() {
  return (
    <div className="wrapper">
      <Outlet />
    </div>
  )
}
