import { Link, useParams }  from 'react-router-dom'
import {useGetOrderDetailsQuery, usePayOrderMutation,useDeliverOrderMutation} from '../slices/ordersApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {toast} from 'react-toastify'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const OrderScreen = () => {
  const {id:orderId}=useParams()
  const {data: order, refetch,isLoading,error}=useGetOrderDetailsQuery(orderId)
  // const [payOrder,{isLoading:loadingPay}]=usePayOrderMutation()
  const [payOrder]=usePayOrderMutation()

  const [deliverOrder,{isLoading:loadingDeliver}]= useDeliverOrderMutation()
  const {userInfo}=useSelector((state)=>state.auth)

  async function onApproveTest(){
    await payOrder(orderId)
    console.log(refetch(), 'reftch')
    refetch()
    toast.success('Payment successfull')
  }
  const deliverOrderHandler=async()=>{
    try{
      await deliverOrder(orderId)
      refetch()
      toast.success('Order delivered')
    }catch(err){
      toast.error(err?.data?.message || err.message)
    }
  }

  return isLoading 
    ? (<Loader/>)
    :error ? (<Message variant='danger'/>)
           :(
            <>
            <h1>Order{order._id}</h1>
            <Row>
              <Col md={8}>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                      <strong>Email : </strong>{order.user.email}
                    </p>
                    <p>
                      <strong>Adress : </strong>
                      {order.shippingAdress.adress},{order.shippingAdress.city}{' '}
                      {order.shippingAdress.postalCode}, {' '}
                      {order.shippingAdress.country}
                    </p>
                    {order.isDelivered ?(
                      <Message variant='success'>
                        Delivered on {order.deliveredAt}
                      </Message>
                    ):(
                      <Message variant='danger'>Not Delivered</Message>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                      <strong>Method: </strong>
                      {order.paymentMethod}
                    </p>
                    {order.isPaid ? (
                      <Message variant='success'>Payment On Delivery</Message>
                    ):(
                      <Message variant='danger'>Not Paid</Message>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.map((item,index)=>(
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} X ${item.price} = ${item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={4}>
                <Card>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h2>Order Summary</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>${order.itemsPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>${order.shippingPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Tax</Col>
                        <Col>${order.taxPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Total</Col>
                        <Col>${order.totalPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    <div>
                      <Button onClick={onApproveTest} style={{marginBottom:'10px'}}>Payment on Delivery</Button>
                      </div>
                      {loadingDeliver && <Loader/>}
                      {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered &&(
                        <ListGroup.Item>
                          <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                            Mark As Delivered
                          </Button>
                        </ListGroup.Item>
                      )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            </>
            )
}

export default OrderScreen