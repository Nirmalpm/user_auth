import React from 'react'
import { useAuthStore } from '../store/authStore'
import { Navigate } from 'react-router';

export const RedirectAuthenticatedUser = ({children}) => {
    const {isAuthenticated,user} = useAuthStore();
    if(isAuthenticated){
        return <Navigate to="/" replace />
    }
  return children;
}

export const ProtectedRoute = ({children}) => {
    const {isAuthenticated, user} = useAuthStore();
    ////console.log(isAuthenticated, user)
    if(!isAuthenticated ){
        return <Navigate to="/login" replace />
    }
    if(!user.isVerified){
        return <Navigate to="/verify-email" replace />
    }
  return children;
}
