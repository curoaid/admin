import { CCard, CCardBody, CCardHeader, CFormLabel } from '@coreui/react'
import { Button, ButtonBase, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import CustomTable from 'src/components/common/table'
import api from 'src/utils/api';
import { createData } from 'src/utils/common';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
import { ImBin } from 'react-icons/im';
import { BiEdit } from 'react-icons/bi';
import styles from "./style.module.css"
import CommonModal from 'src/components/common/modal';
import FilePicker from 'src/components/common/imageUploader';
import SimpleInput from 'src/components/common/simpleInput';
import { AiOutlineSearch } from 'react-icons/ai';
import UploadImg from "src/assets/images/upload.png"
import Details from './detail';


function Index({ show }) {

  const [allUsers, setAllUsers] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [refresh, setRefresh] = useState(0)
  const [addTax, setAddTax] = useState(false)
  const [addCancellation, setAddCancellation] = useState(false)
  const [cancellationCharges, setCancellationCharges] = useState("")
  const [getCancellationCharges, setGetCancellationCharges] = useState("")
  const [cancellationError, setCancellationError] = useState({ error: "", show: false })
  const [prefillValues, setPrefillValues] = useState({
    category: "",
    subCategory: "",
    companyPercentage: "",
    individualPercentage: "",
    taxPercentage: "",
    serviceCharge: "",
    id: ""
  })
  const [showDeletePopup, setShowDeletePopup] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [allSub, setAllSub] = useState([])
  const [allCat, setAllCat] = useState([])


  console.log(allUsers, "allUsers");
  console.log(allCat, "allCat");
  console.log(!cancellationCharges, !getCancellationCharges, "getCancellationCharges");


  useEffect(() => {
    getAllUsers()
    getCancellationFee()
  }, [refresh, searchKey])

  useEffect(() => {

    getAllSub()
  }, [])


  let hundredNumber = /^[1-9][0-9]?$|^99$/
  let number = /^[0-9]+$/




  useEffect(() => {
    if (!addTax) {
      setPrefillValues({
        category: "",
        subCategory: "",
        companyPercentage: "",
        individualPercentage: "",
        taxPercentage: "",
        serviceCharge: "",
        id: ""
      })
    }


  }, [addTax])



  function getAllUsers() {
    api.post("getCommissionList", {
      search: searchKey
    }).then(result => {
      console.log(result, "getAllUsers");
      setAllUsers(result?.data)

    }).catch(err => {
      console.log(err);
    })
  }

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }


  function getAllSub() {
    api.post("getAllService").then(result => {
      console.log(result, "getAllSub");
      setAllSub(result?.response)
      setAllCat(getUniqueListBy(result?.response?.map(v => v?.catData), "_id"))
    }).catch(err => {
      console.log(err);
    })
  }

  function getCancellationFee() {
    api.get("getCancellationData").then(result => {
      console.log(result, "getAllUsers");
      setGetCancellationCharges(result?.data)
    }).catch(err => {
      console.log(err);
    })
  }


  // function getAllCat(){
  //   api.post("getAllCategory").then(result => {
  //     console.log(result,"getAllUsers");
  //     setAllCat(result?.response)    
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }





  const rows = allUsers
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };


  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  function DeleteCat(id) {
    api.post("removeCommission", {
      commissionId: id
    }).then(result => {
      toast.success(result?.message)
      setRefresh(refresh + 1)
      setShowDeletePopup("")
    }).catch(err => {
      toast.error(err?.message)
    })
  }

  useEffect(() => {
    setCancellationCharges(getCancellationCharges)
  }, [addCancellation])



  function CancellationFunc() {
    if (!cancellationCharges) {
      toast.error("This field is required")
      // setCancellationError({error:"This field is required",show:true})
    } else if (!number.test(cancellationCharges)) {
      toast.error("This value must be a number")
      // setCancellationError({error:"This value must be a number",show:true})
    } else if (!hundredNumber.test(cancellationCharges)) {
      toast.error("Value should be between 1 to 100")
      // setCancellationError({error:"Value should be between 1 to 100",show:true})
    } else {
      api.post("addCancellationFee", {
        cancellationPercentage: cancellationCharges
      }).then(result => {
        toast.success(result?.message)
        setRefresh(refresh + 1)
        setAddCancellation(false)
      }).catch(err => {
        toast.error(err?.message)
      })
    }


  }




  return (
    <div>
      <div className='bdc-container-content' >
        <h1 className="bdc-item" >Commission Management</h1>

        <div style={{ display: "inline-block" }} >
          <AiOutlineSearch className="searchIcon" />
          <input type="text" placeholder="Search" className="searchInput" value={searchKey} onChange={(e) => {

            setSearchKey(e.target.value)
          }} />
        </div>

      </div>

      <CCard>

        <CommonModal
          show={addTax}
          setShow={setAddTax}
          title={prefillValues?.id ? "Edit Tax" : "Add Tax"}
          bodyContent={<Details allCat={allCat} allSub={allSub} setAllSub={setAllSub} prefillValues={prefillValues} setAddTax={setAddTax} setRefresh={setRefresh} refresh={refresh} />}
        />

        <CommonModal
          show={addCancellation}
          setShow={setAddCancellation}
          title={cancellationCharges ? "Edit Cancellation Fee" : "Add Cancellation Fee"}
          bodyContent={
            <div>
              <SimpleInput title="Cancellation Fee" placeholder="Enter amount" value={cancellationCharges} onChange={(e) => setCancellationCharges(e.target.value)} />
              {/* {cancellationError?.show && <CFormLabel className="simple-select-error" style={{color:"#dc3545"}} >
          {cancellationError?.error}
        </CFormLabel>} */}
              <div className="text-center mt-5 mb-1">
                <Button variant="contained" className={styles.acceptCta} onClick={CancellationFunc} >
                  {cancellationCharges ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          }
        />

        <CCardBody>

          <div className='d-flex justify-content-end align-items-center mx-3 mb-4 mt-2'  >
            <p style={{ marginRight: "20px", fontSize: "19px" }} >{getCancellationCharges}%</p>
            {!show && <Button variant="contained" className={styles.acceptCta} style={{ marginRight: "20px" }} onClick={() => setAddCancellation(true)}  >Add Cancellation</Button>}
            {!show && <Button variant="contained" className={styles.acceptCta} onClick={() => setAddTax(true)}  >Add Taxes</Button>}

          </div>

          <CommonModal
            show={showDeletePopup}
            setShow={setShowDeletePopup}
            bodyContent={
              <div className='text-center' >
                <ImBin style={{ fontSize: "30px", color: "#d21313" }} />
                <p className='mt-2 fs-5' >Are you sure, you want to delete this?</p>
                <div className={styles.modalConCta} >
                  <Button variant="contained" className={styles.acceptCta} onClick={() => DeleteCat(showDeletePopup)}  >Yes</Button>
                  <Button className={styles.rejectCta} variant="outlined" onClick={() => setShowDeletePopup("")} >No</Button>
                </div>

                <div>

                </div>
              </div>
            }
          />

          <CustomTable rows={rows} header={!show ? ["No.", "Category", "Sub Category", "Company", "Individual", "Tax", "Service Charge", "Action"] : ["No.", "Category", "Sub Category", "Company", "Individual", "Tax", "Service Charge"]} page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} tableContent={
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row, i) => {
                console.log(Object.keys(row), "row")
                return <TableRow key={i}>

                  <TableCell component="th" scope="row">
                    {i + 1}
                  </TableCell>
                  <TableCell align="center">
                    {allCat?.filter(v => v?._id == row?.category)[0]?.name}
                  </TableCell>
                  <TableCell align="center">
                    {allSub?.filter(v => v?._id == row?.subCategory)[0]?.name}
                  </TableCell>
                  <TableCell align="center">
                    {row?.companyPercentage}%
                  </TableCell>
                  <TableCell align="center">
                    {row?.individualPercentage}%
                  </TableCell>
                  <TableCell align="center">
                    {row?.taxPercentage}%
                  </TableCell>
                  <TableCell align="center">
                    {row?.serviceCharge}%
                  </TableCell>


                  {!show && <TableCell align="center">
                    <div className={styles.actionCta} >
                      <BiEdit style={{ fontSize: "30px", color: "var(--curoaid-cyan-dark)", cursor: "pointer" }} onClick={() => {
                        setAddTax(true)
                        setPrefillValues({
                          category: row?.category,
                          subCategory: row?.subCategory,
                          companyPercentage: row?.companyPercentage,
                          individualPercentage: row?.individualPercentage,
                          taxPercentage: row?.taxPercentage,
                          serviceCharge: row?.serviceCharge,
                          id: row?._id
                        })
                      }} />
                      <ImBin style={{ fontSize: "28px", color: "#d21313", cursor: "pointer" }} onClick={() => setShowDeletePopup(row?._id)} />

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