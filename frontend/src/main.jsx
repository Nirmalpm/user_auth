import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from "react-router";
import ErrorBoundary from './ErrorBoundary.jsx';
import UserAdmin from './admin/Admin.jsx';
import AppLayout from './pages/AppLayout.jsx';
import EmailVerificationPage from './pages/EmailVerificationPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { ProtectedRoute, RedirectAuthenticatedUser } from './pages/RedirectAuthenticatedUser.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import TestPage from './pages/TestPage.jsx';
import BlogDiscussion from './pages/blogs/BlogDiscussion.jsx';
import BlogPage from './pages/blogs/BlogPage.jsx';
import DashboardPage from './pages/dashboard/home.jsx';
import Layout from './pages/profile/ProfileLayout.jsx';
import ViewResumePDF from './pages/profile/ViewResumePDF.jsx';
import AmmaQuotes from './pages/spiritual/Amma/Quotes.jsx';
import BabaQuotes from './pages/spiritual/Baba/Quotes.jsx';
import BhagavadGita from './pages/spiritual/Gita/BhagavadGita.jsx';
import SpiritualQuotes from './pages/spiritual/SpiritualQuotes.jsx';


const ErrorPage = () => {
  return <h2>Oops! Something went wrong. Please try again later.</h2>;
};

const router = createBrowserRouter([
  {
    path:"/",
    Component: App,
    children:[
      {
        Component:()=><ProtectedRoute><ErrorBoundary> <AppLayout/></ErrorBoundary> </ProtectedRoute>,
        children:[
          {index:true, Component: DashboardPage},
          {path:"admin", Component: UserAdmin},
          {path:"blogs",Component:BlogPage},
          {path:"blogs/:id",Component:BlogDiscussion},
          //{path:"spiritual",Component: SpiritualQuotes},
          {path:"test", Component: TestPage}
        ]
      },
      {
        path: "/spiritual",
        Component: AppLayout,
        children:[
          {
            Component: SpiritualQuotes,
            children:[
              {index:true, Component: BabaQuotes},
              {path:"amma",Component:AmmaQuotes},
              {path:"gita",Component:BhagavadGita},
            ]
          }
        ]
      },
      {
        path: "blogs/:id",
        Component: BlogDiscussion
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
        Component: ()=><ProtectedRoute><ErrorBoundary><Layout/></ErrorBoundary> </ProtectedRoute>
      },
      {
        path:"viewresume",
        Component: ()=><ProtectedRoute><ErrorBoundary><ViewResumePDF/></ErrorBoundary> </ProtectedRoute>
      },
      // {
      //   path:"spiritual",
      //   Component: ()=><SpiritualQuotes/>
      // },
      { 
        path:"*",
        Component: ErrorPage
      
      },

    ]
  },
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>   
  </StrictMode>,
)
