import React from 'react'
import { Outlet } from 'react-router'
import AppNavbar from './AppNavbar'

const AppLayout = () => {
  return (
    <div className="flex justify-center w-full items-center flex-wrap gap-2 ">
      <AppNavbar/>
      <Outlet/>
    </div>
  )
}

export default AppLayout
