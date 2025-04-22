import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';


const MobileMenu = ({isMenuOpen, setIsMenuOpen}) => {
   
    const { user, logout } = useAuthStore();
    const {reset} = useUserStore();	
   
    const handleLogout = () => {
		reset();
		logout();
	};

  return (
   <div className={`fixed top-0 left-0 w-full bg-[rgba(10,10,10,0.8)] z-40 flex flex-col items-center justify-center 
                    transition-all duration-300 ease-in-out
                    ${isMenuOpen ? "h-screen opacity-100 pointer-events-auto":"h-0 opacity-0 pointer-events-none"}
                    `}>
                        <button onClick={()=> setIsMenuOpen(false)}
                            className="absolute top-6 right-6 text-white text-3xl focus:outline-none cursor-pointer"
                            aria-label='Close Menu'>
                            &times;
                        </button>
                        <a href="#home" className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                            ${isMenuOpen? "opacity-100 translate-y-0": "opacity-0 translate-y-5"}`} onClick={()=> setIsMenuOpen(false)}>Home</a>
                        <a href="#about" className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                            ${isMenuOpen? "opacity-100 translate-y-0": "opacity-0 translate-y-5"}`} onClick={()=> setIsMenuOpen(false)}> About</a>
                        <a href="#projects" className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                            ${isMenuOpen? "opacity-100 translate-y-0": "opacity-0 translate-y-5"}`} onClick={()=> setIsMenuOpen(false)}>Projects</a>
                        <a href="#contact" className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                            ${isMenuOpen? "opacity-100 translate-y-0": "opacity-0 translate-y-5"}`} onClick={()=> setIsMenuOpen(false)}>Contact</a>
                        <a href="#" onClick={handleLogout} className="text-2xl font-semibold text-white">Logout</a>
    </div>
  );
}

export default MobileMenu
