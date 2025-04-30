import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import Navbar from "./ProfileNavbar";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Home from "./sections/Home";
import Projects from "./sections/Projects";

import LoadingScreen from "../../components/LoadingScreen";

import { NavLink } from "react-router";
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from "../../store/userStore";

import { pdf } from '@react-pdf/renderer';
import ProfilePDF from '../../components/ProfilePDF';
import { isMobile } from 'react-device-detect';

import { Download } from 'lucide-react';



function Layout() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {user} =  useAuthStore();
  const {userProfile, loadUserProfile} = useUserStore();

  const refreshData = async ()=>{
    const userProfile = await loadUserProfile(user);
    console.log(userProfile);
  }

  useEffect(()=>{    
    refreshData();  
  },[]);

  const handleMobileDownload = async () => {
    const blob = await pdf(<ProfilePDF />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const comp = () => {
    return (
      <>      
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      <div
        className={`min-h-screen transition-opacity duration-700 w-full flex flex-col items-center ${
          isLoaded ? "opacity-100" : "opacity-0"
        } bg-black`}
      >
         <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
        
        <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
     
        <Home/>
        <About/>
        <Projects/>
        <Contact/>
         <div className="flex fixed bottom-4 right-4 flex-col items-center    ">
        {/* <PDFDownloadLink
          document={<ProfilePDF items={[]} />}
          fileName={`${user?.name}.pdf`}
          >
          {({ loading }) =>
            loading ? "Loading PDF..." : 
            <button className="flex bg-blue-500 text-white font-light rounded-lg 
            shadow-md  cursor-pointer hover:-translate-y-0.5 transition h-10 hover:bg-blue-300 p-2">Download your Resume 
            <Download className="h-6 w-6 text-white-700" />
            </button>
          }
        </PDFDownloadLink> */}
         {
          isMobile ? (
            <button className="flex bg-blue-500 text-white font-light rounded-lg 
            shadow-md  cursor-pointer hover:-translate-y-0.5 transition h-10 hover:bg-blue-300 p-2"
             onClick={handleMobileDownload}>Download/View PDF</button>)
            :(
              <NavLink to="/viewresume" className="text-white font-bold">PDF View</NavLink>
            )
        }			
        
      </div>
      </div>
    </>
    )
  }
  return (
    <>
    {true ? comp() : 
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
