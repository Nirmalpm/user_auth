import React from 'react'
import Department from './forms/Department'
import Doctor from './forms/Doctor'

const Admin = () => {
  return (
    <div className="flex justify-center items-start gap-2">
      <Department/>
      <Doctor/>
    </div>
  )
}

export default Admin
