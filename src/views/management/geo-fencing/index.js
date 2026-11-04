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
import { AiFillEye, AiOutlineSearch } from 'react-icons/ai'
import UploadImg from 'src/assets/images/upload.png'
import SimpleSelect from 'src/components/common/select'
import DrawOnMap from 'src/components/polygon'
import Map from 'src/components/polygon/map'
import { Autocomplete } from '@react-google-maps/api'

function Index({ show }) {
   const [allUsers, setAllUsers] = useState([])
   const [page, setPage] = useState(0)
   const [rowsPerPage, setRowsPerPage] = useState(5)
   const [refresh, setRefresh] = useState(0)

   const [detailPopup, setDetailPopup] = useState(false)
   const [details, setDetails] = useState({
      category: '',
      region: '',
      location: [
         { lat: 20.593684, lng: 78.96288 },
         { lat: 20.603684, lng: 78.10288 },
         { lat: 20.583684, lng: 78.86288 },
      ],
      postalCode: '',
      pinCode: '',
      locationId: '',
   })
   const [showDeletePopup, setShowDeletePopup] = useState('')
   const [searchKey, setSearchKey] = useState('')
   const [categoryArray, setCategoryArray] = useState([])
   const [viewMap, setViewMap] = useState(false)
   const [disable, setDisable] = useState(false)

   console.log(allUsers, 'allUsers')

   console.log(details, 'details')
   console.log(details?.location, 'geoLocation')

   useEffect(() => {
      getAllUsers()
   }, [refresh, searchKey])

   useEffect(() => {
      SerCat()
   }, [])

   function getAllUsers() {
      api.post('getLocation', {
         search: searchKey,
      })
         .then((result) => {
            console.log(result, 'getAllUsers')

            setAllUsers(result?.data)
         })
         .catch((err) => {
            console.log(err)
         })
   }

   const rows = allUsers

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

   function DeleteCat(id) {
      api.post('removeLocation', {
         locationId: id,
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

   useEffect(() => {
      if (!detailPopup) {
         setDetails({
            category: '',
            region: '',
            location: [
               { lat: 20.593684, lng: 78.96288 },
               { lat: 21.593684, lng: 79.96288 },
               { lat: 22.593684, lng: 80.96288 },
            ],
            postalCode: '',
            locationId: '',
            pinCode: '',
         })
      }
   }, [detailPopup])

   useEffect(() => {
      if (!viewMap) {
         setDetails({
            category: '',
            region: '',
            location: [
               { lat: 20.593684, lng: 78.96288 },
               { lat: 21.593684, lng: 79.96288 },
               { lat: 22.593684, lng: 80.96288 },
            ],
            postalCode: '',
            locationId: '',
            pinCode: '',
         })
      }
   }, [viewMap])

   function SerCat() {
      api.get('getAllCategory')
         .then((result) => {
            setCategoryArray(result?.response)
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }

   function selectArray(initial, array) {
      let optionsArray = [{ key: initial, value: {} }]
      array?.map((item) => {
         return optionsArray.push({ key: item?.name, value: item?._id })
      })

      return optionsArray
   }

   function submitDetails() {
      console.log(!(details?.pinCode || details?.postalCode), 'testCond')
      if (!details?.category || !details?.region || !(details?.pinCode || details?.postalCode)) {
         toast.error('All Fields are required to fill')
         return
      }

      if (typeof detailPopup == 'string') {
         api.post('updateLocation', details)
            .then((result) => {
               toast.success(result?.message)
               setRefresh(refresh + 1)
               setDetailPopup(false)
            })
            .catch((err) => {
               toast.error(err?.message)
            })
      } else {
         api.post('addLocation', {
            category: details?.category,
            location: details?.location,
            postalCode: details?.postalCode,
            region: details?.region,
            pinCode: details?.pinCode,
         })
            .then((result) => {
               toast.success(result?.message)
               setRefresh(refresh + 1)
               setDetailPopup(false)
            })
            .catch((err) => {
               toast.error(err?.message)
            })
      }
   }

   return (
      <div>
         <div className="bdc-container-content">
            <h1 className="bdc-item">GeoFencing Management</h1>
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
                     Add New Region
                  </Button>
               )}
            </div>
         </div>

         <CCard>
            <CommonModal
               show={detailPopup}
               setShow={setDetailPopup}
               title={typeof detailPopup == 'string' ? 'Edit Region' : 'Add Region'}
               bodyContent={
                  <div>
                     <SimpleSelect
                        required
                        style={{ marginBottom: '10px' }}
                        options={selectArray('Select Category', categoryArray)}
                        value={details?.category}
                        onChange={(e) => setDetails({ ...details, category: e.target.value })}
                        name="category"
                        title="Category"
                     />

                     <SimpleInput
                        required
                        title="PinCode"
                        placeholder="Enter pincode"
                        name="pinCode"
                        value={details?.postalCode ? details?.postalCode : details?.pinCode}
                        onChange={(e) => setDetails({ ...details, pinCode: e.target.value })}
                        style={{ marginBottom: '30px' }}
                     />

                     <DrawOnMap
                        details={details}
                        setRegion={(value) => setDetails({ ...details, region: value })}
                        setLocation={(value) => setDetails({ ...details, location: value })}
                        gotPostalCode={(value) => setDetails({ ...details, postalCode: value })}
                     />

                     <div className="text-center mt-5 mb-1">
                        <Button
                           variant="contained"
                           className={styles.acceptCta}
                           onClick={submitDetails}
                        >
                           {typeof detailPopup == 'string' ? 'Update' : 'Save'}
                        </Button>
                     </div>

                     <div></div>
                  </div>
               }
            />

            <CommonModal
               show={viewMap}
               setShow={setViewMap}
               title={'View Map'}
               bodyContent={
                  <div>
                     <DrawOnMap
                        disable={disable}
                        setDisable={setDisable}
                        details={details}
                        setRegion={(value) => setDetails({ ...details, region: value })}
                        setLocation={(value) => setDetails({ ...details, location: value })}
                        gotPostalCode={(value) => setDetails({ ...details, postalCode: value })}
                     />
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
                        <p className="mt-2 fs-5">Are you sure, you want to delete this ?</p>
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
                  header={
                     !show
                        ? [
                             'No.',
                             'Main Category',
                             'Region Name',
                             'Region Postal Code',
                             'Map View',
                             'Action',
                          ]
                        : ['No.', 'Main Category', 'Region Name', 'Region Postal Code', 'Map View']
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
                                 <TableCell component="th" scope="row">
                                    {i + 1}
                                 </TableCell>
                                 <TableCell align="center">
                                    {row?.category ? row?.category?.name : 'test'}
                                 </TableCell>

                                 <TableCell align="center">{row?.region || 'test'}</TableCell>
                                 <TableCell align="center">
                                    {row?.postalCode || row?.pinCode}
                                 </TableCell>
                                 <TableCell align="center">
                                    <AiFillEye
                                       style={{
                                          fontSize: '20px',
                                          color: 'black',
                                          cursor: 'pointer',
                                       }}
                                       onClick={() => {
                                          setDetails({
                                             category: row?.category?._id,
                                             location: row?.locations,
                                             locationId: row?._id,
                                             postalCode: row?.postalCode,
                                             pinCode: row?.pinCode,
                                             region: row?.region,
                                          })
                                          setDisable(true)
                                          setViewMap(true)
                                       }}
                                    />
                                 </TableCell>

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
                                                setDetails({
                                                   category: row?.category?._id,
                                                   location: row?.locations,
                                                   locationId: row?._id,
                                                   postalCode: row?.postalCode,
                                                   pinCode: row?.pinCode,
                                                   region: row?.region,
                                                })
                                                setDetailPopup(row?._id)
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
