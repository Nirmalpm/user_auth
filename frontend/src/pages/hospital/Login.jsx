import React, { useState } from 'react'
import { usePasStore } from '../../store/pasStore';
import { ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router';

const Login = () => {
  const[userId, setUserId] = useState("");
  const[password, setPassword] = useState("");
  const {login,isLoading} = usePasStore();
  const handleSubmit = async(e)=>{
    e.preventDefault();   
    const data = await login(userId,password);
     console.log(data);
  }
  return (
    <div className="flex flex-col min-h-screen w-full justify-center items-center gap-2">
      <h1 className="flex text-2xl font-bold h-10 w-md bg-blue-900 rounded text-center p-2 justify-center 
      items-center text-amber-500">Pro-Health Life Care Hospitals</h1>
      <form onSubmit={handleSubmit} className="flex flex-col h-[250px] w-md  bg-blue-800 text-gray-100  
      shadow-xl shadow-gray-500 rounded-2xl justify-center items-center gap-2">
        <input type="text" name="id" className="bg-gray-300 border-0 rounded text-gray-800 p-2" 
        placeholder='User Id' onChange={(e)=> setUserId(e.target.value)}/>
        <input type="password" name="id" className="bg-gray-300 border-0 rounded text-gray-800 p-2" 
        placeholder='Password'  onChange={(e)=> setPassword(e.target.value)}/>
        <input type="submit" value="Login" className="w-50 bg-emerald-700 rounded
         hover:bg-amber-500 cursor-pointer hover:-translate-y-0.5 transition"/>
      </form>
      <NavLink to="/"  className="flex w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0 text-gray-100"><span><ArrowLeft size={25} /> Back</span></NavLink>
    </div>
  )
}

export default Login
