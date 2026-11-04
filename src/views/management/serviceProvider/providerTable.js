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
import CommonModal from 'src/components/common/modal';


function ProviderTable({currService,searchKey,show}) {


    
    const [allService, setAllService] = useState([])
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);
const navigate = useNavigate()
const [refresh, setRefresh] = useState(0)
const [showDeletePopup, setShowDeletePopup] = useState("")


console.log(allService,"allService");
console.log(show,"accessshow");





useEffect(() => {
    getAllUsers()
  }, [currService,refresh,searchKey])
  

  function getAllUsers(){
    api.post("getAllServiceCompany",{
      search:searchKey
    }).then(result => {
      console.log(result,"getAllUsers");
      if(result?.status_code == "200"){
        if(currService == 1){
            setAllService(result?.response?.newData?.map((v,i) => ({...v, newId: i,status:"Not Yet Accepted"})))
            
        }else if(currService == 2){
            setAllService(result?.response?.acceptedData?.map((v,i) => ({...v, newId: i,status:"Accepted"})))
        }else if(currService == 3){
            setAllService(result?.response?.rejectedData?.map((v,i) => ({...v, newId: i,status:"Rejected"})))
          
        }else{
          setAllService([])
        }
        
      }else{
        localStorage.clear()
        toast.success("Sign Out Successfully")
      }
    }).catch(err => {
      console.log(err);
    })
  }


  const rows = allService
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };

const emptyRows =
page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;


function ApprovalReq(approve,id) {
  api.post("approveRejectServiceCompany",{
    is_approved:approve,
    id:id
  }).then(result => {
    toast.success(result?.message)
    setRefresh(refresh + 1)
  }).catch(err => {
    toast.error(err?.message)
  })
}

function BlockUser(block,id) {
  api.post("blockServiceCompany",{
    is_blocked:block.toString(),
    id:id
  }).then(result => {
    toast.success(result?.message)
    setRefresh(refresh + 1)
  }).catch(err => {
    toast.error(err?.message)
  })
}

function DeletePlan(id) {
  api.post("removeStaff",{
    userId:id
  }).then(result => {
    toast.success(result?.message)
    setRefresh(refresh + 1)
    setShowDeletePopup("")
  }).catch(err => {
    toast.error(err?.message)
  })
}

function Headers(){
  if(currService == 1){
    return ["No.","Provider Name","Company Name","Mobile","Email ID","Total Workforce","Address","Category","Action"]
  }else if(currService == 3){
    return ["No.","Company Name","Mobile","Email ID","Total Workforce","Address","Category","View Service Man","Action"] 
  }else{
   return ["No.","Company Name","Mobile","Email ID","Total Workforce","Address","Category","Status","View Service Man","Action"]
  }
}

  return (
    <div>



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
    <CustomTable rows={rows} header={Headers()} page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} tableContent={
        <TableBody>
        {(rowsPerPage > 0
          ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : rows
        ).map((row,i) => {
          console.log(Object.keys(row),"row")
         return  <TableRow key={i}>

            <TableCell component="th" scope="row" style={{minWidth:"50px"}} >
              {row?.newId+1}
            </TableCell>
        { currService == 1 &&  <TableCell align="center" style={{minWidth:"150px"}} >
              {row?.name}
            </TableCell>}
            <TableCell align="center" style={{minWidth:"150px"}} >
              {row?.companyName}
            </TableCell>
            <TableCell  align="center" style={{minWidth:"150px"}}  >
              {row?.mobile_number}
            </TableCell>
            <TableCell  align="center" style={{minWidth:"150px"}}  >
              {row?.email}
            </TableCell>
            <TableCell  align="center" style={{minWidth:"150px"}} >
              {row?.totalWorkforce || ""}
            </TableCell>
            <TableCell  align="center" style={{minWidth:"150px"}}  >
              {row?.address || ""}
            </TableCell>
           
            <TableCell  align="center" style={{minWidth:"150px"}}  >
            {row?.serviceTypeName}
            </TableCell>


          { currService == 2 && <TableCell  align="center" style={{minWidth:"150px"}}  >
          {row?.is_blocked == 0 ? "Unblock" : "Block" }
            </TableCell>}
          { currService != 1 && <TableCell  align="center" style={{minWidth:"150px"}}  >
           <div onClick={() => navigate(`/adminpanel/man-mgmt/${row?._id}`)} style={{cursor:"pointer"}} >
            View
           </div>
            </TableCell>}


            { !show  && <TableCell  align="center" style={{minWidth:"150px"}}>
           {currService == 1 ? <div >
                <AiFillEye style={{fontSize:"20px",color:"black",cursor:"pointer"}} onClick={() => navigate(`provider-details/${row?._id}`,{state:{service:"provider",status:row?.status}})}  />
              </div>  : 
                <div >
                <AiFillEye style={{fontSize:"30px",color:"var(--curoaid-cyan-dark)",cursor:"pointer"}} onClick={() => navigate(`provider-details/${row?._id}`,{state:{service:"provider",status:row?.status}})}  />
              </div> 
              }
            </TableCell>}

      { show  && <TableCell  align="center" style={{minWidth:"150px"}}>
           {currService == 1 ?  <div className={styles.action} >
                <AiFillEye style={{fontSize:"20px",color:"black",cursor:"pointer"}} onClick={() => navigate(`provider-details/${row?._id}`,{state:{service:"provider",status:row?.status}})}  />
                <Button variant="contained" className={styles.acceptCta} onClick={() => ApprovalReq("1",row?._id)}  >Accept</Button>
                <Button  className={styles.rejectCta}  variant="outlined" onClick={() => ApprovalReq("2",row?._id)}  >Reject</Button>
                {/* <ImBin style={{fontSize:"20px",color:"#d21313",cursor:"pointer"}} onClick={() => setShowDeletePopup(row?._id)} /> */}
              </div> : 
              <div className={currService == 2 && styles.action} >
              <AiFillEye style={{fontSize:"30px",color:"var(--curoaid-cyan-dark)",cursor:"pointer"}} onClick={() => navigate(`provider-details/${row?._id}`,{state:{service:"provider",status:row?.status}})}  />
              {/* <ImBin style={{fontSize:"20px",color:"#d21313",cursor:"pointer"}} onClick={() => setShowDeletePopup(row?._id)} /> */}
         {currService != 3  &&  <Switch {...label} color={"error" } checked={row?.is_blocked == 0 ? false : true}  onClick={() => BlockUser(row?.is_blocked == 0 ? 1 : 0 ,row?._id)}   />}
            </div> 
              }
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

export default ProviderTable