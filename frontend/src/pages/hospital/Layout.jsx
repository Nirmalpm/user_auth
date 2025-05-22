import { Outlet } from 'react-router'
import Footer from './Footer'
import NavBar from './NavBar'

const Layout = () => {
  return (
    <div className="flex flex-col justify-center  items-center ">
      <NavBar/>
      <div className="text-2xl font-extrabold text-amber-500 bg-blue-900 text-center flex fixed top-15 p-3 rounded shrink-0">Pro-Health Life Care Hospitals</div>
        <div className="flex fixed top-24 m-5  left-0 right-0 bottom-0 flex-wrap ">
            <div className="flex flex-grow w-full ">             

                {/* Content Outlet */}
                 <Outlet />

            </div>
        </div>      
      <Footer/>
    </div>
  )
}

export default Layout
