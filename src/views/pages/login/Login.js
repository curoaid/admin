import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import {AiFillEyeInvisible,AiFillEye} from "react-icons/ai"
import styles from "./login.module.css"
import api from "../../../utils/api"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGlobalStore } from 'src/utils/store'

const Login = () => {

  const [userMail, setUserMail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const {userDetails,setUserDetails} = useGlobalStore(state => state)
  const [eyeToggle, setEyeToggle] = useState(false)
  const navigate = useNavigate()
  

 async function LoginFunc(){
  let mailFormat = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

if(!userMail || !userPassword){
  toast.error("Please fill the details");
  return
}

if(!mailFormat.test(userMail)){
  toast.error("Please input valid email");
  return
}

    await api.post("login",{
      email:userMail,
      password:userPassword
    }).then(result => {
      console.log(result,"result");
      if(result?.status_code == "200"){
        toast.success(result?.message)
        setUserDetails(result?.response)
        localStorage.setItem("token",result?.response?.access_token)
      navigate("/adminpanel/dashboard")
      }
    }).catch(err => {
      console.log(err,"someError");
      toast.error(err?.message)
    })
  }

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center auth-page" >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className={styles.mainCard} >
                <CCardBody>
                  <CForm>
                    <h5 className='text-center' >Login</h5>
                   
                    <CInputGroup className="mt-4 mb-3 ">
                    
                    <CFormFloating className="mb-3">
  <CFormInput type="email" id="floatingInput" placeholder="name@example.com" value={userMail} onChange={(e) => setUserMail(e.target.value)} className={styles.input} />
  <CFormLabel htmlFor="floatingInput">Enter your mail*</CFormLabel>
</CFormFloating>
                    </CInputGroup>

                    
                    <CInputGroup>
                    
                    <CFormFloating className="mb-3"> 
  <CFormInput type={eyeToggle ? "text" : "password"} id="floatingInput" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} className={styles.input} />
  <div className={styles.eyeIcon} >
 {!eyeToggle ? <AiFillEye  onClick={() => setEyeToggle(!eyeToggle)} /> : <AiFillEyeInvisible onClick={() => setEyeToggle(!eyeToggle)}  /> }
  </div>
  
  <CFormLabel htmlFor="floatingInput">Enter your password*</CFormLabel>
</CFormFloating>
                    </CInputGroup>
                    <div className='d-flex justify-content-between align-items-center' >

                      <div className='d-flex align-items-center' >
                        <input type="checkbox" className={styles.checkbox} />
                        <p>Remember Me</p>
                        
                      </div>
                      <div className="text-right">
                        <CButton style={{color:"var(--curoaid-cyan-dark)",border:"none",background:"transparent"}} onClick={() =>  navigate("/adminpanel/forgotPassword")} className="px-0">
                          Forgot password
                        </CButton>
                      </div>
                    </div>
                    <div >
                      <button className={styles.ctaBtn} type="button" onClick={LoginFunc} >Sign In</button>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
             
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
