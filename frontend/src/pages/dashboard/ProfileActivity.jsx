import { motion } from "framer-motion";
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import {formatDate} from '../../utils/date.js'

const ProfileActivity = () => {
    const { user, logout } = useAuthStore();
    const {reset,getFreeNews} = useUserStore();	
  
    return (
    <div>
      <motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full mx-auto mt-10 p-8 bg-blue-900 bg-opacity-80 backdrop-filter 
      backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 min-w-sm h-20%'
		>
			<h2 className='text-3xl font-bold mb-6 text-center bg-gray-300 text-transparent bg-clip-text'>
				Activity
			</h2>

			<div className='space-y-2'>
				<motion.div
					className='p-4 bg-gray-500 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className='text-xl font-semibold text-blue-900 mb-3 '>Profile Information</h3>
					<p className='text-green-300'>Name: {user.name}</p>
					<p className='text-green-300 truncate w-64 flex'>Email: {user.email}</p>
				</motion.div>
				<motion.div
					className='p-4 bg-gray-500 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-xl font-semibold text-blue-900 mb-3'>Account Activity</h3>
					<p className='text-green-300'>
						<span className='font-bold'>Joined: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className='text-green-300'>
						<span className='font-bold'>Last Login: </span>

						{formatDate(user.lastLogin)}
					</p>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className='mt-4 flex flex-col gap-2'
			>
				{/* <motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					//onClick={handleLogout}
					onClick={checkApi}
					className='w-full py-3 px-4 bg-gradient-to-r from-blue-800 to-red-800 text-white 
				font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-red-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Logout
				</motion.button>				 */}
			</motion.div>
		</motion.div>
    </div>
  )
}

export default ProfileActivity
