import React, { useState, useEffect } from 'react';

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
    return <h2>Something went wrong. Please try again later.</h2>;
  }

  return children;
};

export default ErrorBoundary;
