import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateProductMutation, useUploadProductImageMutation } from '../../slices/productApiSlice'
import { Button, Form, Spinner } from 'react-bootstrap'
import FormContainer, {}from '../../components/FormContainer'
import { toast } from 'react-toastify'

const ProductAddScreen = () => {
  
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [createProduct,{isLoading:loadingCreate}]=useCreateProductMutation()
  const [uploadProductImage,{isLoading:loadingUpload}]=useUploadProductImageMutation()
  const navigate=useNavigate()


  const submitHandler=async(e)=>{
    e.preventDefault()
    const createdProduct={name,price,image,brand,category,countInStock,description}
    const result=await createProduct(createdProduct)
    if(result.error){
      toast(result.error)
    }else{
      toast.success('Product created')
      navigate('/admin/productlist')
    }
  }
  const uploadFileHandler=async(e)=>{
    const formData= new FormData()
    formData.append('image',e.target.files[0])
    try{
      const res =await uploadProductImage(formData).unwrap()
      toast.success(res.message)
      setImage(res.image)
    }catch(err){
      toast.error(err?.data?.message || err.error)
    }
  }
  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>

        <h1>Create Produt</h1>
            <Form onSubmit={submitHandler}>
                  <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='name' placeholder='Enter name' value={name}
                      onChange={(e)=>setName(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='price'className='my-2'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type='number' placeholder='Enter price' value={price}
                      onChange={(e)=>setPrice(e.target.value)}></Form.Control>
                  </Form.Group>
                  
                  <Form.Group controlId='image' className='my-2'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control type='text' placeholder='your image' value={image} style={{display: image===""&&"none"}}
                      onChange={(e)=>setImage}></Form.Control>
                    <Form.Control type='file' label='chose file' onChange={uploadFileHandler}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='brand' className='my-2'>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control type='text' placeholder='Enter brand' value={brand}
                      onChange={(e)=>setBrand(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='countInStock'>
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control type='number' placeholder='Enter countInStock' value={countInStock}
                      onChange={(e)=>setCountInStock(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='category'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control type='text' placeholder='Enter category' value={category}
                      onChange={(e)=>setCategory(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='description'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control type='text' placeholder='Enter description' value={description}
                      onChange={(e)=>setDescription(e.target.value)}></Form.Control>
                  </Form.Group>

                  <Button type='submit' variant='primary' className='my-2' 
                  disabled=
                  {loadingUpload&& 
                  'none'
                  }
                  >
                    {loadingCreate ?(<Spinner/>):('Submit')}
                  </Button>
                </Form>
              
      </FormContainer>
    </>
  )
}

export default ProductAddScreen