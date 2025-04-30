import React, { useState } from 'react'
import {color, motion} from 'framer-motion';
import {Mail, Loader, LockIcon} from 'lucide-react';
import Input from '../components/Input';
import { Link } from 'react-router';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  
  const {login, isLoading, error} = useAuthStore();

  const handleLogin = async (e) =>{
    e.preventDefault();
    await login(email,password);
  }
  return (
    <motion.div
    initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5}}
    className='max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
      <div className="p-8 ">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r bg-blue-800 text-transparent bg-clip-text" >
          Login</h2>
          <form
          onSubmit={handleLogin}
          >
            <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            style={{backgroundColor:"#fff",color:'#000'}}
            />
            <Input
            icon={LockIcon}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            style={{backgroundColor:"#fff",color:'#000'}}
            />
            <div className="flex items-center mb-6">
              <Link to="/forgot-password" className="text-md text-blue-900 hover:underline">Forgot password?</Link>
            </div>
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
             <motion.button
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r bg-blue-800  text-white font-bold 
              rounded-lg shadow-lg hover:from-blue-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-green-500 
              focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer"
              whileHover={{scale:1.02}}
              whileTap={{scale:0.98}}
              type="submit"
              disabled={isLoading}
              >
                  {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
              </motion.button>
          </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link to={"/signup"} className="text-blue-700 hover:underline">Sign Up</Link>
        </p>
      </div>
    </motion.div>
  )
}

export default LoginPage
