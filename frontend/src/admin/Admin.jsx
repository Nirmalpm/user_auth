import React from 'react';
import UserRoles from './UserRoles';
import CreateUser from './CreateUser';
import AccessLogs from './AccessLogs';
import TextToJsonConverter from '../utils/textToJsonConverter';

const UserAdmin = () => {
  
  return (
    <div className="max-w-7xl w-full flex h-auto items-center justify-center flex-wrap mt-30">
      <h2 className="text-blue-600 font-extrabold ">ADMIN SCREEN</h2>
      <TextToJsonConverter/>
      <CreateUser/>
      <UserRoles/>
      <AccessLogs/>
      
    </div>
  )
}

export default UserAdmin
