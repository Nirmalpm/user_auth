import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion';
import toast from "react-hot-toast";

const UserRoles = () => {
  const {user, appUsers,getUsersByRole,updateUserRole,removeUserRole }= useAuthStore();
  const allRoles = ["user","admin","moderator","spiritual"];
  const [checked, setChecked] = useState(false);
  //console.log(user, appUsers);

  useEffect(()=>{
    const getusers = async ()=>{
      await getUsersByRole();      
    }
    getusers();
    //console.log(appUsers)
  },[getUsersByRole]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className=' w-full mx-auto mt-10 p-8 bg-blue-900 bg-opacity-80 backdrop-filter 
      backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 min-w-sm justify-center items-center '
      >
        <div className="flex justify-center items-center text-white font-bold w-full">USER ROLES</div>
        <div className="flex gap-3 justify-items-start text-red-500 font-bold ">
            <div className="w-1/3 flex flex-wrap">Name</div>
            <div className="w-1/3 flex flex-wrap">Email</div>
            <div className="w-1/3 flex flex-wrap">Roles</div>
            </div>
        {
          appUsers && appUsers.map((user,ind)=>(
            <div className="flex gap-3 justify-items-start text-white p-2" key={ind}>
            <div className="w-full flex flex-wrap">{user.name}</div>
            <div className="w-full flex flex-wrap">{user.email}</div>
            <div className="w-full flex flex-wrap  gap-1">
            {allRoles.map((role) => {
              const hasRole = user.roles.includes(role);
              return (
                <div key={role} >
                  <span>{role + ":"}</span>
                  <input
                    type="checkbox"
                    checked={hasRole}
                    onChange={() => {
                      if (hasRole) {
                        removeUserRole(user._id, role);
                        toast.error(`Role ${role} removed from user ${user.name}`);
                      } else {
                        updateUserRole(user._id, role);
                        toast.success(`Role ${role} added to user ${user.name}`);
                      }
                    }}
                  />
                </div>
              );
            })}
            </div>
            </div>
          ))
        }

      </motion.div>
  )
}

export default UserRoles
