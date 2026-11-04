import { Button, Switch, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CustomTable from 'src/components/common/table';
import api from 'src/utils/api';
import { createData } from 'src/utils/common';
import styles from "./style.module.css"
import {AiFillEye, AiOutlineSearch} from "react-icons/ai"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ImBin } from 'react-icons/im';
import { BiEdit } from 'react-icons/bi';
import CommonModal from 'src/components/common/modal';
import PlanDetails from './planDetails';


function PlanTable({allFeatures,addPlan,setAddPlan,setMainService,searchKey,show}) {


    
    const [allService, setAllService] = useState([])
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);
const [refresh, setRefresh] = useState(0)
const [viewDetail, setViewDetail] = useState("")
const [featureArray, setFeatureArray] = useState([])

const [showDeletePopup, setShowDeletePopup] = useState("")
const [prefillValues, setPrefillValues] = useState({name:"",duration:"",price:"",id:"",features:[]})

const navigate = useNavigate()

console.log(allService,"allService");
console.log(featureArray,"featureArray");
console.log(allFeatures,"allFeatures");
console.log(prefillValues,"prefillValues");


useEffect(() => {
    getAllUsers()
  }, [refresh,searchKey])

  useEffect(() => {
    if(!addPlan){
      setPrefillValues({name:"",duration:"",price:"",id:"",features:[]})
    }
  }, [addPlan])
  
  

  function getAllUsers(){
    api.post("getAllSubscription",{
      search:searchKey
    }).then(result => {
      console.log(result,"getAllUsers");
      if(result?.status_code == "200"){
       
            setAllService(result?.response)
    setMainService(result?.response)
        
      }else{
        localStorage.clear()
        toast.success("Sign Out Successfully")
      }
    }).catch(err => {
      console.log(err);
    })
  }


  const rows = allService

const emptyRows =
page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;
const label = { inputProps: { 'aria-label': 'Color switch demo' } };


function DeletePlan(id) {
  api.post("deleteSubscription",{
    id:id
  }).then(result => {
    toast.success(result?.message)
    setRefresh(refresh + 1)
    setShowDeletePopup("")
  }).catch(err => {
    toast.error(err?.message)
  })
}

function BlockUser(block,id) {
  api.post("activeSubscription",{
    status:block.toString(),
    subscription_id:id
  }).then(result => {
    toast.success(result?.message)
    setRefresh(refresh + 1)
  }).catch(err => {
    toast.error(err?.message)
  })
}


  return (
    <div>
      <CommonModal
show={viewDetail}
setShow={setViewDetail}
title="View Features"
bodyContent={
  <div className='text-center' >
   
    {/* <p className='mt-2 fs-5 fw-bold mb-3' >View Features</p> */}
    {featureArray?.map(v => {
     return <div style={{border:"1px solid grey",padding:"10px 0"}} >{v?.name}</div>
    })}
   
    <div>
      
    </div>
  </div>
}
/>

      <CommonModal
show={addPlan}
setShow={setAddPlan}
title={prefillValues.id ? "Edit Plan" : "Add Plan"}
bodyContent={
 <PlanDetails allFeatures={allFeatures} prefillValues={prefillValues} setAddPlan={setAddPlan} refresh={refresh} setRefresh={setRefresh}  />
}
/>

<CommonModal
show={showDeletePopup}
setShow={setShowDeletePopup}
bodyContent={
  <div className='text-center' >
    <ImBin  style={{fontSize:"30px",color:"#d21313"}} />
    <p className='mt-2 fs-5' >Are you sure, you want to delete this plan ?</p>
    <div className={styles.modalConCta} >
    <Button variant="contained" className={styles.acceptCta} onClick={() => DeletePlan(showDeletePopup) }  >Yes</Button>
    <Button  className={styles.rejectCta}  variant="outlined" onClick={() => setShowDeletePopup("") } >No</Button>
    </div>
    
    <div>
      
    </div>
  </div>
}
/>

{/* <div className='d-flex justify-content-between align-items-center mx-3 mb-4 mt-2'  >




</div> */}
 
    <CustomTable rows={rows} header={ show ? ["No.","Name","Price","Duration","Package Policy","T/C","Feature","Action"] : ["No.","Name","Price","Duration","Package Policy","T/C","Feature"] } page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} tableContent={
        <TableBody>
        {(rowsPerPage > 0
          ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : rows
        ).map((row,i) => {
          console.log(Object.keys(row),"row")
         return  <TableRow key={i}>

            <TableCell component="th" scope="row">
              {i+1}
            </TableCell>
            <TableCell align="center">
              {row?.name}
            </TableCell>
           
            <TableCell  align="center">
              {row?.price}
            </TableCell>
       
           
            <TableCell  align="center">
              {row?.duration || ""}
            </TableCell>
            <TableCell  align="center">
              {row?.package_policy || ""}
            </TableCell>
            <TableCell  align="center">
              {row?.terms || ""}
            </TableCell>
           
         
            <TableCell  align="center">
            <AiFillEye style={{fontSize:"20px",color:"black",cursor:"pointer"}} onClick={() =>{
              
              setViewDetail(true)
              setFeatureArray(row?.features)
              } } />
            </TableCell>

       {show  &&   <TableCell  align="center"  >
        <div className={styles.action}  >

                <Switch {...label} color={"error" } checked={row?.is_blocked == 0 ? false : true}  onClick={() => BlockUser(row?.is_blocked == 0 ? 1 : 0 ,row?._id)}   />
                <BiEdit style={{fontSize:"20px",color:"var(--curoaid-cyan-dark)",cursor:"pointer"}} onClick={() => {
                  setPrefillValues({name:row?.name,price:row?.price,duration:row?.duration,id:row?._id,features:row?.features,package_policy:row?.package_policy,terms:row?.terms})
                  setAddPlan(true)} } />
                <ImBin style={{fontSize:"20px",color:"#d21313",cursor:"pointer"}} onClick={() => setShowDeletePopup(row?._id)} />
               
               
              </div> 
            </TableCell>}
         
          </TableRow>
        })}

        {emptyRows > 0 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </TableBody>
      } />
         </div>
  )
}

export default PlanTable