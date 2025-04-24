import { Outlet } from "react-router"
import FloatingShape from "./components/FloatingShape"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import bgImage from './assets/images/bg-1.webp';

function App() {

  const backgroundStyle = {
    backgroundImage:  `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "100vh",
    margin: 0,
  };

  const {isCheckingAuth, checkAuth} =  useAuthStore();
  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

 if(isCheckingAuth) return <LoadingSpinner/>;

  return (
    <div  className="min-h-screen bg-gradient-to-br from-gray-100 to-emerald-900  
    flex items-center justify-center relative overflow-hidden font-sans" >
      {/* <FloatingShape color="bg-blue-700" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-red-300" size="w-48 h-48" top="70%" left="80%" delay={5} />   
      <FloatingShape color="bg-gray-300" size="w-30 h-20" top="10%" left="50%" delay={5} />       */}
      <Outlet/>
      <Toaster/>
    </div>
  )
}

export default App
