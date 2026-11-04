import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, ButtonBase, TableBody, TableCell, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTable from 'src/components/common/table'
import api from 'src/utils/api'
import { createData } from 'src/utils/common'
import Switch from '@mui/material/Switch'
import { toast } from 'react-toastify'
import { ImBin } from 'react-icons/im'
import { BiEdit } from 'react-icons/bi'
import styles from './style.module.css'
import CommonModal from 'src/components/common/modal'
import FilePicker from 'src/components/common/imageUploader'
import SimpleInput from 'src/components/common/simpleInput'
import { AiOutlineSearch } from 'react-icons/ai'
import UploadImg from 'src/assets/images/upload.png'

function Index({ show }) {
   const [allUsers, setAllUsers] = useState([])
   const [page, setPage] = useState(0)
   const [rowsPerPage, setRowsPerPage] = useState(5)
   const [refresh, setRefresh] = useState(0)
   const [editCategory, setEditCategory] = useState('')
   const [detailPopup, setDetailPopup] = useState(false)
   const [selectedImg, setSelectedImg] = useState()
   const [categoryName, setCategoryName] = useState('')
   const [showDeletePopup, setShowDeletePopup] = useState('')
   const [searchKey, setSearchKey] = useState('')

   console.log(allUsers, 'allCity')
   console.log(selectedImg, 'selectedImg')
   console.log(detailPopup, 'detailPopup')
   console.log(show, 'showAll')

   useEffect(() => {
      getAllUsers()
   }, [refresh])

   function getAllUsers() {
      api.get('listCity')
         .then((result) => {
            console.log(result, 'getAllUsers')
            setAllUsers(result?.data?.map((v, i) => ({ ...v, newId: i })))
         })
         .catch((err) => {
            console.log(err)
         })
   }

   useEffect(() => {
      if (!detailPopup) {
         setSelectedImg()
         setCategoryName('')
      }
   }, [detailPopup])

   const rows = allUsers
   const label = { inputProps: { 'aria-label': 'Color switch demo' } }

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

   function DeleteCat(id) {
      api.post('deleteCity', {
         id: id,
      })
         .then((result) => {
            toast.success(result?.message)
            setRefresh(refresh + 1)
            setShowDeletePopup('')
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }

   function AddCategory(detailPopup) {
      console.log(typeof detailPopup == 'string', 'checkVal')

      if (!categoryName) {
         toast.error('City Name is compulsory')
         return
      }

      typeof detailPopup != 'string'
         ? api
              .post('addCity', {
                 name: categoryName,
              })
              .then((result) => {
                 toast.success(result?.message)
                 setRefresh(refresh + 1)
                 setDetailPopup(false)
                 setCategoryName('')
              })
              .catch((err) => {
                 toast.error(err?.message)
              })
         : api
              .post('editCity', {
                 name: categoryName,
                 id: detailPopup,
              })
              .then((result) => {
                 toast.success(result?.message)
                 setRefresh(refresh + 1)
                 setDetailPopup(false)
                 setCategoryName('')
              })
              .catch((err) => {
                 toast.error(err?.message)
              })
   }

   return (
      <div>
         <div className="bdc-container-content">
            <h1 className="bdc-item">City Management</h1>
            <div>
               <div style={{ display: 'inline-block', marginRight: '20px' }}>
                  <AiOutlineSearch className={styles.searchIcon} />
                  <input
                     type="text"
                     placeholder="Search"
                     className={styles.searchInput}
                     value={searchKey}
                     onChange={(e) => {
                        setSearchKey(e.target.value)
                     }}
                  />
               </div>
               {!show && (
                  <Button
                     variant="contained"
                     className={styles.acceptCta}
                     onClick={() => setDetailPopup(true)}
                  >
                     Add City
                  </Button>
               )}
            </div>
         </div>

         <CCard>
            <CommonModal
               show={detailPopup}
               setShow={setDetailPopup}
               title={typeof detailPopup == 'string' ? 'Edit City' : 'Add City'}
               bodyContent={
                  <div>
                     <SimpleInput
                        title="City Name"
                        required
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter Category Name"
                        style={{ margin: '15px 0 0' }}
                     />
                     <div className="text-center mt-5 mb-1">
                        <Button
                           variant="contained"
                           className={styles.acceptCta}
                           onClick={() => AddCategory(detailPopup)}
                        >
                           {typeof detailPopup == 'string' ? 'Update' : 'Save'}
                        </Button>
                     </div>

                     <div></div>
                  </div>
               }
            />

            <CCardBody>
               <CommonModal
                  show={showDeletePopup}
                  setShow={setShowDeletePopup}
                  bodyContent={
                     <div className="text-center">
                        <ImBin style={{ fontSize: '30px', color: '#d21313' }} />
                        <p className="mt-2 fs-5">Are you sure, you want to delete this city ?</p>
                        <div className={styles.modalConCta}>
                           <Button
                              variant="contained"
                              className={styles.acceptCta}
                              onClick={() => DeleteCat(showDeletePopup)}
                           >
                              Yes
                           </Button>
                           <Button
                              className={styles.rejectCta}
                              variant="outlined"
                              onClick={() => setShowDeletePopup('')}
                           >
                              No
                           </Button>
                        </div>

                        <div></div>
                     </div>
                  }
               />

               <CustomTable
                  rows={rows}
                  header={!show ? ['No.', 'City Name', 'Action'] : ['No.', 'City Name']}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setPage={setPage}
                  setRowsPerPage={setRowsPerPage}
                  tableContent={
                     <TableBody>
                        {(rowsPerPage > 0
                           ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                           : rows
                        )
                           .filter(
                              (row) =>
                                 !searchKey.length ||
                                 row.name
                                    .toString()
                                    .toLowerCase()
                                    .includes(searchKey.toString().toLowerCase()),
                           )
                           .map((row, i) => {
                              console.log(Object.keys(row), 'row')
                              return (
                                 <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                       {row?.newId + 1}
                                    </TableCell>
                                    <TableCell align="center">{row?.name}</TableCell>

                                    {!show && (
                                       <TableCell align="center">
                                          <div className={styles.actionCta}>
                                             <BiEdit
                                                style={{
                                                   fontSize: '30px',
                                                   color: 'var(--curoaid-cyan-dark)',
                                                   cursor: 'pointer',
                                                }}
                                                onClick={() => {
                                                   setDetailPopup(row?._id)
                                                   setCategoryName(row?.name)
                                                }}
                                             />
                                             <ImBin
                                                style={{
                                                   fontSize: '28px',
                                                   color: '#d21313',
                                                   cursor: 'pointer',
                                                }}
                                                onClick={() => setShowDeletePopup(row?._id)}
                                             />
                                          </div>
                                       </TableCell>
                                    )}
                                 </TableRow>
                              )
                           })}

                        {emptyRows > 0 && (
                           <TableRow style={{ height: 53 * emptyRows }}>
                              <TableCell colSpan={6} />
                           </TableRow>
                        )}
                     </TableBody>
                  }
               />
            </CCardBody>
         </CCard>
      </div>
   )
}

export default Index
