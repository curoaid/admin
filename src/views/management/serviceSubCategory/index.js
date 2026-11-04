import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, TableBody, TableCell, TableRow } from '@mui/material';
import React,{useEffect, useState} from 'react'
import CustomTable from 'src/components/common/table'
import api from 'src/utils/api';
import { createData } from 'src/utils/common';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
import { BiEdit } from 'react-icons/bi';
import { ImBin } from 'react-icons/im';
import styles from "./style.module.css"
import { AiFillEye, AiOutlineSearch } from 'react-icons/ai';
import CommonModal from 'src/components/common/modal';
import SubDetails from './subDetails';


function Index({show}) {

const [allUsers, setAllUsers] = useState([])
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);
const [refresh, setRefresh] = useState(0)
const [showDeletePopup, setShowDeletePopup] = useState("")
const [viewDetail, setViewDetail] = useState(false)
const [subArray, setSubArray] = useState([])
const [addSub, setAddSub] = useState(false)
const [categoryArray, setCategoryArray] = useState([])
const [searchKey, setSearchKey] = useState("")
const [prefillValues, setPrefillValues] = useState({name:"",image:"",category:"",goodPrice:"",averagePrice:"",excellentPrice:"",description:"",id:"",instruction:[""]})

console.log(allUsers,"allUsers");

  useEffect(() => {
    getAllUsers()
    SerCat()
  }, [refresh,searchKey])


  useEffect(() => {
    if(!addSub){
      setPrefillValues({id:"",name:"",image:"",goodPrice:"",category:"",averagePrice:"",excellentPrice:"",description:"",id:"",instruction:[""]})
    }
  }, [addSub])
  

  function getAllUsers(){
    api.post("getAllService",{
      search:searchKey
    }).then(result => {
      console.log(result,"getAllUsers");
      if(result?.status_code == "200"){
        setAllUsers(result?.response?.map((v,i) => ({...v, newId: i})))
      }else{
        localStorage.clear()
        toast.success("Sign Out Successfully")
      }
    }).catch(err => {
      console.log(err);
    })
  }


  
  const rows = allUsers
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };


  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  function DeleteSub(id) {
    api.post("deleteService",{
      id:id
    }).then(result => {
      toast.success(result?.message)
      setRefresh(refresh + 1)
      setShowDeletePopup("")
    }).catch(err => {
      toast.error(err?.message)
    })
  }


  function SerCat() {
    api.get("getAllCategory").then(result => {
      setCategoryArray(result?.response)
    }).catch(err => {
      toast.error(err?.message)
    })
  }

  const addBaseUrl = (url) => {
    if(!url) return url
    const baseUrl = 'http://52.66.187.242:3001/';
    const s3Pattern = /^https?:\/\/.*\.s3\..*amazonaws\.com\/.*/;
  
    if (url.startsWith('https')) {
        return url;
      }
  
    return `${baseUrl}${url}`;
  };




  return (
    <div>
       <div className='bdc-container-content' >
        <h1 className="bdc-item" >Service Sub Category Management</h1>
        <div>
        <div style={{display:"inline-block",marginRight:"20px"}} >
  <AiOutlineSearch className={styles.searchIcon} />
  <input type="text" placeholder="Search" className={styles.searchInput} value={searchKey} onChange={(e) => {

    setSearchKey(e.target.value) }}  />
</div>
{!show && <Button variant="contained" className={styles.acceptCta} onClick={() => setAddSub(true)}  >Add New Service</Button>}

        </div>
      </div>
   
    <CCard>

<CommonModal
show={showDeletePopup}
setShow={setShowDeletePopup}
bodyContent={
  <div className='text-center' >
    <ImBin  style={{fontSize:"30px",color:"#d21313"}} />
    <p className='mt-2 fs-5' >Are you sure, you want to delete this category ?</p>
    <div className={styles.modalConCta} >
    <Button variant="contained" className={styles.acceptCta} onClick={() => DeleteSub(showDeletePopup) }  >Yes</Button>
    <Button  className={styles.rejectCta}  variant="outlined" onClick={() => setShowDeletePopup("") } >No</Button>
    </div>
    
    <div>
      
    </div>
  </div>
}
/>

<CommonModal
show={addSub}
setShow={setAddSub}
title={prefillValues?.id ? "Edit Category" : "Add Category"}
bodyContent={
 <SubDetails setAddSub={setAddSub} refresh={refresh} prefillValues={prefillValues} setRefresh={setRefresh}  categoryArray={categoryArray} />
}
/>


<CommonModal
show={viewDetail}
setShow={setViewDetail}
title="Instruction"
bodyContent={
  <div className='text-center' >
   
  
    {subArray?.map(v => {
     return <div style={{border:"1px solid grey",padding:"10px 0"}} >{v}</div>
    })}
   
    <div>
      
    </div>
  </div>
}
/>



<CCardBody>
<CustomTable rows={rows} header={!show ?["No.","Service Name","Service Image","Good Price","Excellent Price","Average Price","Description","Category","Instruction","Action"] : ["No.","Service Name","Service Image","Good Price","Excellent Price","Average Price","Description","Category","Instruction"]} page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} tableContent={
          <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row,i) => {
            console.log(Object.keys(row),"row")
           return  <TableRow key={i}>

              <TableCell component="th" scope="row" width="50px" >
                {row?.newId+1}
              </TableCell>
              <TableCell align="center" style={{minWidth:"150px"}}  >
                {row?.name}
              </TableCell>
              <TableCell  align="center" className='p-0' style={{minWidth:"150px"}}  >
              <img src={addBaseUrl(row?.image)} style={{height:"70px",width:"70px"}} />
              </TableCell>
              <TableCell  align="center" style={{minWidth:"150px"}} >
                {row?.goodPrice || "N/A" }
              </TableCell>
              <TableCell  align="center" style={{minWidth:"150px"}} >
                {row?.excellentPrice || ""}
              </TableCell>
              <TableCell  align="center" style={{minWidth:"150px"}} >
                {row?.averagePrice || ""}
              </TableCell>
              <TableCell  align="center" style={{minWidth:"150px"}} >
                {row?.description}
              </TableCell>
              <TableCell  align="center" style={{minWidth:"150px"}} > 
                {categoryArray?.filter(v => v?._id == row?.category)[0]?.name}
              </TableCell>

              <TableCell  align="center" style={{minWidth:"150px"}} >
            <AiFillEye style={{fontSize:"20px",color:"black",cursor:"pointer"}} onClick={() =>{
              setSubArray(row?.instruction)
               setViewDetail(true)} } />
            </TableCell>

        { !show  &&   <TableCell  align="center" style={{minWidth:"150px"}}  >
                <div className={styles.actionCta} > 
                <BiEdit style={{fontSize:"30px",color:"var(--curoaid-cyan-dark)",cursor:"pointer"}}
                onClick={() => {
                  setAddSub(true)
                  setPrefillValues({name:row?.name,image:row?.image,description:row?.description,goodPrice:row?.goodPrice,excellentPrice:row?.excellentPrice,averagePrice:row?.averagePrice,id:row?._id,instruction:row?.instruction,
                    category:row?.category})
                 }}
                />
                <ImBin style={{fontSize:"28px",color:"#d21313",cursor:"pointer"}} onClick={() => setShowDeletePopup(row?._id) } />
               
             
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