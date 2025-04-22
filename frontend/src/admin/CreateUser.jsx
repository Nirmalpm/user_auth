import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion';
import toast from "react-hot-toast";
import Input from '../components/Input';
import { Icon, Mail, Phone, Text } from 'lucide-react';

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(()=>{
    
  },[]);

  const {addUser}= useAuthStore();

  const handleReset = () =>{
    setError("");setName("");setEmail("");setPassword("");setCpassword("");setPhoneNumber("");
  }

  const handleAddUser = async(e) =>{
    e.preventDefault(); 
    console.log(password,cpassword)
    if(password === cpassword){
        await addUser(name,email,password,phoneNumber);
        handleReset();
    }else{
        setError("Password not matching");
    }
    
  }
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className=' w-full mx-auto mt-10 p-8 bg-blue-900 bg-opacity-80 backdrop-filter 
      backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 min-w-sm justify-center items-center '
      >
        <div className="flex justify-center items-center text-white font-bold w-full">CREATE USER</div>
        <div className="flex items-center justify-center   flex-col"> 
       <form onSubmit={handleAddUser}>
        <Input
            icon={Text}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
           
        <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
        <Input
            icon={Text}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
            {error ? <span className='text-red-500'>{error}</span>: null} 
        <Input
            icon={Text}
            type="password"
            placeholder="Confirm Password"
            value={cpassword}
            onChange={(e)=> setCpassword(e.target.value)}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
           
        <Input
            icon={Phone}
            type="number"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e)=> setPhoneNumber(e.target.value)}
            style={{width:'350px'}}
            />
        <div className="gap-3 flex justify-center ">
          <motion.button
          className="mt-5 w-1/3 py-3 px-4 bg-gradient-to-r from-blue-800 to-red-800 text-white font-bold 
          rounded-lg shadow-lg hover:from-blue-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-green-500 
          focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer"
          whileHover={{scale:1.02}}
          whileTap={{scale:0.98}}
          type="submit"
          >Save</motion.button> 
          <motion.button
          className="mt-5 w-1/3 py-3 px-4 bg-gradient-to-r from-blue-800 to-red-800 text-white font-bold 
          rounded-lg shadow-lg hover:from-blue-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-green-500 
          focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer"
          whileHover={{scale:1.02}}
          whileTap={{scale:0.98}}
          type="button"
          onClick={handleReset}
          >Reset</motion.button> 
        </div>
         
    </form>  

    </div>
    </motion.div>
      
  )
}

export default CreateUser
