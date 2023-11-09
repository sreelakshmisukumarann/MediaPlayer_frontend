import React, { useEffect } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { addCategory, deleteCategory, deleteHistory, getAllCategory, getVideo, updateCategory } from '../services/allAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Row,Col } from 'react-bootstrap';
import VideoCard from './VideoCard';

function Category() {
  const [show, setShow] = useState(false);
  const [categoryName , setCategoryName] = useState({})
  const [allCategory, setAllCategory] = useState([])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //function to add category
  const handleAddCategory = async()=>{
    console.log(categoryName);

    if(categoryName){
      let body = {
        categoryName,
        allVideos: []
      }
      //make api call
      const response = await addCategory(body)
      console.log(response);

      if(response.status>=200 && response.status<300){
        toast.success('Category succussdully  added')
        setCategoryName("")
      }
      else{
        console.log(response);
        toast.warning('Something went wrong ! please agin later')
      }
    }
  }

  //function to get all category
  const getallCategory = async()=>{
    const {data} = await getAllCategory()
    // console.log(data);
    setAllCategory(data)
  }
  console.log(allCategory);

  //dragover eventlistner
  const dragover = (e)=>{
    //this will prevent reload so that the data that we send from videocard.jsx wont be loast
    e.preventDefault()
    console.log('inside dragover');
  }

  //ondrop
  const videoDrop = async(e,categoryId)=>{
    console.log(`dropped inside the categoryid ${categoryId}`);
    //to get the videoid that is send from videocard component
    const videoid = e.dataTransfer.getData("videoID")
    console.log(videoid);

    //api to get the particular video that is draged
    const {data} = await getVideo(videoid)
    console.log(data);

    //to find a perticular category with the specified id
    let seletedCategory = allCategory?.find((item)=>item.id===categoryId)
    console.log(seletedCategory);

    //data is added to the allvideos array in the particular category
    seletedCategory.allVideos.push(data)
    console.log(seletedCategory);

    await updateCategory(categoryId,seletedCategory)
    getallCategory()
    
  }

   //function to delete category
   const handleDelete = async(id)=>{
    await deleteCategory(id)
    getallCategory()
  }

  useEffect(()=>{
    getallCategory()
  },[])


  return (
    <>
        <div className='d-grid ms-3'>
            <button onClick={handleShow} className='btn btn-warning'>Add New Cetegory</button>
        </div>

       { allCategory?.length>0?
       allCategory?.map((item)=>(<div className='m-5 border border-secondary rounded p-3' droppable onDragOver={(e)=>dragover(e)} onDrop={(e)=>videoDrop(e,item?.id)}>
          <div className='d-flex justify-content-between align-items-center'></div>
          <h6>{item.categoryName}</h6>
          <button onClick={()=>handleDelete(item?.id)} className='btn btn-danger'><i class="fa-solid fa-trash-can"></i></button>

          <div>
            <Row>
              <Col sm={12}>
                {
                  item.allVideos?.length>0?
                  item.allVideos.map((card)=>(<VideoCard displayVideo={card}/>))
                  :<p>Nothing to display</p>
                }

              </Col>
            </Row>
          </div>
        </div>))
        : <p>Nothing to display</p>
        }

        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title><i class="fa-solid fa-pencil text-warning"></i> Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         
         <form className='border border-secondary rounded p-3' action="">
                
                
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Category Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Cetegory Name" onChange={(e)=>setCategoryName(e.target.value)} />
                </Form.Group>
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="warning" onClick={handleAddCategory}>Add</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position='top-center' theme='colored' autoClose='2000'/>
    </>
  )
}

export default Category