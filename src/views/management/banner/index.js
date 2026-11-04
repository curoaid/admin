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
   const [bannerLink, setBannerLink] = useState('')
   const [showDeletePopup, setShowDeletePopup] = useState('')
   const [searchKey, setSearchKey] = useState('')
   const [provider, setProvider] = useState(1)

   console.log(allUsers, 'allUsers')
   console.log(selectedImg, 'selectedImg')
   console.log(detailPopup, 'detailPopup')
   console.log(show, 'show')

   useEffect(() => {
      getAllUsers()
   }, [refresh, searchKey])

   function getAllUsers() {
      api.get('getBanner', {
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

   useEffect(() => {
      if (!detailPopup) {
         setSelectedImg()
         setCategoryName('')
         setBannerLink('')
      }
   }, [detailPopup])

   function BlockUser(block, id) {
      api.post('updateBannerStatus', {
         status: block.toString(),
         bannerId: id,
      })
         .then((result) => {
            toast.success(result?.message)
            setRefresh(refresh + 1)
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }

   const rows = allUsers.filter((ele) => {
      if (provider == 1) {
         return ele?.type == 'Web'
      } else {
         return ele?.type == 'mobile'
      }
   })
   console.log('total rows are--', allUsers)
   const label = { inputProps: { 'aria-label': 'Color switch demo' } }

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

   function DeleteCat(id) {
      api.post('removeBanner', {
         bannerId: id,
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

   const addBaseUrl = (url) => {
      if (!url) return url
      const baseUrl = 'http://52.66.187.242:3001/'
      const s3Pattern = /^https?:\/\/.*\.s3\..*amazonaws\.com\/.*/

      if (url.startsWith('https')) {
         return url
      }

      return `${baseUrl}${url}`
   }

   function AddCategory(detailPopup) {
      console.log(typeof detailPopup == 'string', 'checkVal')

      let alphaVal = /^[a-zA-Z ]*$/g

      if (!selectedImg || !categoryName) {
         toast.error('Banner name and Banner image are required to fill')
         return
      }

      if (!alphaVal.test(categoryName)) {
         toast.error('Only alphabets are allowed in name')
         return
      }

      typeof detailPopup != 'string'
         ? api
              .post('addBanner', {
                 image: selectedImg,
                 title: categoryName,
                 link: bannerLink,
                 type: provider == 1 ? 'Web' : 'mobile',
              })
              .then((result) => {
                 toast.success(result?.message)
                 setRefresh(refresh + 1)
                 setDetailPopup(false)
                 setSelectedImg()
                 setCategoryName('')
                 setBannerLink('')
              })
              .catch((err) => {
                 toast.error(err?.message)
              })
         : api
              .post('editBanner', {
                 image: selectedImg,
                 title: categoryName,
                 link: bannerLink,
                 bannerId: detailPopup,
                 type: provider == 1 ? 'Web' : 'mobile',
              })
              .then((result) => {
                 toast.success(result?.message)
                 setRefresh(refresh + 1)
                 setDetailPopup(false)
                 setSelectedImg()
                 setCategoryName('')
                 setBannerLink('')
              })
              .catch((err) => {
                 toast.error(err?.message)
              })
   }

   return (
      <div>
         <div className="bdc-container-content">
            <h1 className="bdc-item">Banner Management</h1>

            <div className={styles.firstContainer}>
               <div style={{ display: 'inline-block' }}>
                  <AiOutlineSearch className="searchIcon" />
                  <input
                     type="text"
                     placeholder="Search"
                     className="searchInput"
                     value={searchKey}
                     onChange={(e) => {
                        setSearchKey(e.target.value)
                     }}
                  />
               </div>
               <div
                  className={provider === 1 ? styles.selected : styles.unselected}
                  onClick={() => {
                     setPage(0)
                     setProvider(1)
                  }}
               >
                  Website
               </div>
               <div
                  className={provider === 2 ? styles.selected : styles.unselected}
                  onClick={() => {
                     setPage(0)
                     setProvider(2)
                  }}
               >
                  Mobile
               </div>
            </div>
         </div>

         <CCard>
            <CommonModal
               show={detailPopup}
               setShow={setDetailPopup}
               title={typeof detailPopup == 'string' ? 'Edit Banner' : 'Add Banner'}
               bodyContent={
                  <div>
                     <FilePicker
                        onGetUrl={(url) => setSelectedImg(url)}
                        imageUrl={selectedImg ? selectedImg : UploadImg}
                        bodyWidth="150px"
                        bodyHeight="150px"
                     />
                     <SimpleInput
                        title="Banner Name"
                        required
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter Banner Name"
                        style={{ margin: '15px 0 0' }}
                     />
                     <SimpleInput
                        title="Banner Link"
                        required
                        value={addBaseUrl(bannerLink)}
                        onChange={(e) => setBannerLink(e.target.value)}
                        placeholder="Enter Banner Link"
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
               <div className="d-flex justify-content-between align-items-center mx-3 mb-4 mt-2">
                  <div></div>

                  {!show && (
                     <Button
                        variant="contained"
                        className={styles.acceptCta}
                        onClick={() => setDetailPopup(true)}
                     >
                        Add Banner
                     </Button>
                  )}
               </div>

               <CommonModal
                  show={showDeletePopup}
                  setShow={setShowDeletePopup}
                  bodyContent={
                     <div className="text-center">
                        <ImBin style={{ fontSize: '30px', color: '#d21313' }} />
                        <p className="mt-2 fs-5">Are you sure, you want to delete this banner ?</p>
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
                        ? ['No.', 'Banner Name', 'Banner Image', 'Banner Link', 'Action']
                        : ['No.', 'Banner Name', 'Banner Image']
                  }
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setPage={setPage}
                  setRowsPerPage={setRowsPerPage}
                  tableContent={
                     <TableBody>
                        
                        {(rowsPerPage > 0? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): rows) .filter((i) => {
                              if (provider == 1) {
                                 return i?.type == 'Web'
                              } else {
                                 return i?.type == 'mobile'
                              }
                           })
                           .filter(
                              (row) =>
                                 !searchKey.length ||
                                 row.title
                                    .toString()
                                    .toLowerCase()
                                    .includes(searchKey.toString().toLowerCase()),
                           )
                           .map((row, i) => {
                              console.log(Object.keys(row), 'row')
                              return (
                                 <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                       {i + 1}
                                    </TableCell>
                                    <TableCell align="center">{row?.title}</TableCell>
                                    <TableCell align="center" className="p-0">
                                       <img
                                          src={`${addBaseUrl(row?.image)}`}
                                          style={{ width: '70px' }}
                                       />
                                    </TableCell>
                                    <TableCell align="center">
                                       {row.link ? row.link : 'No link available'}
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
                                                   setDetailPopup(row?._id)
                                                   setCategoryName(row?.title)
                                                   setBannerLink(row?.link)
                                                   setSelectedImg(row?.image)
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

                                             <Switch
                                                {...label}
                                                color={'success'}
                                                checked={row?.isActive == 0 ? false : true}
                                                onClick={() =>
                                                   BlockUser(row?.isActive == 0 ? 1 : 0, row?._id)
                                                }
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
