import {
   Box,
   Button,
   ButtonBase,
   Pagination,
   TableBody,
   TableContainer,
   TableHead,
   TableCell,
   Table,
   Paper,
   TableRow,
   Typography,
   Modal,
} from '@mui/material'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import CustomTable from 'src/components/common/table'
import Switch from '@mui/material/Switch'
import { ImBin } from 'react-icons/im'
import { BiEdit } from 'react-icons/bi'
import styles from './style.module.css'
import CommonModal from 'src/components/common/modal'
import FilePicker from 'src/components/common/imageUploader'
import SimpleInput from 'src/components/common/simpleInput'
import { AiOutlineSearch } from 'react-icons/ai'
import RichTextEditor from 'react-rte'

import api from 'src/utils/api'
import { toast } from 'react-toastify'
import UploadImg from 'src/assets/images/upload.png'
// import { ModalBody, ModalDialog } from 'react-bootstrap'

const Index = () => {
   const [refresh, setRefresh] = useState(0)
   const [del, setDel] = useState()
   const [detailPopup, setDetailPopup] = useState()
   const [blogName, setBlogName] = useState('')
   const [imageUrl, setImageUrl] = useState('')
   const [slug, setSlug] = useState()
   const [state, setState] = useState({
      blogContent: RichTextEditor.createValueFromString('', 'html'),
   })
   const [category, setCategory] = useState('');
   const [metaTitle, setMetaTitle] = useState("");
   const [metaDescription, setMetaDescription] = useState("");
   const [metaKeywords, setMetaKeywords] = useState("");

   const [faqList, setFaqList] = useState([])
   const [value, setValue] = useState([])
   const [blogs, setBlogs] = useState([])
   const [searchKey, setSearchKey] = useState('')
   const [errors, setErrors] = useState({})

   const [howToSteps, setHowToSteps] = useState([
      { name: "", text: "" }
   ]);
   const categoryOptions = [
      "Physiotherapy",
      "Home Doctor",
      "Veterinary Doctor",
      "Nursing Care",
      "Wound Care",
      "Diagnostic Blood",
      "Yoga classes",
      "Elder Care",
      "Caregiver",
      "Health Checkup",
      "General",
      "Health Tips",
      "Patient Stories",
      "Medical Research",
      "Case studies",
      "Others",

     
   ];

   // Rating Schema
   const [ratingSchema, setRatingSchema] = useState({
      name: "",
      description: "",
      ratingValue: "",
      ratingCount: ""
   });
   const isEditMode = typeof detailPopup === 'string'


   const saveDraft = () => {
      if (isEditMode) return; // only for new blogs
      const draftData = {
         blogName,
         imageUrl,
         slug,
         blogContent: state.blogContent.toString('html'),
         metaTitle,
         metaDescription,
         metaKeywords,
         faqList,
         howToSteps,
         ratingSchema,
         category,
      };

      localStorage.setItem("BLOG_DRAFT", JSON.stringify(draftData));
   };
   useEffect(() => {
      if (detailPopup) {
         saveDraft();
      }
   }, [
      blogName,
      imageUrl,
      slug,
      state.blogContent,
      metaTitle,
      metaDescription,
      metaKeywords,
      faqList,
      howToSteps,
      ratingSchema,
      category,
   ]);

   const validateForm = () => {
      const newErrors = {}

      const blogContentHtml = state.blogContent?.toString?.('html') || ''
      if (!blogName.trim()) newErrors.blogName = 'Blog name is required.'
      if (!slug.trim()) newErrors.slug = 'Blog link is required.'
      if (!blogContentHtml.trim() || blogContentHtml === '<p><br></p>') {
         newErrors.blogContent = 'Blog content is required.'
      }
      if (!category) newErrors.category = 'Category is required.'
      if (!imageUrl || imageUrl === UploadImg) newErrors.imageUrl = 'Blog image is required.'

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }
   const handleSubmit = async () => {
      if (!validateForm()) return

      try {
         if (isEditMode) {
            await editBlog({ blogName, slug, blogContent: state.blogContent, imageUrl, category })

         } else {
            await createBlog({ blogName, slug, blogContent: state.blogContent, imageUrl, category })
            await getBlogs() // Wait for blogs to refresh
         }
      } catch (error) {
         console.error('Submission failed:', error)
      }
   }

   // const handleSubmit = () => {
   //    if (!validateForm()) return

   //    if (isEditMode) {
   //       editBlog({ blogName, slug, blogContent: state.blogContent, imageUrl })
   //       getBlogs()
   //    } else {
   //       createBlog({ blogName, slug, blogContent: state.blogContent, imageUrl })
   //       getBlogs()
   //    }

   //    // getBlogs()
   //    // close modal
   // }

   // Function to paginate the blogs array
   // This function takes an array and a page size, and returns an array of pages
   const paginate = (array, pageSize) => {
      const pageCount = Math.ceil(array.length / pageSize)
      return Array.from({ length: pageCount }, (_, index) =>
         array.slice(index * pageSize, (index + 1) * pageSize),
      )
   }

   const pageSize = 10
   const paginatedPosts = paginate(blogs, pageSize)
   const [currentPage, setCurrentPage] = useState(1)
   const currentPosts = paginatedPosts[currentPage - 1]
   

   console.log(imageUrl, 'imageUrl')
   const filteredPosts = currentPosts?.filter(
      (post) =>
         post.title?.toLowerCase().includes(searchKey.toLowerCase()) ||
         post.slug?.toLowerCase().includes(searchKey.toLowerCase()),
   )

   const generateSlug = (text) => {
      return text
         .toString()
         .toLowerCase()
         .trim()
         .replace(/[\s\W-]+/g, '-') // replace spaces and non-word characters with hyphens
   }

   const createBlog = () => {
      const generatedSlug = generateSlug(slug) // generate slug from blogName

      const blogData = {
         title: blogName,
         imageUrl: imageUrl,
         content: state.blogContent.toString('html'),
         slug: generatedSlug,
         category: category,
         date: new Date().toISOString().split('T')[0],
         metaTitle,
         metaDescription,
         metaKeywords,
         faqList,
         howToSteps,
         ratingSchema
      }

      setValue([...value, blogData])

      console.log('Blog Created:', blogData)

      // Reset all form fields
      setSlug('')
      setBlogName('')
      setImageUrl('')
      setMetaTitle('')
      setMetaDescription('')
      setMetaKeywords('')
      setFaqList([{ question: "", answer: "" }]);
      setHowToSteps([{ name: "", text: "" }]);
      setRatingSchema({})
      setState({
         blogContent: RichTextEditor.createValueFromString('', 'html'),
      })
      setCategory('');
      setDetailPopup(false)
      api.post('addBlog', blogData)
         .then((result) => {
            toast.success(result?.message)
            localStorage.removeItem("BLOG_DRAFT");
            console.log('Blog created successfully:', result)
            // Optionally, you can refresh the blog list or perform other actions here
            // Refresh the blog list after creating a new blog
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }

   const editBlog = () => {
      const generatedSlug = generateSlug(slug) // generate slug from blogName}
      const blogData = {
         blogId: detailPopup, // Assuming detailPopup contains the blog ID when editing
         title: blogName,
         imageUrl: imageUrl,
         content: state.blogContent.toString('html'),
         slug: generatedSlug,
         category: category,
         date: new Date().toISOString().split('T')[0],
         metaTitle,
         metaDescription,
         metaKeywords,
         faqList,
         howToSteps,
         ratingSchema
      }

      api.post('editBlog', blogData)
         .then((result) => {
            toast.success(result?.message)
            console.log('Blog updated successfully:', result)
            // Optionally, you can refresh the blog list or perform other actions here
            // Refresh the blog list after creating a new blog
            setDetailPopup(false)
            getBlogs()
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }
   const getBlogs = () => {
      api.get('getBlog')
         .then((result) => {
            result?.data && setBlogs(result?.data)
            // toast.success(result?.message)
            console.log('Blogs fetched successfully:', result?.data)
         })
         .catch((err) => {
            err?.message && toast.error(err?.message)
         })
   }

   const delBlog = (id) => {
      api.post('delblog', { blogId: id })
         .then((result) => {
            toast.success(result?.message)
            console.log('Blog deleted successfully:', result)
            setDel(false)
            getBlogs()
         })
         .catch((err) => {
            toast.error(err?.message)
            console.log('Error deleting blog:', err)
         })
   }

   const blogStatus = (id, status) => {
      api.post('updateBlogStatus', {
         blogId: id,
         status: status,
      })
         .then((result) => {
            toast.success(result?.message)
            console.log('Blog status updated successfully:', result)
            getBlogs()
         })
         .catch((err) => {
            toast.error(err?.message)
            console.log('Error updating blog status:', err)
         })
   }

   // Fetch blogs on component mount

   useEffect(() => {
      getBlogs()
   }, [])


   return (
      <>
         <div>
            <div className="bdc-container-content">
               <h1 className="bdc-item">Blog Management</h1>
               <div className="firstContainer">
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
               </div>
            </div>

            <CCard>
               <CCardBody>
                  <div className="d-flex justify-content-between align-items-center mx-3 mb-4 mt-2">
                     <div></div>
                     <Button
                        variant="contained"
                        className={styles.acceptCta}
                        onClick={() => {
                           setDetailPopup(true);

                           const draft = localStorage.getItem("BLOG_DRAFT");

                           if (draft) {
                              const data = JSON.parse(draft);

                              setBlogName(data.blogName || "");
                              setImageUrl(data.imageUrl || "");
                              setSlug(data.slug || "");
                              setMetaTitle(data.metaTitle || "");
                              setMetaDescription(data.metaDescription || "");
                              setMetaKeywords(data.metaKeywords || "");
                              setFaqList(data.faqList || []);
                              setHowToSteps(data.howToSteps || [{ name: "", text: "" }]);
                              setRatingSchema(data.ratingSchema || {});
                              setCategory(data.category || '');
                              setState({
                                 blogContent: RichTextEditor.createValueFromString(
                                    data.blogContent || "",
                                    "html"
                                 ),
                              });
                           } else {
                              // Fresh blog
                              setBlogName("");
                              setImageUrl("");
                              setSlug("");
                              setFaqList([]);
                              setHowToSteps([{ name: "", text: "" }]);
                              setRatingSchema({});
                              setCategory('');
                              setState({
                                 blogContent: RichTextEditor.createValueFromString("", "html"),
                              });
                           }
                        }}

                     >
                        Add Blog
                     </Button>
                  </div>

                  {/* Delete Confirmation Modal */}
                  <CommonModal
                     show={del}
                     setShow={setDel}
                     bodyContent={
                        <div className="text-center">
                           <ImBin style={{ fontSize: '30px', color: '#d21313' }} />
                           <p className="mt-2 fs-5">Are you sure, you want to delete this Blog?</p>
                           <div className="modalConCta">
                              <Button
                                 variant="contained"
                                 className="acceptCta"
                                 onClick={() => delBlog(del)}
                              >
                                 Yes
                              </Button>
                              <Button
                                 variant="outlined"
                                 className="rejectCta"
                                 onClick={() => setDel(false)}
                              >
                                 No
                              </Button>
                           </div>
                        </div>
                     }
                  />

                  <TableContainer component={Paper}>
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell align="center">No</TableCell>
                              <TableCell align="center">Date</TableCell>
                              <TableCell align="center">Image</TableCell>
                              <TableCell align="center">Title</TableCell>
                              <TableCell align="center">Slug</TableCell>
                              <TableCell align="center">Actions</TableCell>
                           </TableRow>
                        </TableHead>

                        <TableBody>
                           {filteredPosts &&
                              filteredPosts.map((post, index) => (
                                 <TableRow key={index}>
                                    <TableCell align="center text-black">{index + 1}</TableCell>
                                    <TableCell align="center  text-black">{post.date}</TableCell>
                                    <TableCell align="center" className="p-0">
                                       <img
                                          src={post.imageUrl}
                                          style={{ width: '70px' }}
                                          alt="Blog"
                                       />
                                    </TableCell>
                                    <TableCell
                                       align="center"
                                       sx={{
                                          maxWidth: 200,
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                       }}
                                    >
                                       {post.title?.split(' ').slice(0, 15).join(' ')}
                                       {post.title?.split(' ').length > 15 ? '…' : ''}
                                    </TableCell>

                                    <TableCell
                                       align="center"
                                       sx={{
                                          maxWidth: 200,
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                       }}
                                    >
                                       {post.slug}
                                       {/* {post.slug?.split(' ').slice(0, 15).join(' ')}
                                       {post.slug?.split(' ').length > 15 ? '…' : ''} */}
                                    </TableCell>

                                    <TableCell align="center">
                                       <div
                                          className="actionCta"
                                          style={{
                                             display: 'flex',
                                             gap: '10px',
                                             justifyContent: 'center',
                                          }}
                                       >
                                          <BiEdit
                                             style={{
                                                fontSize: '24px',
                                                color: 'var(--curoaid-cyan-dark)',
                                                cursor: 'pointer',
                                             }}
                                             onClick={() => {
                                                setDetailPopup(post?._id, true)
                                                setBlogName(post?.title)
                                                setImageUrl(post?.imageUrl)
                                                setSlug(post?.slug)
                                                setFaqList(post?.faqList)
                                                setHowToSteps(post?.howToSteps)
                                                setRatingSchema(post?.ratingSchema)
                                                setMetaTitle(post?.metaTitle || "");
                                                setMetaDescription(post?.metaDescription || "");
                                                setMetaKeywords(post?.metaKeywords || "");
                                                setCategory(post?.category || '');
                                                setState({
                                                   blogContent:
                                                      RichTextEditor.createValueFromString(
                                                         post?.content,
                                                         'html',
                                                      ),
                                                })
                                             }}
                                          />
                                           <ImBin
                                             style={{
                                                fontSize: '22px',
                                                color: '#d21313',
                                                cursor: 'pointer',
                                             }}
                                             onClick={() => setDel(post?._id)}
                                          /> 
                                          <Switch
                                             color="success"
                                             checked={post?.isActive === true}
                                             onClick={() => blogStatus(post?._id, !post?.isActive)}
                                          />
                                       </div>
                                    </TableCell>
                                 </TableRow>
                              ))}
                        </TableBody>
                     </Table>
                  </TableContainer>
                  {paginatedPosts.length > 1 && (
                     <Box m={2} display="flex" justifyContent="center">
                        <Pagination
                           count={paginatedPosts.length}
                           page={currentPage}
                           onChange={(_, newPage) => setCurrentPage(newPage)}
                        />
                     </Box>
                  )}
               </CCardBody>
            </CCard>

            <CommonModal
               show={detailPopup}
               setShow={(val) => {
                  if (!val) saveDraft(); // closing
                  setDetailPopup(val);
               }} title={isEditMode ? 'Edit Blog' : 'Add Blog'}
               size="xl"
               bodyContent={
                  <div style={{ width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                     <div>
                        <Typography className="text-center fw-bold">Blog Image</Typography>
                        <br />
                        <FilePicker
                           onGetUrl={(url) => setImageUrl(url)}
                           imageUrl={imageUrl ? imageUrl : UploadImg}
                           bodyWidth="150px"
                           bodyHeight="150px"
                        />
                        {errors.imageUrl && <p style={{ color: 'red' }}>{errors.imageUrl}</p>}
                        <SimpleInput
                           title="Blog Name"
                           required
                           value={blogName}
                           onChange={(e) => setBlogName(e.target.value)}
                           placeholder="Enter Blog Name"
                           style={{ margin: '15px 0 0' }}
                        />
                        {errors.blogName && <p style={{ color: 'red' }}>{errors.blogName}</p>}
                        <SimpleInput
                           title="Blog Link"
                           required
                           placeholder="Enter Blog Link"
                           value={slug}
                           onChange={(e) => setSlug(e.target.value)}
                        />
                        {errors.slug && <p style={{ color: 'red' }}>{errors.slug}</p>}
                        <div style={{ marginTop: "15px" }}>
                           <Typography variant="subtitle1" fontWeight="bold">
                              Category *
                           </Typography>

                           <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              style={{
                                 width: "100%",
                                 padding: "12px",
                                 borderRadius: "6px",
                                 border: "1px solid #ccc",
                                 marginTop: "5px"
                              }}
                           >
                              <option value="">Select Category</option>

                              {categoryOptions.map((item) => (
                                 <option key={item} value={item}>
                                    {item}
                                 </option>
                              ))}
                           </select>
                        </div>
                        {errors.category && <p style={{ color: 'red' }}>{errors.category}</p>}
                        <Typography className="text-center fw-bold">Blog Content</Typography>
                        {errors.blogContent && <p style={{ color: 'red' }}>{errors.blogContent}</p>}
                        <RichTextEditor
                           value={state.blogContent}
                           onChange={(value) => setState({ ...state, blogContent: value })}
                           placeholder="Write your blog content here..."
                           editorStyle={{ height: '15rem' }}
                        />
                        <Typography className="text-center fw-bold mt-4">Meta Section</Typography>
                        <SimpleInput
                           title="Meta Title"
                           value={metaTitle}
                           onChange={(e) => setMetaTitle(e.target.value)}
                           placeholder="Enter Meta Title"
                        />
                        <SimpleInput
                           title="Meta Description"
                           value={metaDescription}
                           onChange={(e) => setMetaDescription(e.target.value)}
                           placeholder="Enter Meta Description"
                        />
                        <SimpleInput
                           title="Meta Keywords"
                           value={metaKeywords}
                           onChange={(e) => setMetaKeywords(e.target.value)}
                           placeholder="keyword1, keyword2, keyword3"
                        />
                        <Typography className="text-center fw-bold mt-4">FAQ Section</Typography>
                        {faqList.map((faq, index) => (
                           <div key={index} style={{ padding: "10px", border: "1px solid #ddd", marginTop: 10, borderRadius: 8 }}>
                              <SimpleInput
                                 title={`Question ${index + 1}`}
                                 value={faq.question}
                                 onChange={(e) => {
                                    const updated = [...faqList];
                                    updated[index].question = e.target.value;
                                    setFaqList(updated);
                                 }}
                                 placeholder="Enter FAQ question"
                              />
                              <SimpleInput
                                 title={`Answer ${index + 1}`}
                                 value={faq.answer}
                                 onChange={(e) => {
                                    const updated = [...faqList];
                                    updated[index].answer = e.target.value;
                                    setFaqList(updated);
                                 }}
                                 placeholder="Enter FAQ answer"
                                 style={{ marginTop: 5 }}
                              />
                              {faqList.length > 0 && (
                                 <Button
                                    variant="outlined"
                                    color="error"
                                    style={{ marginTop: 10 }}
                                    onClick={() => {
                                       const updated = faqList.filter((_, i) => i !== index);

                                       setFaqList(updated);
                                    }}
                                 >
                                    Remove FAQ
                                 </Button>
                              )}
                           </div>
                        ))}
                        <Button
                           variant="contained"
                           style={{ background: "#3a524eff", marginTop: 10 }}
                           onClick={() => setFaqList([...faqList, { question: "", answer: "" },], console.log("faqlist", faqList))}
                        >
                           {faqList.length === 0 ? "+ Add FAQ" : "+ Add More FAQ"}
                        </Button>


                        <Typography className="text-center fw-bold mt-4">How To Schema</Typography>

                        {howToSteps.map((step, index) => (
                           <div key={index} style={{ padding: 10, border: "1px solid #ddd", marginTop: 10, borderRadius: 8 }}>
                              <SimpleInput
                                 title={`Step ${index + 1} Title`}
                                 value={step.name}
                                 onChange={(e) => {
                                    const updated = [...howToSteps];
                                    updated[index].name = e.target.value;
                                    setHowToSteps(updated);
                                 }}
                                 placeholder="Enter step title"
                              />

                              <SimpleInput
                                 title={`Step ${index + 1} Description`}
                                 value={step.text}
                                 onChange={(e) => {
                                    const updated = [...howToSteps];
                                    updated[index].text = e.target.value;
                                    setHowToSteps(updated);
                                 }}
                                 placeholder="Explain this step"
                                 style={{ marginTop: 5 }}
                              />

                              <Button
                                 variant="outlined"
                                 color="error"
                                 style={{ marginTop: 10 }}
                                 onClick={() => setHowToSteps(howToSteps.filter((_, i) => i !== index))}
                              >
                                 Remove Step
                              </Button>
                           </div>
                        ))}

                        <Button
                           variant="contained"
                           style={{ background: "#3a524eff", marginTop: 10 }}
                           onClick={() => setHowToSteps([...howToSteps, { name: "", text: "" }])}
                        >
                           + Add Step
                        </Button>
                        <Typography className="text-center fw-bold mt-4">Rating Schema</Typography>

                        <SimpleInput
                           title="Rating Name"
                           value={ratingSchema.name}
                           onChange={(e) => setRatingSchema({ ...ratingSchema, name: e.target.value })}
                           placeholder="Eg: Blog Rating"
                        />

                        <SimpleInput
                           title="Rating Description"
                           value={ratingSchema.description}
                           onChange={(e) => setRatingSchema({ ...ratingSchema, description: e.target.value })}
                           placeholder="Eg: User feedback rating"
                        />

                        <SimpleInput
                           title="Rating Value (1 to 5)"
                           type="number"
                           value={ratingSchema.ratingValue}
                           onChange={(e) => {
                              let value = parseFloat(e.target.value);

                              if (isNaN(value)) {
                                 setRatingSchema({ ...ratingSchema, ratingValue: "" });
                                 return;
                              }

                              // Clamp between 1 and 5
                              if (value < 1) value = 1;
                              if (value > 5) value = 5;

                              setRatingSchema({
                                 ...ratingSchema,
                                 ratingValue: value
                              });
                           }}
                           inputProps={{
                              min: 1,
                              max: 5,
                              step: 0.1
                           }} placeholder="4.5"
                           onKeyDown={(e) => {
                              if (["e", "E", "+", "-"].includes(e.key)) {
                                 e.preventDefault();
                              }
                           }}
                        />

                        <SimpleInput
                           title="Rating Count"
                           type="number"
                           value={ratingSchema.ratingCount}
                           onChange={(e) => setRatingSchema({ ...ratingSchema, ratingCount: e.target.value })}
                           placeholder="120"
                        />


                        <div className="text-center mt-5 mb-1">
                           <Button className={styles.acceptCta} onClick={handleSubmit}>
                              {isEditMode ? 'Update Blog' : 'Save Blog'}
                           </Button>
                        </div>
                     </div>
                  </div>
               }
            />
         </div>
      </>

   )
}

export default Index;
