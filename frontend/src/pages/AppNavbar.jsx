import React, { useState } from 'react'
import logo from '../assets/images/logo-blue.png'
import { NavLink } from 'react-router'
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import '../pages/css/pages.css'

const AppNavbar = () => {
    const activeDropdown = 'active text-red-800 font-bold pt-4 nav-link';
    const active = 'active text-red-800 font-bold pt-4 ';
    const notActive = 'active text-gray-300 font-semibold pt-4 ';

    const [isMobileMenu, setIsMobileMenu] = useState(false);

    const {logout, user } = useAuthStore();
    const {reset} = useUserStore();	
    const {roles} = user;
    console.log(roles)
    const handleLogout = () => {
		reset();
		logout();
	};

  return (
    <nav className="fixed w-full top-0 z-40 ">
        <div className='flex justify-between items-center bg-sky-950 h-20 px-4  ' >
            <NavLink to="/" className="text-gray-200 font-semibold text-right ">                    
                <img src={logo} className="h-20 rounded opacity-100"/>
            </NavLink>
            <div className="w-7 h-5 relative cursor-pointer z-40 md:hidden  text-amber-50" onClick={()=>setIsMobileMenu(true)}>
                &#9776;
            </div>
            <div className="hidden md:flex items-end justify-center space-x-8  w-full">
                <NavLink to="/"  className={({ isActive }) => (isActive ? `${active}` : `${notActive}`)}>Dashboard</NavLink>
                <div className="dropdown">
                    <NavLink to="/test"  className={({ isActive }) => (isActive ? `${activeDropdown}` : `${notActive}`)}>Applications</NavLink>
                    <div className="dropdown-menu">
                        <NavLink to="/portfolio">Portfolio Builder</NavLink>
                        <NavLink to="/test">Mobile Development</NavLink>
                        <NavLink to="/test">UI/UX Design</NavLink>
                        <NavLink to="/blogs">Blogs</NavLink>
                        {
                            roles.includes("admin") ?<NavLink to="/admin">Admin screen</NavLink> :null
                        }
                    </div>
                </div>                 
            </div> 
            <div className={`fixed top-0 left-0 w-full bg-[rgba(10,10,10,0.8)] z-40 flex flex-col items-center justify-center 
                    transition-all duration-300 ease-in-out
                    ${isMobileMenu ? "h-screen opacity-100 pointer-events-auto":"h-0 opacity-0 pointer-events-none"}
                    `}>
                        <button onClick={()=> setIsMobileMenu(false)}
                            className="absolute top-6 right-6 text-white text-3xl focus:outline-none cursor-pointer"
                            aria-label='Close Menu'>
                            &times;
                        </button>
                        <NavLink to="/portfolio" className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                            ${isMobileMenu? "opacity-100 translate-y-0": "opacity-0 translate-y-5"}`} >Portfolio Builder</NavLink>
                        <NavLink to="/test" className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                            ${isMobileMenu? "opacity-100 translate-y-0": "opacity-0 translate-y-5"}`} onClick={()=>setIsMobileMenu(false)}>Mobile Development</NavLink>
                        <NavLink to="/test" className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                            ${isMobileMenu? "opacity-100 translate-y-0": "opacity-0 translate-y-5"}`} onClick={()=>setIsMobileMenu(false)}>UI/UX Design</NavLink>
                        <NavLink to="/blogs" className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                            ${isMobileMenu? "opacity-100 translate-y-0": "opacity-0 translate-y-5"}`} onClick={()=>setIsMobileMenu(false)}>Blogs</NavLink>
                        {
                            roles.includes("admin") ?<NavLink to="/admin"  className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                                ${isMobileMenu? "opacity-100 translate-y-0": "opacity-0 translate-y-5"}`} onClick={()=>setIsMobileMenu(false)}>Admin screen</NavLink> :null
                        }
                        <NavLink to="../" className="text-gray-300 hover:text-white transition-colors" onClick={handleLogout} >
                            {`Logout`}
                        </NavLink>  
                        
            </div>
            <NavLink to="../" className="text-gray-300 hover:text-white transition-colors" onClick={handleLogout} >
                {`Logout`}
            </NavLink>               
        </div>
    </nav>
  )
}

export default AppNavbar
