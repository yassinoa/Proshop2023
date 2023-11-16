import { Button, Col, Row, Table } from 'react-bootstrap'
import { FaEdit, FaTrash }from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import {  useDeleteProductMutation, useGetProductsQuery } from '../../slices/productApiSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import {toast} from 'react-toastify'
import { Link, useParams } from 'react-router-dom'
import Paginate from '../../components/Paginate'
const ProductListScreenn = () => {
  const {pageNumber}=useParams()
  const {data,isLoading,error,refetch}=useGetProductsQuery({pageNumber})

  const [deleteProduct,{isLoading:loadingDelete}]=useDeleteProductMutation()
  const deleteHandler=async(id)=>{
    if(window.confirm('Are you sure ?')){
      try {
        await deleteProduct(id)
        toast.success('Product Deleted')
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }
  // const createProductHandler=async()=>{
  //   if(window.confirm('Are you sure you want to create a new product')){
  //     try{
  //       await createProduct()
  //       refetch()
  //     }catch(err){
  //       toast.error(err?.data?.message|| err.error)
  //     }
  //   }
  // }
  return ( 
    <>
    <Row className='align-items-center'>
      <Col>
        <h1>Products</h1> 
      </Col>
      <Col className='text-end'>
      <Link to='/admin/product/add' className='btn btn-light my-3'>
        {/* <Button className='btn-sm m-3' onClick={navigate('/product/add')} > */}
          <FaEdit /> Create Product
        </Link>
      </Col>
    </Row>

    {loadingDelete && <Loader />}
    {isLoading ? <Loader/> :error? <Message variant='danger'>{error}</Message> :(
      <>
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product)=>(
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm mx-2'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button variant='danger' className='btn-sm' onClick={()=>deleteHandler(product._id) }>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate page={data.page} pages={data.pages} isAdmin={true}/>
      </>
    ) }
    </>
  )
}

export default ProductListScreenn