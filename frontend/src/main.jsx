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
import AdminContact from './AdminContact.jsx';

import HospitalLayout from './pages/hospital/Layout.jsx';
import Home from './pages/hospital/Home.jsx';
import Admin from './pages/hospital/Admin.jsx';
import Ward from './pages/hospital/Ward.jsx';
import PatientsList from './pages/hospital/PatientsList.jsx';
import UnderConstruction from './pages/hospital/UnderConstruction.jsx';
import Login from './pages/hospital/Login.jsx';
import RedirectLogin, { PasProtectedRoute } from './pages/hospital/RedirectLogin.jsx';
import InPatientsPage from './pages/hospital/InPatientsPage.jsx';
import BillingsPage from './pages/hospital/BillingsPage.jsx';
import OutPatientsPage from './pages/hospital/OutpatientsPage.jsx';
import TestsPage from './pages/hospital/TestsPage.jsx';
import DepartmentPage from './pages/hospital/DepartmentPage.jsx';
import CanteenPage from './pages/hospital/CanteenPage.jsx';


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
        Component:AppLayout,
        children:[
          {
            Component: SpiritualQuotes,
            children:[
              {path:"swami", Component: BabaQuotes},
              {index:true,Component:AmmaQuotes},
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
      {
        path:"admin-contact",
        Component: ()=><AdminContact/>
      },
      { 
        path:"*",
        Component: ErrorBoundary
      
      },
      {
        path:"pas",
        Component: ()=> <RedirectLogin><Login/></RedirectLogin>
      },
      {
        path:"hospital",
        Component:  ()=> <PasProtectedRoute><HospitalLayout/></PasProtectedRoute>,
        children:[
          {index:true, Component:Home},          
          {path:"admin", Component:Admin},
          {path:"ward/:wardId", Component:Ward},
          {path:"patientreg", Component:PatientsList},
          {path:"inpatient", Component:InPatientsPage},
          {path:"outpatient", Component:OutPatientsPage},
          {path:"dept/:id", Component:DepartmentPage},
          {path:"test", Component:TestsPage},
          {path:"pharmacy", Component:UnderConstruction},
          {path:"canteen", Component:CanteenPage},
          {path:"billing", Component:BillingsPage},
        ]
      }

    ]
  },
  
]);

const Root = import.meta.env.MODE === 'development'
  ? <StrictMode><RouterProvider router={router}/></StrictMode>
  : <RouterProvider router={router}/>
createRoot(document.getElementById('root')).render(Root)
