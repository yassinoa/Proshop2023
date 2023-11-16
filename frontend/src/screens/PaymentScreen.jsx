import { Button, Col, Form } from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps'
import FormContainer from '../components/FormContainer'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../slices/cartSlice'


const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('YassinExpress')
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const cart=useSelector((state)=>state.cart)
  const {shippingAdress}=cart
  useEffect(()=>{
    if(!shippingAdress){
      navigate('/shipping')
    }
  },[shippingAdress,navigate])

  const submitHandler=(e)=>{
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }
  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as='legend'>Select Method</Form.Label>
            <Col>
              <Form.Check type='radio' className='my-2' label="Yassin Express" id='YassinExpress' name='paymentMethod' value='YassinExpress' checked
                          onChange={(e)=>setPaymentMethod(e.target.value)}></Form.Check>
            </Col>
          </Form.Group>
          <Button type='submit' variant='primary'>Continue</Button>
        </Form>
      </FormContainer>
  )
}

export default PaymentScreen