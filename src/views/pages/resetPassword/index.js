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
import styles from "./reset.module.css"
import api from "../../../utils/api"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGlobalStore } from 'src/utils/store'
import {AiFillEyeInvisible,AiFillEye} from "react-icons/ai"
import { ImCross } from 'react-icons/im'

const ResetPassword = () => {

  
  const [userPassword, setUserPassword] = useState("")
  const [userConfirmPassword, setUserConfirmPassword] = useState("")
  const {userDetails,setUserDetails} = useGlobalStore(state => state)
  const [eyeToggleNew, seteyeToggleNew] = useState(false)
  const [eyeToggleConfirm, setEyeToggleConfirm] = useState(false)
  const navigate = useNavigate()

 async function ConfirmFunc(){

    if(!userConfirmPassword || !userPassword){
        toast.error("Please fill all the details")
        return
    }

    if(userConfirmPassword !== userPassword){
        toast.error("Passwords doesn't match")
        return
    }

    await api.post("resetPassword",{  
      password:userPassword
    }).then(result => {
      console.log(result,"result");
      if(result?.status_code == "200"){
        toast.success(result?.message)    
      navigate("/adminpanel/login")
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
                    <h5 className='text-center' >Reset Password</h5>
                    <div className={styles.crossIcon} onClick={() => navigate("/adminpanel/login")} >
                    <ImCross />
                   </div>
                    <CInputGroup className="mt-4 mb-3 ">
                    
                    <CFormFloating className="mb-3">
  <CFormInput type={eyeToggleNew ? "text" : "password"} id="floatingInput" placeholder="name@example.com" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} className={styles.input} />

  <div className={styles.eyeIcon} >
 {!eyeToggleNew ? <AiFillEye  onClick={() => seteyeToggleNew(!eyeToggleNew)} /> : <AiFillEyeInvisible onClick={() => seteyeToggleNew(!eyeToggleNew)}  /> }
  </div>

  <CFormLabel htmlFor="floatingInput">Enter new Password*</CFormLabel>
</CFormFloating>
                    </CInputGroup>

                    
                    <CInputGroup>
                    
                    <CFormFloating className="mb-3"> 
  <CFormInput type={eyeToggleConfirm ? "text" : "password"}  id="floatingInput" value={userConfirmPassword} onChange={(e) => setUserConfirmPassword(e.target.value)} className={styles.input} />
  <div className={styles.eyeIcon} >
 {!eyeToggleConfirm ? <AiFillEye  onClick={() => setEyeToggleConfirm(!eyeToggleConfirm)} /> : <AiFillEyeInvisible onClick={() => setEyeToggleConfirm(!eyeToggleConfirm)}  /> }
  </div>
  <CFormLabel htmlFor="floatingInput">Confirm Password*</CFormLabel>
</CFormFloating>
                    </CInputGroup>
                   
                    <div >
                      <button className={styles.ctaBtn} type="button" onClick={ConfirmFunc} >Confirm</button>
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

export default ResetPassword
