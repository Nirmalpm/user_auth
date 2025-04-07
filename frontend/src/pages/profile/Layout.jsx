// import React, { useEffect, useState } from 'react'
// import { NavLink, Outlet } from 'react-router';

// interface LayoutProps {
//     isMenuOpen: boolean;
//     setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   }

// const Layout: React.FC<LayoutProps> = ({isMenuOpen, setIsMenuOpen}) => {
//     useEffect(()=>{
//         document.body.style.overflow = isMenuOpen ? "hidden" :""
//       },[isMenuOpen]);

//   return (
//     <>
//     <nav className="fixed top-5 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-g border-b border-white/10 shadow-lg">
//         <NavLink to="" className="mono text-xl font-bold text-white ml-5">
//             <span className="text-blue-500">{`<< Back`}</span>
//         </NavLink>
//         <div className="max-w-5xl mx-auto px-4">
//             {/* Burger menu - 4Mobile */}
//             <div className='flex justify-between items-center h-16' >
//                 <NavLink to="profile/home" className="mono text-xl font-bold text-white ">
//                     Nirmal<span className="text-blue-500">Z</span>
//                 </NavLink>
//                 <div className="w-7 h-5 relative cursor-pointer z-40 md:hidden" onClick={()=>setIsMenuOpen((prev) => !prev)}>
//                     &#9776;
//                 </div>
//                 <div className="hidden md:flex items-center space-x-8">
//                     <NavLink to="profile/home" className="text-gray-300 hover:text-white transition-colors">Home</NavLink>
//                     <NavLink to="profile/about" className="text-gray-300 hover:text-white transition-colors">About</NavLink>
//                     <NavLink to="profile/projects" className="text-gray-300 hover:text-white transition-colors">Projects</NavLink>
//                     <NavLink to="profile/contact" className="text-gray-300 hover:text-white transition-colors">Contact</NavLink>
//                 </div>
//             </div>
//         </div>
//     </nav>
//     <div className={`min-h-screen transition-opacity duration-700  bg-black text-gray-100`} >
//     <Outlet/>
//     </div>
//     </>

//   )
// }

// export default Layout
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Home from "./sections/Home";
import Projects from "./sections/Projects";

import LoadingScreen from "../../components/LoadingScreen";

import { NavLink } from "react-router";
import { isUserProfilePresent } from "../../apis/user.api";
import { useAuthStore } from '../../store/authStore';

function Layout() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileSet, setIsProfileSet] = useState(false);

  const {user} =  useAuthStore();
  useEffect(()=>{
    const fetchData = async ()=>{
      const data = await isUserProfilePresent(user._id);
      const {count} = data;
      console.log(count)
      setIsProfileSet((prev)=> count > 0);
    }
    fetchData();  
  },[]);

  const comp = () => {
    return (
      <>      
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      <div
        className={`min-h-screen transition-opacity duration-700 w-full ${
          isLoaded ? "opacity-100" : "opacity-0"
        } bg-black`}
      >
         <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
        
        <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
     
        <Home/>
        <About/>
        <Projects/>
        <Contact/>
      </div>
    </>
    )
  }
  return (
    <>
    {isProfileSet ? comp() : 
    <div className="text-amber-300 text-2xl font-bold flex items-center flex-col">
       <p>Please set up your portfolio  </p>
       <motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className='mt-4 flex flex-col gap-2'
			>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={()=>{}}
					className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Setup Portfolio
				</motion.button>
				<NavLink to="/" className="text-gray-200 font-semibold pt-4 text-right">{`back `}</NavLink>
      
			</motion.div>
       </div>
    }
    </>
  )
}

export default Layout;
