import { Button, Switch, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CustomTable from 'src/components/common/table';
import api from 'src/utils/api';
import { createData } from 'src/utils/common';
import styles from "./style.module.css"
import {ImBin} from "react-icons/im"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommonModal from '../../../components/common/modal';
import SimpleInput from 'src/components/common/simpleInput';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiEdit } from 'react-icons/bi';

function FeatureTable({allFeatures,refresh,setRefresh,featuresPopup,setFeaturesPopup,searchKey,show}) {


    
    
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);
const [showDeletePopup, setShowDeletePopup] = useState("")


const [featureName, setFeatureName] = useState("")
const [featureError, setFeatureError] = useState({error:false,text:""})


const navigate = useNavigate()





console.log(featureError,"featureError");





  const rows = allFeatures

const emptyRows =
page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;
const label = { inputProps: { 'aria-label': 'Color switch demo' } };

function DeleteFeature(id) {
  api.post("deleteSubsFeature",{
    id:id
  }).then(result => {
    toast.success(result?.message)
    setRefresh(refresh + 1)
    setShowDeletePopup("")
  }).catch(err => {
    toast.error(err?.message)
  })
}

useEffect(() => {
 if(featureError?.error){
  if(featureError?.text){
    setFeatureError({error:false,text:""})
  }else{
    setFeatureError({error:true,text:""})
  }
 }
}, [featureError?.text])


useEffect(() => {
  if(!featuresPopup){
    setFeatureName("")
  }
}, [featuresPopup])




function AddFeature() {
  if(!featureName){
    toast.error("Feature is required")
    setFeatureError({error:true,text:""})
    return
  }
  if(typeof featuresPopup == "string"){
    api.post("updateSubsFeature",{
      name: featureName,
      id:featuresPopup,
    }).then(result => {
      toast.success(result?.message)
      setRefresh(refresh + 1)
      setFeaturesPopup(false)
    }).catch(err => {
      toast.error(err?.message)
    })
  }else{
    api.post("addSubsfeatures",{
      name: featureName
    }).then(result => {
      toast.success(result?.message)
      setRefresh(refresh + 1)
      setFeaturesPopup(false)
    }).catch(err => {
      toast.error(err?.message)
    })
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
    <p className='mt-2 fs-5' >Are you sure, you want to delete this feature ?</p>
    <div className={styles.modalConCta} >
    <Button variant="contained" className={styles.acceptCta} onClick={() => DeleteFeature(showDeletePopup) }  >Yes</Button>
    <Button  className={styles.rejectCta}  variant="outlined" onClick={() => setShowDeletePopup("") } >No</Button>
    </div>
    
    <div>
      
    </div>
  </div>
}
/>


<CommonModal
show={featuresPopup}
setShow={setFeaturesPopup}
title={typeof featuresPopup == "string" ? "Edit" : "Add"}
bodyContent={
  <div >
       

     <SimpleInput textArea title="Features" value={featureName} error={featureError?.error && "This field is required"} onChange={(e) => { 
      setFeatureError({...featureError,text:e.target.value})
      setFeatureName(e.target.value)}} placeholder="Enter Features" style={{margin:"15px 0 0"}} />
    <div className='text-center mt-5 mb-1' >
<Button variant="contained" className={styles.acceptCta} onClick={AddFeature}  >{typeof featuresPopup == "string" ? "Update" : "Save"}</Button>

</div>
    
    <div>
      
    </div>
  </div>
}
/>


    


    <CustomTable rows={rows} header={show ? ["No.","Features","Action"] : ["No.","Features"]  } page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} tableContent={
        <TableBody>
        {(rowsPerPage > 0
          ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : rows
        ).filter((row) =>
          
        !searchKey.length || row.name 
          .toString()
          .toLowerCase()
          .includes(searchKey.toString().toLowerCase()) 
      ).map((row,i) => {
          console.log(Object.keys(row),"row")
         return  <TableRow key={i}>

            <TableCell component="th" scope="row">
              {row?.newId+1}
            </TableCell>
            <TableCell align="center">
              {row?.name}
            </TableCell>
           
      {show  &&  <TableCell  align="center" style={{width:"140px"}} >
        <div className={styles.action}  >
        <BiEdit style={{fontSize:"30px",color:"var(--curoaid-cyan-dark)",cursor:"pointer"}}
                onClick={() => {
                  setFeaturesPopup(row?._id)
                  setFeatureName(row?.name)
                 }}
                />
                <ImBin style={{fontSize:"20px",color:"#d21313",cursor:"pointer"}} onClick={() => setShowDeletePopup(row?._id) } />
                
               
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

export default FeatureTable