import {  useState } from 'react';
import {  useNavigate} from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAdress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';


const ShippingScreen = () => {
  const cart =useSelector((state)=>state.cart)
  const {shippingAdress}=cart
  const [adress, setAdress] = useState(shippingAdress?.adress || '')
  const [city, setCity] = useState(shippingAdress?.city || '')
  const [postalCode, setPostalCode] = useState(shippingAdress?.postalCode || '')
  const [country, setCountry] = useState(shippingAdress?.country || '')
  
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const submitHandler=(e)=>{
    e.preventDefault()
    dispatch(saveShippingAdress({adress,city,postalCode,country}))
    navigate('/payment')
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='adress' className='my-2'>
          <Form.Label>Adress</Form.Label>
          <Form.Control type='text' placeholder='Enter adress' value={adress} onChange={(e)=>setAdress(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='city' className='my-2'>
          <Form.Label>City</Form.Label>
          <Form.Control type='text' placeholder='Enter city' value={city} onChange={(e)=>setCity(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='postalCode' className='my-2'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control type='text' placeholder='Enter postal code' value={postalCode} onChange={(e)=>setPostalCode(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='country' className='my-2'>
          <Form.Label>Country</Form.Label>
          <Form.Control type='text' placeholder='Enter country' value={country} onChange={(e)=>setCountry(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-2'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen