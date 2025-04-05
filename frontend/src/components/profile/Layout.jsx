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

import { useState } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import Home from "./sections/Home";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

import LoadingScreen from "../LoadingScreen";

function Layout() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      {""}
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
  );
}

export default Layout;
