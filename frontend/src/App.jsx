import { Outlet, useLocation } from "react-router"
import FloatingShape from "./components/FloatingShape"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import bgImage from './assets/images/bg-1.webp';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

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
    //console.log('Environment:', import.meta.env.MODE);
    checkAuth()
  },[checkAuth]);

    const location = useLocation();
    useEffect(() => {
        //console.log('User accessed page:', location.pathname);
        fetch(`${API_URL}/track-visit?page=${location.pathname}`, {
          method: 'GET',
          credentials: 'include' // this sends cookies!
        });
    }, [location]);


 if(isCheckingAuth) return <LoadingSpinner/>;

  return (
    <div  className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-900  
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
