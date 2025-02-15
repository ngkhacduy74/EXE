import React from 'react';
import { Container, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(to bottom, #2c3e50, #4ca1af)',
        color: '#fff',
        padding: '40px 0',
        marginTop: '40px',
      }}
    >
      <Container>
        <Row className="mb-5">
          <Col md={3} sm={12} className="text-center text-md-start">
            <h4 className="fw-bold">WisdomWell</h4>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              Connecting people, ideas, and opportunities around the world.
            </p>
          </Col>

          <Col md={3} sm={6}>
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ListGroup variant="flush">
              {['Home', 'About Us', 'Services', 'Contact'].map((item, idx) => (
                <ListGroup.Item
                  key={idx}
                  action
                  style={{
                    backgroundColor: 'transparent',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  {item}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          <Col md={3} sm={6}>
            <h5 className="fw-bold mb-3">Contact</h5>
            <ListGroup variant="flush">
              <ListGroup.Item
                style={{ backgroundColor: 'transparent', color: '#fff', border: 'none' }}
              >
                Email: info@example.com
              </ListGroup.Item>
              <ListGroup.Item
                style={{ backgroundColor: 'transparent', color: '#fff', border: 'none' }}
              >
                Phone: +123 456 789
              </ListGroup.Item>
              <ListGroup.Item
                style={{ backgroundColor: 'transparent', color: '#fff', border: 'none' }}
              >
                Address: 123 Main St, City, Country
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3} sm={12} className="text-center text-md-start">
            <h5 className="fw-bold mb-3">Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, idx) => (
                <Badge
                  key={idx}
                  as="a"
                  className="m-2"
                  style={{
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    color: '#2c3e50',
                    borderRadius: '50%',
                    padding: '10px',
                    transition: 'transform 0.3s, background-color 0.3s',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Icon />
                </Badge>
              ))}
            </div>
          </Col>
        </Row>

        <Row className="text-center mt-4">
          <Col>
            <p style={{ fontSize: '0.9rem' }}>
              © 2024 WisdomWell. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
