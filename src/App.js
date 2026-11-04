import React, {Component,  Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './scss/style.scss'
import { useGlobalStore } from './utils/store'
import ForgotPassword from './views/pages/forgotPassword'
import ResetPassword from './views/pages/resetPassword'
import api from './utils/api'


const loading = (
   // <div className=" text-center justify-content-center">
   //   <div className="sk-spinner sk-spinner-pulse"></div>
   // </div>
   <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="sk-spinner sk-spinner-pulse"></div>
   </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
let token = localStorage.getItem('token')

function App() {
   const { setNotifyCount } = useGlobalStore((state) => state)

   const navigate = useNavigate()

   useEffect(() => {
      getNotification()
   },[token])

   useEffect(() => {
      if (!token) {
         navigate('/adminpanel/login')
      }
   }, [token])

   function getNotification(params) {
      api.get('/getNotification')
         .then((res) => {
            setNotifyCount(res?.data?.length)
         })
         .catch((err) => {
            console.log(err?.message)
         })
   }

   return (
      <>
         <Suspense fallback={loading}>
            <Routes>
               <Route exact path="/adminpanel/login" name="Login Page" element={<Login />} />
               <Route
                  exact
                  path="/adminpanel/register"
                  name="Register Page"
                  element={<Register />}
               />
               <Route exact path="/adminpanel/404" name="Page 404" element={<Page404 />} />
               <Route exact path="/adminpanel/500" name="Page 500" element={<Page500 />} />
               <Route
                  exact
                  path="/adminpanel/forgotPassword"
                  name="Forgot Password"
                  element={<ForgotPassword />}
               />
               <Route
                  exact
                  path="/adminpanel/resetPassword"
                  name="Reset Password"
                  element={<ResetPassword />}
               />
               <Route path="*" name="Home" element={<DefaultLayout />} />
               {/* <Route path="*" name="Dashboard" element={<Dashboard/>} /> */}
            </Routes>
         </Suspense>
      </>
   )
}

export default App
