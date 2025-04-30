import React, { useState } from 'react';
import {motion} from 'framer-motion'
import Input from '../components/Input';
import {Mail, User, LockIcon, Loader, Phone} from 'lucide-react';
import {Link, useNavigate} from 'react-router'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { useAuthStore } from '../store/authStore';

const SignUpPage = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const {signup, error, isLoading} = useAuthStore();
    const navigate = useNavigate();

    const handleSignUp = async (e)=>{
        e.preventDefault();
        try {
          await signup(email,password,name,phoneNumber);
          navigate("/verify-email");
        } catch (error) {
          console.log(error);
        }
    }

  return (
    <motion.div
    initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5}}
    className='max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-center  bg-blue-800 text-transparent bg-clip-text">Create Account</h1>
        <form onSubmit={handleSignUp}>
            <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            style={{backgroundColor:"#fff",color:'#000'}}
            />
            <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            style={{backgroundColor:"#fff",color:'#000'}}
            />
            <Input
            icon={Phone}
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e)=> setPhoneNumber(e.target.value)}
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
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
            {/*Password strength meter */ }
            <PasswordStrengthMeter password={password}/>
            <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r bg-blue-800 text-white font-bold 
            rounded-lg shadow-lg hover:from-blue-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-green-500 
            focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{scale:1.02}}
            whileTap={{scale:0.98}}
            type="submit"
            disabled={isLoading}
            >
                {isLoading ? <Loader className="animate-spin mx-auto" size={24}/>:"Sign Up"}
            </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-700 hover:underline">Login</Link>
        </p>
      </div>
      
    </motion.div>
  )
}

export default SignUpPage
