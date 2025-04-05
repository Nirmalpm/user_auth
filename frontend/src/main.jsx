import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { createBrowserRouter, RouterProvider } from "react-router";
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EmailVerificationPage from './pages/EmailVerificationPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { ProtectedRoute, RedirectAuthenticatedUser } from './pages/RedirectAuthenticatedUser.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import Layout from './components/profile/Layout.jsx';


const router = createBrowserRouter([
  {
    path:"/",
    Component: App,
    children:[
      {
        index:true,
        Component:()=><ProtectedRoute> <DashboardPage/></ProtectedRoute>
      },
      {
        path: "login",
        Component: ()=><RedirectAuthenticatedUser><LoginPage/></RedirectAuthenticatedUser>
      },
      {
        path:"signup",
        Component: ()=><RedirectAuthenticatedUser><SignUpPage/></RedirectAuthenticatedUser>
      },
      {
        path:"verify-email",
        Component: EmailVerificationPage
      },
      {
        path:"forgot-password",
        Component: ()=><RedirectAuthenticatedUser><ForgotPasswordPage/></RedirectAuthenticatedUser>
      },
      {
        path:"password-reset/:token",
        Component: ()=><RedirectAuthenticatedUser><ResetPasswordPage/></RedirectAuthenticatedUser>
      },
      {
        path:"portfolio",
        Component: ()=><Layout/>
      }
    ]
  },
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>   
  </StrictMode>,
)
