import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { uploadAllVideo } from '../services/allAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Add({setUploadVideoStatus}) {
  

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [video, setVideos]= useState({
      id:"",
      caption:"",
      url:"",
      embedLink:""
    })
    // console.log(video);

    const embedVideoLink = (e)=>{
      const {value} = e.target
      // console.log(value.slice(-11));
      const link = `https://www.youtube.com/embed/${value.slice(-11)}`
      setVideos({...video,embedLink:link})
    }
    console.log(video);

    const handleUpload = async ()=>{
      const {id,caption,url,embedLink} = video
      if(!id || !caption || !url || !embedLink){
        toast.warning('Please fill the form completely')
      }
      else{
        const response = await uploadAllVideo(video)
        console.log(response);
        if(response.status>=200 && response.status<300){
          toast.success(`${response.data.caption} is succussfully uploaded`)

          //to change the value of uploadvideostatus
          setUploadVideoStatus(response.data)
          //MAKING THE STATE value none
          setVideos({
            id:"",
            caption:"",
            url:"",
            embedLink:""
          })
          //to close the model
          handleClose()
        }
        else{
          console.log(response);
          toast.error('Something went wrong,Try Again!..')
        }
      }
    }

  return (
    <>
        <div className='d-flex align-items-center'>
            <h5>Upload New Video</h5>
            <button onClick={handleShow} className='btn'><i class="fa-solid fa-cloud-arrow-up fa-5"></i></button>
        </div>

        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title><i class="fa-solid fa-film me-2 text-warning"></i>Upload Videos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Please fill the form</p>

            <form className='border border-secondary rounded p-3' action="">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Enter Video ID" name='id' onChange={(e)=>setVideos({...video,id:e.target.value})} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Enter Video Caption" name='caption' onChange={(e)=>setVideos({...video,caption:e.target.value})} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Enter Video Image Url" name='url' onChange={(e)=>setVideos({...video,url:e.target.value})} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Enter Video Link" name='embedLink' onChange={embedVideoLink} />
                </Form.Group>
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="warning" onClick={handleUpload}>Upload</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position='top-center' theme='colored' autoClose='2000'/>
    </>
  )
}

export default Add

//<iframe width="782" height="440" src="https://www.youtube.com/embed/-BjZmE2gtdo" title="Taylor Swift - Lover (Official Music Video)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>