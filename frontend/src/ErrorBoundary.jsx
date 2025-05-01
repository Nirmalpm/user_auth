import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  // Error handler for functional components
  useEffect(() => {
    const handleError = (event) => {
      setHasError(true);
      setError(event.error);
      setErrorInfo(event.errorInfo);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    // You can customize this UI based on the error
    return (
    <div className="flex flex-col w-full  bg-blue-800 min-h-screen justify-center items-center gap-3">
      <h1 className="text-5xl text-white font-red">Oops!! Something went wrong.</h1>    
      <h2 className="text-2xl"> Please try again later or contact 
        <NavLink to="/admin-contact" ><span className="underline cursor-pointer ml-2">admin</span></NavLink>
      </h2>  
    </div>  
    )
  }

  return children;
};

export default ErrorBoundary;
