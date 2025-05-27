import { Outlet } from 'react-router'
import Footer from './Footer'
import NavBar from './NavBar'
import { useEffect } from 'react';

const Layout = () => { 
   useEffect(()=>{
           console.log("Inside Hospital Layout useEffect")
        });
  return (
    <div className="flex flex-col justify-start  items-center w-full overflow-y-auto">
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
