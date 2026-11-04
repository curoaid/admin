import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, TableBody, TableCell, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTable from 'src/components/common/table'
import api from 'src/utils/api'
import { createData } from 'src/utils/common'
import Switch from '@mui/material/Switch'
import { toast } from 'react-toastify'
import { BiEdit } from 'react-icons/bi'
import { ImBin } from 'react-icons/im'
import styles from './style.module.css'
import { AiFillEye, AiOutlineSearch } from 'react-icons/ai'
import { FiSend } from 'react-icons/fi'
import CommonModal from 'src/components/common/modal'
import SubDetails from './subDetails'

function Index({ show }) {
   const [allUsers, setAllUsers] = useState([])
   const [page, setPage] = useState(0)
   const [rowsPerPage, setRowsPerPage] = useState(5)
   const [refresh, setRefresh] = useState(0)
   const [showDeletePopup, setShowDeletePopup] = useState('')
   const [viewDetail, setViewDetail] = useState(false)
   const [subArray, setSubArray] = useState([])
   const [addSub, setAddSub] = useState(false)
   const [moduleArray, setModuleArray] = useState([])
   const [searchKey, setSearchKey] = useState('')
   const [prefillValues, setPrefillValues] = useState({
      name: '',
      email: '',
      password: '',
      address: '',
      country_code: '',
      mobile_number: '',
      adminId: '',
      accessModule: [],
   })

   console.log(allUsers, 'allUsers')
   console.log(moduleArray, 'moduleArray')
   console.log(subArray, 'subArray')
   console.log(prefillValues, 'prefillValues')

   useEffect(() => {
      getAllUsers()
      SubModule()
   }, [refresh, searchKey])

   useEffect(() => {
      if (!addSub) {
         setPrefillValues({
            name: '',
            email: '',
            password: '',
            address: '',
            country_code: '',
            mobile_number: '',
            adminId: '',
            accessModule: [],
         })
      }
   }, [addSub])

   function getAllUsers() {
      api.post('getSubAdminList', {
         search: searchKey,
      })
         .then((result) => {
            console.log(result, 'getAllUsers')

            setAllUsers(result?.data?.map((v, i) => ({ ...v, newId: i })))
         })
         .catch((err) => {
            console.log(err)
         })
   }

   const rows = allUsers
   const label = { inputProps: { 'aria-label': 'Color switch demo' } }

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

   function DeleteSub(id) {
      api.post('removeSubAdmin', {
         adminId: id,
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

   function SubModule() {
      api.get('getModule')
         .then((result) => {
            setModuleArray(result?.data)
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }

   function SendCred(id) {
      api.post('sendCredentials', {
         subAdminId: id,
      })
         .then((result) => {
            toast.success(result?.message)
            setRefresh(refresh + 1)
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }

   return (
      <div>
         <div className="bdc-container-content">
            <h1 className="bdc-item">Sub Admin Management</h1>
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
                     onClick={() => setAddSub(true)}
                  >
                     Add Sub Admin
                  </Button>
               )}
            </div>
         </div>

         <CCard>
            <CommonModal
               show={showDeletePopup}
               setShow={setShowDeletePopup}
               bodyContent={
                  <div className="text-center">
                     <ImBin style={{ fontSize: '30px', color: '#d21313' }} />
                     <p className="mt-2 fs-5">Are you sure, you want to delete this ?</p>
                     <div className={styles.modalConCta}>
                        <Button
                           variant="contained"
                           className={styles.acceptCta}
                           onClick={() => DeleteSub(showDeletePopup)}
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

            <CommonModal
               show={addSub}
               setShow={setAddSub}
               title={prefillValues?.name ? 'Edit Sub Admin' : 'Add Sub Admin'}
               bodyContent={
                  <SubDetails
                     setAddSub={setAddSub}
                     refresh={refresh}
                     prefillValues={prefillValues}
                     setRefresh={setRefresh}
                     moduleArray={moduleArray}
                  />
               }
            />

            <CommonModal
               show={viewDetail}
               setShow={setViewDetail}
               title="Module"
               bodyContent={
                  <div className="text-center">
                     {subArray?.map((v) => {
                        return (
                           <div style={{ border: '1px solid grey', padding: '10px 0' }}>
                              {v?.title} {v?.access}
                           </div>
                        )
                     })}

                     <div></div>
                  </div>
               }
            />

            <CCardBody>
               <CustomTable
                  rows={rows}
                  header={
                     !show
                        ? [
                             'No.',
                             'Sub-Admin Name',
                             'Email Address',
                             'Mobile Number',
                             'View Modules',
                             'Send Credentials',
                             'Action',
                          ]
                        : [
                             'No.',
                             'Sub-Admin Name',
                             'Email Address',
                             'Mobile Number',
                             'View Modules',
                          ]
                  }
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setPage={setPage}
                  setRowsPerPage={setRowsPerPage}
                  tableContent={
                     <TableBody>
                        {(rowsPerPage > 0
                           ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                           : rows
                        ).map((row, i) => {
                           console.log(Object.keys(row), 'row')
                           return (
                              <TableRow key={i}>
                                 <TableCell component="th" scope="row" width="50px">
                                    {row?.newId + 1}
                                 </TableCell>
                                 <TableCell align="center" style={{ minWidth: '150px' }}>
                                    {row?.name}
                                 </TableCell>

                                 <TableCell align="center" style={{ minWidth: '150px' }}>
                                    {row?.email || 'N/A'}
                                 </TableCell>
                                 <TableCell align="center" style={{ minWidth: '150px' }}>
                                    {row?.mobile_number || ''}
                                 </TableCell>

                                 <TableCell align="center" style={{ minWidth: '150px' }}>
                                    <AiFillEye
                                       style={{
                                          fontSize: '20px',
                                          color: 'black',
                                          cursor: 'pointer',
                                       }}
                                       onClick={() => {
                                          setSubArray(row?.accessModule)
                                          setViewDetail(true)
                                       }}
                                    />
                                 </TableCell>
                                 {!show && (
                                    <TableCell align="center" style={{ minWidth: '150px' }}>
                                       <FiSend
                                          style={{
                                             fontSize: '20px',
                                             color: 'black',
                                             cursor: 'pointer',
                                          }}
                                          onClick={() => SendCred(row?._id)}
                                       />
                                    </TableCell>
                                 )}

                                 {!show && (
                                    <TableCell align="center" style={{ minWidth: '150px' }}>
                                       <div className={styles.actionCta}>
                                          <BiEdit
                                             style={{
                                                fontSize: '30px',
                                                color: 'var(--curoaid-cyan-dark)',
                                                cursor: 'pointer',
                                             }}
                                             onClick={() => {
                                                setAddSub(true)
                                                setPrefillValues({
                                                   adminId: row?._id,
                                                   name: row?.name,
                                                   email: row?.email,
                                                   password: row?.password,
                                                   address: row?.address,
                                                   country_code: row?.country_code,
                                                   mobile_number: row?.mobile_number,
                                                   accessModule: row?.accessModule,
                                                })
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
