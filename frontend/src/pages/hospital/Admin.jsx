import React from 'react'
import Department from './forms/Department'
import Doctor from './forms/Doctor'

const Admin = () => {
  return (
    <div className="flex flex-wrap justify-center items-start gap-2 mt-5">
      <Department/>
      <Doctor/>
    </div>
  )
}

export default Admin
