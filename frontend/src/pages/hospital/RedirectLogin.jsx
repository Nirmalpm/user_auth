import React, { useEffect } from 'react'
import { usePasStore } from '../../store/pasStore'
import { Navigate } from 'react-router';
import { Loader } from 'lucide-react';

const RedirectLogin = ({children}) => {
  const {isAuthenticated} = usePasStore();  
  if(isAuthenticated){
    return <Navigate to="/hospital" replace/>
  }
  return children
}

export const PasProtectedRoute = ({children}) => {
    const {isCheckingAuth,checkAuth,isAuthenticated} = usePasStore();
    useEffect(()=>{
         checkAuth()
      },[checkAuth]);

    if(isCheckingAuth){ return <Loader size={50} className="animate-spin mx-auto"/>}
    if(!isAuthenticated ){
        return <Navigate to="/pas" replace />
    }
  return children;
}

export default RedirectLogin
