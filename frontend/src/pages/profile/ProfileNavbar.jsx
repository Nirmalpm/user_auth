import React, { useEffect } from 'react'
import { NavLink } from 'react-router';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import logo from '../../assets/images/logo-blue.png'


const Navbar = ({isMenuOpen, setIsMenuOpen}) => {
    const { user, logout } = useAuthStore();
    const {reset} = useUserStore();	

    useEffect(()=>{
        document.body.style.overflow = isMenuOpen ? "hidden" :""
      },[isMenuOpen]);

      const handleLogout = () => {
		reset();
		logout();
	};

  return (
    <nav className="fixed w-full  top-0 z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-g border-b  shadow-lg">
        <div className="w-full px-4  bg-sky-950 h-20">
            {/* Burger menu - 4Mobile */}
            <div className='flex justify-between items-center h-16 ' >
                <NavLink to="/" className="mono text-xl font-bold">                    
                    <img src={logo} className="h-20 rounded "/>
                </NavLink>
                <div className="w-7 h-5 relative cursor-pointer z-40 md:hidden  text-amber-50" onClick={()=>setIsMenuOpen((prev) => !prev)}>
                    &#9776;
                </div>
                <div className="hidden md:flex items-center space-x-8 justify-end">
                    <a href="#home" className="text-gray-300 hover:text-white transition-colors">Introductions</a>
                    <a href="#about" className="text-gray-300 hover:text-white transition-colors">Tech. Skills</a>
                    <a href="#projects" className="text-gray-300 hover:text-white transition-colors">Projects</a>
                    <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                    <NavLink to="../" className="text-gray-300 hover:text-white transition-colors" onClick={handleLogout} >
                       {`Logout`}
                    </NavLink>
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
