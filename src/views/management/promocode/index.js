import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, ButtonBase, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
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
import PCDetails from './details';
import moment from 'moment';

function Index({ show }) {

  const [allUsers, setAllUsers] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [refresh, setRefresh] = useState(0)
  const [detailPopup, setDetailPopup] = useState(false)

  const [showDeletePopup, setShowDeletePopup] = useState("")
  const [prefillDetails, setPrefillDetails] = useState({
    title: "",
    imageUrl: "",
    description: "",
    maxDiscount: "",
    type: "",
    duration: "",
    usesLimit: "",
    orderValue: "",
    startDate: "",
    endDate: "",
    isUserShow: "",
    id: ""
  })
  const [searchKey, setSearchKey] = useState("")

  console.log(allUsers, "allUsers");
  console.log(show, "showAll");

  console.log(detailPopup, "detailPopup");


  useEffect(() => {
    getAllUsers()
  }, [refresh, searchKey])


  function getAllUsers() {
    api.get("getPromoCode", {
      params: { search: searchKey }
    }).then(result => {
      console.log(result, "getAllUsers");

      setAllUsers(result?.data?.map((v, i) => ({ ...v, newId: i })))

    }).catch(err => {
      console.log(err);
    })
  }


  function BlockUser(block, id) {
    api.post("updatePromoCodeStatus", {
      status: block,
      promoCodeId: id
    }).then(result => {
      console.log(result, "result");
      // if(result?.message == "Promo code status updated"){
      //   toast.success("Code Enabled")
      // }else{
      //   toast.success("Code Blocked")

      // }
      toast.success(result?.message)
      setRefresh(refresh + 1)
    }).catch(err => {
      toast.error(err?.message)
    })
  }


  const rows = allUsers
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };


  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  function DeleteCat(id) {
    api.post("removePromoCode", {
      promoCodeId: id
    }).then(result => {
      toast.success(result?.message)
      setRefresh(refresh + 1)
      setShowDeletePopup("")
    }).catch(err => {
      toast.error(err?.message)
    })
  }




  return (
    <div>
      <div className='bdc-container-content' >
        <h1 className="bdc-item" >Promocode Management</h1>
        <div>
          <div style={{ display: "inline-block", marginRight: "20px" }} >
            <AiOutlineSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.searchInput} value={searchKey} onChange={(e) => {

              setSearchKey(e.target.value)
            }} />
          </div>
          {!show && <Button variant="contained" className={styles.acceptCta} onClick={() => {
            setDetailPopup(true)
            setPrefillDetails({
              title: "",
              imageUrl: "",
              description: "",
              maxDiscount: "",
              discountUpto: "",
              type: "New User",
              duration: 1,
              usesLimit: "",
              orderValue: "",
              isUserShow: true,
              id: ""
            })
          }}  >Add New Promocode</Button>}
        </div>

      </div>

      <CCard>

        <CommonModal
          show={detailPopup}
          setShow={setDetailPopup}
          title={typeof detailPopup == "string" ? "Edit Promocode" : "Add Promocode"}
          bodyContent={
            <PCDetails setAddSub={setDetailPopup} setRefresh={setRefresh} refresh={refresh} prefillValues={prefillDetails} />
          }
        />

        <CCardBody>



          <CommonModal
            show={showDeletePopup}
            setShow={setShowDeletePopup}
            bodyContent={
              <div className='text-center' >
                <ImBin style={{ fontSize: "30px", color: "#d21313" }} />
                <p className='mt-2 fs-5' >Are you sure, you want to delete this promocode ?</p>
                <div className={styles.modalConCta} >
                  <Button variant="contained" className={styles.acceptCta} onClick={() => DeleteCat(showDeletePopup)}  >Yes</Button>
                  <Button className={styles.rejectCta} variant="outlined" onClick={() => setShowDeletePopup("")} >No</Button>
                </div>

                <div>

                </div>
              </div>
            }
          />

          <CustomTable rows={rows} header={!show ? ["No.", "Promocode Name", "Description", "User Type", "Discount", "Discount Up To", "Order Value", "Duration", "Action"] : ["No.", "Promocode Name", "Description", "User Type", "Discount", "Discount Up To", "Order Value", "Duration"]} page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} tableContent={
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row, i) => {
                console.log(Object.keys(row), "row")
                return <TableRow key={i}>

                  <TableCell component="th" scope="row">
                    {row?.newId + 1}
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: "150px" }} >
                    {row?.title}
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: "150px" }} >
                    {row?.description}
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: "150px" }} >
                    {row?.type}
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: "150px" }} >
                    {row?.maxDiscount} %
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: "150px" }} >
                    {row?.discountUpto}
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: "150px" }} >
                    {row?.orderValue}
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: "150px" }}  >
                    {row?.duration}
                  </TableCell>


                  {!show && <TableCell align="center" style={{ minWidth: "200px" }} >
                    <div className={styles.actionCta} >
                      <BiEdit style={{ fontSize: "30px", color: "var(--curoaid-cyan-dark)", cursor: "pointer" }} onClick={() => {
                        setDetailPopup(row?._id)
                        setPrefillDetails({
                          title: row?.title,
                          imageUrl: row?.imageUrl,
                          description: row?.description,
                          maxDiscount: row?.maxDiscount,
                          discountUpto: row?.discountUpto,
                          type: row?.type,
                          duration: row?.duration,
                          usesLimit: row?.usesLimit,
                          orderValue: row?.orderValue,
                          startDate: moment(row?.startDate * 1000).format("YYYY-MM-DD"),
                          endDate: moment(row?.endDate * 1000).format("YYYY-MM-DD"),
                          isUserShow: row?.isUserShow,
                          id: row?._id
                        })
                      }} />
                      <ImBin style={{ fontSize: "28px", color: "#d21313", cursor: "pointer" }} onClick={() => setShowDeletePopup(row?._id)} />
                      <Switch {...label} color="success" checked={row?.isActive} onClick={() => BlockUser(!row?.isActive, row?._id)} />
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