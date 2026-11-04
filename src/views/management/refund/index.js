import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, TableBody, TableCell, TableRow } from '@mui/material';
import React,{useEffect, useState} from 'react'
import CustomTable from 'src/components/common/table'
import api from 'src/utils/api';
import { createData } from 'src/utils/common';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
import { AiFillEye, AiOutlineSearch,AiFillCheckCircle } from 'react-icons/ai';
import styles from "./style.module.css"
import { useNavigate } from 'react-router-dom';
import { ImBin } from 'react-icons/im';
import CommonModal from 'src/components/common/modal';
import { Dropdown, Form } from 'react-bootstrap';
import moment from 'moment';
import SimpleInput from 'src/components/common/simpleInput';

function Index({show}) {

const [allUsers, setAllUsers] = useState([])
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);
const [refresh, setRefresh] = useState(0)
const [searchKey, setSearchKey] = useState("")
const [showDeletePopup, setShowDeletePopup] = useState("")
const [sort, setSort] = useState("aesc")
const [detailsPopup, setDetailsPopup] = useState(false)
const [userDetails, setUserDetails] = useState({})

const navigate = useNavigate()
console.log(allUsers,"refundData");
console.log(show,"accessshow");

  useEffect(() => {
    getAllUsers()
  }, [refresh,searchKey])


  function getAllUsers(){
    api.post("refundData",{search:searchKey}).then(result => {

    //   if(result?.status_code == "200"){
        setAllUsers(result?.data?.map((v,i) => ({...v, newId: i})) )
//       }else{
//         localStorage.clear()
//         toast.success("Sign Out Successfully")
// navigate("/adminpanel/login")
//       }
    }).catch(err => {
      console.log(err);
    })
  }

  
  const rows = allUsers
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };
  function DeletePlan(id) {
    api.post("deleteRefund",{
      bookingId:id
    }).then(result => {
      toast.success(result?.message)
      setRefresh(refresh + 1)
      setShowDeletePopup("")
    }).catch(err => {
      toast.error(err?.message)
    })
  }
 

  function InitiateRefund(id){
    api.post("initiateRefund",{
      bookingId:id
    }).then(result => {
      toast.success(result?.message)
      setRefresh(refresh + 1)
    }).catch(err => {
      toast.error(err?.message)
    })
  }

  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  console.log(page * rowsPerPage, page * rowsPerPage + rowsPerPage,"rowsPerPage");

  return (
    <div>
       <div className='bdc-container-content' >
        <h1 className="bdc-item" >Refund Management</h1>
        <div style={{display:"inline-block"}} >
  <AiOutlineSearch className="searchIcon" />
  <input type="text" placeholder="Search" className="searchInput" value={searchKey} onChange={(e) => {

    setSearchKey(e.target.value) }}  />
</div>
      </div>
   
    <CCard>


    <CommonModal
show={showDeletePopup}
setShow={setShowDeletePopup}
bodyContent={
  <div className='text-center' >
    <ImBin  style={{fontSize:"30px",color:"#d21313"}} />
    <p className='mt-2 fs-5' >Are you sure, you want to delete this?</p>
    <div className={styles.modalConCta} >
    <Button variant="contained" className={styles.acceptCta} onClick={() => DeletePlan(showDeletePopup) }  >Yes</Button>
    <Button className={styles.rejectCta}  variant="outlined" onClick={() => setShowDeletePopup("") } >No</Button>
    </div>
    
    <div>
      
    </div>
  </div>
}
/>

    <CommonModal
show={detailsPopup}
setShow={setDetailsPopup}
title="Refund Details"
bodyContent={
  <div >
   <SimpleInput title="Username" value={userDetails?.userName} groupClassName="mb-3" />
   <SimpleInput title="Booking Id" value={userDetails?.bookingId} groupClassName="mb-3" />
   <SimpleInput title="Booking Date & Time" value={moment(userDetails?.bookingDateTime).format("DD/MMM/YYYY hh:mm a")} groupClassName="mb-3" />
   <SimpleInput title="Transaction Id" value={userDetails?.transectionId} groupClassName="mb-3" />
   <SimpleInput title="Company Name" value={userDetails?.companyName || "N/A"} groupClassName="mb-3" />
   <SimpleInput title="Total Charges" value={userDetails?.amount} groupClassName="mb-3" />
   <SimpleInput title="Service Man Name" value={userDetails?.allocatedStaff} groupClassName="mb-3" />
   <SimpleInput title="Payment Mode" value={userDetails?.paymentMode} groupClassName="mb-3" />
   <SimpleInput title="Return Status" value={userDetails?.refundStatus ? "Completed" : "Pending"} groupClassName="mb-3" />

  </div>
}
/>


<CCardBody>
<CustomTable rows={rows} header={["No.","User Name","Booking ID","Booking Date & Time","Transaction ID","Company Name","Total Charges","Service Man Name","Payment Mode","Return Status","Action"]} page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} tableContent={
          <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row,i) => {
            console.log(Object.keys(row),"row")
           return  <TableRow key={i}>

              <TableCell scope="row"  >
              {row?.newId + 1}
              </TableCell>
              <TableCell align="center" style={{minWidth:"150px"}} >
                {row?.userName}
              </TableCell>
              <TableCell align="center" style={{minWidth:"150px"}} >
                {row?.bookingId}
              </TableCell>
              <TableCell align="center" style={{minWidth:"250px"}} >
                {moment(row?.bookingDateTime).format("DD/MMM/YYYY hh:mm a")}
              </TableCell>
              <TableCell  align="center" style={{minWidth:"150px"}} >
                {row?.transectionId}
              </TableCell>
              <TableCell  align="center" style={{minWidth:"150px"}} >
                {row?.companyName || "N/A" }
              </TableCell>
              <TableCell  align="center" style={{minWidth:"200px"}} >
                {row?.amount || ""}
              </TableCell>
              <TableCell  align="center" style={{minWidth:"200px"}} >
                {row?.allocatedStaff || ""}
              </TableCell>
              <TableCell  align="center" style={{minWidth:"150px"}} >
                {row?.paymentMode  }
              </TableCell>
              <TableCell  align="center" style={{minWidth:"150px"}} >
                {row?.refundStatus ? "Completed" : "Pending" }
              </TableCell>
          {!show  &&  <TableCell  align="center" style={{minWidth:"200px"}}  >
              <div className={styles.action} style={{width:row?.refundStatus ? "70%"  : "100%"}}  >
 
            {!row?.refundStatus && <AiFillCheckCircle style={{fontSize:"25px",color:"var(--curoaid-cyan-dark)",cursor:"pointer"}} onClick={() => InitiateRefund(row?._id)}  />}
              <AiFillEye style={{fontSize:"30px",color:"var(--curoaid-cyan-dark)",cursor:"pointer"}} onClick={() => {
                setDetailsPopup(true)
                setUserDetails(row)
              }} />
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
</CCardBody>
    </CCard>
   
    </div>
  )
}

export default Index