import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { createBrowserRouter, RouterProvider } from "react-router";
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EmailVerificationPage from './pages/EmailVerificationPage.jsx';
import { ProtectedRoute, RedirectAuthenticatedUser } from './pages/RedirectAuthenticatedUser.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import Layout from './pages/profile/ProfileLayout.jsx';
import { Component } from 'lucide-react';
import AppLayout from './pages/AppLayout.jsx';
import TestPage from './pages/TestPage.jsx';
import DashboardPage from './pages/dashboard/home.jsx';
import UserAdmin from './admin/Admin.jsx';
import BlogPage from './pages/blogs/BlogPage.jsx';
import BlogDiscussion from './pages/blogs/BlogDiscussion.jsx';


const router = createBrowserRouter([
  {
    path:"/",
    Component: App,
    children:[
      {
        Component:()=><ProtectedRoute> <AppLayout/></ProtectedRoute>,
        children:[
          {index:true, Component: DashboardPage},
          {path:"admin", Component: UserAdmin},
          {path:"blogs",Component:BlogPage},
          {path:"blogs/:id",Component:BlogDiscussion},
          {path:"test", Component: TestPage}
        ]
      },
      // {
      //   path: "blogs",
      //   Component: BlogPage
      // },
      // {
      //   path: "blogs/:id",
      //   Component: BlogDiscussion
      // },
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
        Component: ()=><ProtectedRoute> <Layout/></ProtectedRoute>
      }
    ]
  },
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>   
  </StrictMode>,
)
