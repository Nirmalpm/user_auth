import React from 'react';
import UserRoles from './UserRoles';
import CreateUser from './CreateUser';

const UserAdmin = () => {
  
  return (
    <div className="max-w-3xl w-full flex h-auto items-center justify-center flex-col mt-10">
      <h2 className="text-blue-600 font-extrabold ">ADMIN SCREEN</h2>
      <CreateUser/>
      <UserRoles/>
    </div>
  )
}

export default UserAdmin
