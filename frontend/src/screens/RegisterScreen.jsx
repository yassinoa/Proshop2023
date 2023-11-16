import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate} from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import{useRegisterMutation} from '../slices/usersApiSlice'
import{setCredentials} from '../slices/authSlice'
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';


const RegisterScreen = () => {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')
  const dispatch= useDispatch()
  const navigate=useNavigate()
  const [register,{isLoading}]=useRegisterMutation()
  const {userInfo}= useSelector((state)=>state.auth)
  
  const {search}= useLocation()
  const sp=new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(()=>{
    if (userInfo){
      navigate(redirect)
    }
  },[userInfo,redirect,navigate])

  const submitHandler=async(e)=>{
    e.preventDefault()
    if (password!==confirmpassword){
      toast.error("Password Not match")
    }else{
      try {
        const res=await register({name ,email,password}).unwrap()
        console.log(res)
        dispatch(setCredentials({...res}))
        navigate(redirect)
        toast.success("LOGIN SUCCES")
      } catch (err) {
        toast.error(err?.data?.message || err?.error)
      }
    }
  }
  return (
    <FormContainer>
      <h1>Sign Up</h1>  

      <Form onSubmit={submitHandler}>
      <Form.Group controlId='name' className='my-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' placeholder='Enter your name' value={name} onChange={(e)=>setName(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Adress</Form.Label>
          <Form.Control type='email' placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Enter your password' value={password} onChange={(e)=>setPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type='password' placeholder='Enter your password' value={confirmpassword} onChange={(e)=>setConfirmPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-3' disabled={isLoading}>
          Register
        </Button>
        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
        Already have an account ? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>

    </FormContainer>
  )
}

export default RegisterScreen