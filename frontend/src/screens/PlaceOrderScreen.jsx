import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import  { toast } from "react-toastify"
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice';
import Message from '../components/Message';

const PlaceOrderScreen = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch()
  const cart=useSelector((state)=>state.cart)
  const [createOrder,{error}]=useCreateOrderMutation()
  useEffect(()=>{
    console.log(cart.shippingAdress)
    if(!cart.shippingAdress.adress){
      navigate('/shipping')
    }else if(!cart.paymentMethod){
      navigate('/payment')      
    }
  },[cart.paymentMethod,cart.shippingAdress,navigate])

  const placeOrderHandler=async()=>{
    try{
      
      const res=await createOrder({
        orderItems:cart.cartItems,
        shippingAdress:cart.shippingAdress,
        paymentMethod:cart.paymentMethod,
        itemsPrice:cart.itemsPrice,
        shippingPrice:cart.shippingPrice,
        taxPrice:cart.taxPrice,
        totalPrice:cart.totalPrice,
      }).unwrap()
      dispatch(clearCartItems())
      navigate(`/order/${res._id}`)
    }catch(error){
      toast.error(error)
    }
  }
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Adress:</strong>
                {cart.shippingAdress.adress},{cart.shippingAdress.city} {' '}
                {cart.shippingAdress.postalCode},{' '} {cart.shippingAdress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method : </strong>
              {cart.paymentMethod}
              
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length===0 ? (
                <Message>Your cart is empty</Message>
              ):(
                 <ListGroup variant='flush'>
                  {cart.cartItems.map((item,index)=>(
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                         <Link to={`/product/${item._id}`}>
                          {item.name}
                         </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X ${item.price}= {Number(item.qty * item.price).toFixed(2)}
                          {/* ${item.qty * item.price} */}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                 </ListGroup> 
              )}
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
                  <Col>Items :</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>shipping :</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax :</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total :</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
                {error&& 
              <ListGroup.Item>
                <Message variant='danger'>{error}</Message>
              </ListGroup.Item>}
              <ListGroup.Item>
                <Button type='button' className='btn-block'
                        disabled={cart.cartItems.length===0} onClick={placeOrderHandler}>
                          Place Order
                        </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen