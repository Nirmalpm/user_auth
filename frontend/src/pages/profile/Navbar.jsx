import React, { useEffect } from 'react'
import { NavLink } from 'react-router';


const Navbar = ({isMenuOpen, setIsMenuOpen}) => {
    
    useEffect(()=>{
        document.body.style.overflow = isMenuOpen ? "hidden" :""
      },[isMenuOpen]);

  return (
    <nav className="fixed w-full border-b border-red-800 top-0 z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-g border-b  shadow-lg">
        <div className="w-full px-4">
            {/* Burger menu - 4Mobile */}
            <div className='flex justify-between items-center h-16 ' >
                <a href="#home" className="mono text-xl font-bold text-white ">
                    Nirmal<span className="text-blue-500">Z</span>
                </a>
                <div className="w-7 h-5 relative cursor-pointer z-40 md:hidden" onClick={()=>setIsMenuOpen((prev) => !prev)}>
                    &#9776;
                </div>
                <div className="hidden md:flex items-center space-x-8 justify-end">
                    <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
                    <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
                    <a href="#projects" className="text-gray-300 hover:text-white transition-colors">Projects</a>
                    <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    <NavLink to="../" className="text-gray-300 hover:text-white transition-colors">
                       {`<< Go back`}
                    </NavLink>
                </div>
            </div>

        </div>
        
    </nav>
  )
}

export default Navbar
