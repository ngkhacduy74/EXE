import React, { useEffect, useState } from 'react';
import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import NewPost from '../pages/NewPost';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [showAddPost, setShowAddPost] = useState(false);
  const handleShowAddPost = () => setShowAddPost(true);
  const handleCloseAddPost = () => setShowAddPost(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="position-fixed w-100" style={{ zIndex: 999, top: 0 }}>
        <Container>
          <Navbar.Brand style={{ cursor: 'pointer' }} href='/'>
            WisdomWell
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user ? (
                <>
                  <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/follower/${user.id}`)}>Your Feed</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/mypost/${user.id}`)}>My Posts</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/myfavorite/${user.id}`)}>My Favorite</Nav.Link>
                  <Nav.Link onClick={handleShowAddPost}>New Post</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/viewBlockedUsers/${user.id}`)}>View Blocked User</Nav.Link>
                  
                </>
              ) : (
                <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
              )}
            </Nav>

            <Nav>
              {user ? (
                <>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      variant="link"
                      className="d-flex align-items-center text-light"
                      style={{ textDecoration: 'none' }}
                    >
                      <img
                        src={`../images/${user.avatar}.png`}
                        alt="User avatar"
                        width="40"
                        height="40"
                        className="rounded-circle me-2"
                      />
                      {user.name}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => navigate(`/profile/${user.id}`)}>
                        <FaUserAlt className="me-2" />
                        Profile
                      </Dropdown.Item>
                      {user.roleId === 0 && (
                        <Dropdown.Item onClick={() => navigate('/setting')}>
                          <FaCog className="me-2" />
                          Setting
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" />
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Nav.Link onClick={() => navigate('/login')} className="d-flex align-items-center">
                  <FaSignInAlt className="me-2" />
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <NewPost show={showAddPost} handleClose={handleCloseAddPost} />
    </>
  );
}

export default Header;
