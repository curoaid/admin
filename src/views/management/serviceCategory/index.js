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

function Index({ show }) {

  const [allUsers, setAllUsers] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [refresh, setRefresh] = useState(0)
  const [editCategory, setEditCategory] = useState("")
  const [detailPopup, setDetailPopup] = useState(false)
  const [selectedImg, setSelectedImg] = useState()
  const [categoryName, setCategoryName] = useState("")
  const [categoryOrder, setCategoryOrder] = useState("")
  const [showDeletePopup, setShowDeletePopup] = useState("")
  const [searchKey, setSearchKey] = useState("")

  console.log(allUsers, "allUsers");
  console.log(selectedImg, "selectedImg");
  console.log(detailPopup, "detailPopup");
  console.log(show, "showAll");
  console.log(categoryOrder, categoryName, "categoryOrder");


  useEffect(() => {
    getAllUsers()
  }, [refresh, searchKey])


  function getAllUsers() {
    api.post("getAllCategory", {
      search: searchKey
    }).then(result => {
      console.log(result, "getAllCategory");
      if (result?.status_code == "200") {
        setAllUsers(result?.response?.map((v, i) => ({ ...v, newId: i })))
      } else {
        localStorage.clear()
        toast.success("Sign Out Successfully")
      }
    }).catch(err => {
      console.log(err);
    })
  }


  useEffect(() => {
    if (!detailPopup) {
      setSelectedImg()
      setCategoryName("")
      setCategoryOrder("")
    }
  }, [detailPopup])



  function BlockUser(block, id) {
    api.post("blockCategory", {
      is_blocked: block.toString(),
      id: id
    }).then(result => {
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
    api.post("deleteCategory", {
      id: id
    }).then(result => {
      toast.success(result?.message)
      setRefresh(refresh + 1)
      setShowDeletePopup("")
    }).catch(err => {
      toast.error(err?.message)
    })
  }

  const addBaseUrl = (url) => {
    if (!url) return url
    const baseUrl = 'http://52.66.187.242:3001/';
    const s3Pattern = /^https?:\/\/.*\.s3\..*amazonaws\.com\/.*/;

    if (url.startsWith('https')) {
      return url;
    }

    return `${baseUrl}${url}`;
  };


  function AddCategory(detailPopup) {
    console.log(typeof detailPopup == "string", "checkVal");

    if (!selectedImg || !categoryName || !categoryOrder) {
      toast.error("Category name,image and order are required to fill")
      return;
    }

    typeof detailPopup != "string" ?
      api.post("addCategory", {
        image: selectedImg,
        name: categoryName,
        order: categoryOrder
      }).then(result => {
        toast.success(result?.message)
        setRefresh(refresh + 1)
        setDetailPopup(false)
        setSelectedImg()
        setCategoryName("")
        setCategoryOrder("")

      }).catch(err => {
        toast.error(err?.message)
      }) :
      api.post("updateCategory", {
        image: selectedImg,
        name: categoryName,
        order: categoryOrder,
        id: detailPopup
      }).then(result => {
        toast.success(result?.message)
        setRefresh(refresh + 1)
        setDetailPopup(false)
        setSelectedImg()
        setCategoryName("")
        setCategoryOrder("")
      }).catch(err => {
        toast.error(err?.message)
      })

  }

  return (
    <div>
      <div className='bdc-container-content' >
        <h1 className="bdc-item" >Service Category Management</h1>
        <div>
          <div style={{ display: "inline-block", marginRight: "20px" }} >
            <AiOutlineSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.searchInput} value={searchKey} onChange={(e) => {

              setSearchKey(e.target.value)
            }} />
          </div>
          {!show && <Button variant="contained" className={styles.acceptCta} onClick={() => setDetailPopup(true)}  >Add Category</Button>}

        </div>
      </div>

      <CCard>

        <CommonModal
          show={detailPopup}
          setShow={setDetailPopup}
          title={typeof detailPopup == "string" ? "Edit Category" : "Add Category"}
          bodyContent={
            <div >


              <FilePicker
                onGetUrl={(url) => setSelectedImg(url)}
                imageUrl={selectedImg ? `http://52.66.187.242:3001${selectedImg}` : UploadImg}
                bodyWidth="150px"
                bodyHeight="150px"
              />
              <SimpleInput title="Category Name" required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Enter Category Name" style={{ margin: "15px 0 0" }} />
              <SimpleInput title="Category Order" required value={categoryOrder} onChange={(e) => {
                const val = e.target.value;
                if (/^[0-9]*$/.test(val)) {
                  setCategoryOrder(val);
                }
              }} placeholder="Enter Category Order" style={{ margin: "15px 0 0" }} />

              <div className='text-center mt-5 mb-1' >
                <Button variant="contained" className={styles.acceptCta} onClick={() => AddCategory(detailPopup)}   >{typeof detailPopup == "string" ? "Update" : "Save"}</Button>

              </div>

              <div>

              </div>
            </div>
          }
        />

        <CCardBody>



          <CommonModal
            show={showDeletePopup}
            setShow={setShowDeletePopup}
            bodyContent={
              <div className='text-center' >
                <ImBin style={{ fontSize: "30px", color: "#d21313" }} />
                <p className='mt-2 fs-5' >Are you sure, you want to delete this category ?</p>
                <div className={styles.modalConCta} >
                  <Button variant="contained" className={styles.acceptCta} onClick={() => DeleteCat(showDeletePopup)}  >Yes</Button>
                  <Button className={styles.rejectCta} variant="outlined" onClick={() => setShowDeletePopup("")} >No</Button>
                </div>

                <div>

                </div>
              </div>
            }
          />

          <CustomTable rows={rows} header={!show ? ["No", "Category Name", "Category Image", "Action"] : ["No.", "Category Name", "Category Image"]} page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} tableContent={
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
                  <TableCell align="center">
                    {row?.name}
                  </TableCell>
                  <TableCell align="center" className='p-0' >
                    <img src={addBaseUrl(row?.image)} style={{ width: "70px" }} />
                  </TableCell>

                  {!show && <TableCell align="center">
                    <div className={styles.actionCta} >
                      <BiEdit style={{ fontSize: "30px", color: "var(--curoaid-cyan-dark)", cursor: "pointer" }} onClick={() => {
                        setDetailPopup(row?._id)
                        setCategoryName(row?.name)
                        setSelectedImg(row?.image)
                        setCategoryOrder(row?.order)
                      }} />
                      <ImBin style={{ fontSize: "28px", color: "#d21313", cursor: "pointer" }} onClick={() => setShowDeletePopup(row?._id)} />

                      <Switch {...label} color={"error"} checked={row?.is_blocked == 0 ? false : true} onClick={() => BlockUser(row?.is_blocked == 0 ? 1 : 0, row?._id)} />
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