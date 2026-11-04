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
import styles from "./forgot.module.css"
import api from "../../../utils/api"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGlobalStore } from 'src/utils/store'
import { ImCross } from 'react-icons/im'

const ForgotPassword = () => {

  const [userMail, setUserMail] = useState("")

  const navigate = useNavigate()

 async function LoginFunc(){


  let mailFormat = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

  if(!userMail){
    toast.error("Please fill the details");
    return
  }
  
  if(!mailFormat.test(userMail)){
    toast.error("Please input valid email");
    return
  }

    await api.post("forgetPassword",{
      email:userMail,
    }).then(result => {
      console.log(result,"result");
      if(result?.status_code == "200"){
        toast.success(result?.message)
        localStorage.setItem("token",result?.response?.access_token)
      navigate("/adminpanel/resetPassword")
      }
    }).catch(err => {
      console.log(err,"someError");
      toast.error(err?.message)
    })
  }


//   resetPassword

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center auth-page" >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className={styles.mainCard} >
                <CCardBody>
                  <CForm>
                    <h5 className='text-center' >Forgot Password</h5>
                   <div className={styles.crossIcon} onClick={() => navigate("/adminpanel/login")} >
                    <ImCross />
                   </div>
                    <CInputGroup className="mt-4 mb-3 ">
                    
                    <CFormFloating className="mb-3">
  <CFormInput type="email" id="floatingInput" placeholder="name@example.com" value={userMail} onChange={(e) => setUserMail(e.target.value)} className={styles.input} />
  <CFormLabel htmlFor="floatingInput">Enter registered email adress*</CFormLabel>
</CFormFloating>
                    </CInputGroup>

                   
                   
                    <div >
                      <button className={styles.ctaBtn} type="button" onClick={LoginFunc} >Send Link</button>
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

export default ForgotPassword
