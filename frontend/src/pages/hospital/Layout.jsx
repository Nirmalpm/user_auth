import { Outlet } from 'react-router'
import Footer from './Footer'
import NavBar from './NavBar'
import { useEffect } from 'react';

const Layout = () => { 
   useEffect(()=>{
           console.log("Inside Hospital Layout useEffect")
        });
  return (
    <div className="flex flex-col justify-start  items-center w-full overflow-y-auto min-h-screen bg-[url('/assets/hospital.png')] bg-cover bg-center">
      <NavBar/>
      
        <div className="flex flex-wrap justify-center">
                 

                {/* Content Outlet */}
                 <Outlet />
        </div>      
      <Footer/>
    </div>
  )
}

export default Layout
