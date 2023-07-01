import {Container,Col,Row}from 'react-bootstrap'

const Footer = () => {
  const current= new Date().getFullYear()
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <p>Proshop &copy; {current} </p>
          </Col>
        </Row>
        </Container>  
    </footer>
  )
}

export default Footer