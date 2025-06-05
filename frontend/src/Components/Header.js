import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, LogOut, LogIn, Copy } from 'lucide-react';
import axios from 'axios';

function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (isLoggingOut) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');

        const userData = localStorage.getItem('user');
        let parsedUser = null;

        try {
          if (userData) {
            parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }

        if (parsedUser?.email) {
          try {
            const response = await axios.get(
              `http://localhost:4000/auth/getUserByEmail?email=${encodeURIComponent(parsedUser.email)}`
            );

            if (response.data && response.data.user) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
              handleLogout();
            }
          } catch (err) {
            console.error('Failed to fetch user by email:', err);
            if (err.response?.status === 401) {
              handleLogout();
            }
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [isLoggingOut, navigate]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/product-browser?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/product-browser');
    }
  };

  const handleSearchIconClick = () => {
    if (searchTerm.trim()) {
      navigate(`/product-browser?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/product-browser');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header>
      <div className="container-fluid">
        <div className="row py-3 border-bottom">
          <div className="col-sm-4 col-lg-3 text-center text-sm-start">
            <div className="main-logo">
              <a href="/">
                <img
                  src="../images/Logo.jpg"
                  alt="logo"
                  style={{ width: '50px', height: 'auto' }}
                />
              </a>
            </div>
          </div>

          <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
            <div className="search-bar row bg-light p-2 my-2 rounded-4">
              <div className="col-md-4 d-none d-md-block">
                <select className="form-select border-0 bg-transparent">
                  <option>All Product type</option>
                  <option>Brand new</option>
                  <option>Secondhand</option>
                  <option>On sale</option>
                </select>
              </div>
              <div className="col-11 col-md-7">
                <form id="search-form" className="text-center" onSubmit={handleSearch}>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent"
                    placeholder="Search for more than 20,000 products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
              <div className="col-1">
                <button
                  type="button"
                  className="btn p-0 border-0 bg-transparent"
                  onClick={handleSearchIconClick}
                  style={{ cursor: 'pointer' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="col-sm-8 col-lg-4 d-flex justify-content-end gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
            <ul className="d-flex justify-content-end list-unstyled m-0">
              <li>
                <a href="#" className="rounded-circle bg-light p-2 mx-1">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#user" />
                  </svg>
                </a>
              </li>
              {user && (
                <li>
                  <a href="/newPost" className="rounded-circle bg-light p-2 mx-1">
                    <Edit width={24} height={24} />
                  </a>
                </li>
              )}
              {user && (
                <li>
                  <a href="/compare-product" className="rounded-circle bg-light p-2 mx-1">
                    <Copy width={24} height={24} />
                  </a>
                </li>
              )}
              <li onClick={user ? handleLogout : () => navigate('/login')} style={{ cursor: 'pointer' }}>
                <a className="rounded-circle bg-light p-2 mx-1">
                  {user ? <LogOut width={24} height={24} /> : <LogIn width={24} height={24} />}
                </a>
              </li>
              <li className="d-lg-none">
                <a
                  href="#"
                  className="rounded-circle bg-light p-2 mx-1"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasCart"
                  aria-controls="offcanvasCart"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#cart" />
                  </svg>
                </a>
              </li>
              <li className="d-lg-none">
                <a
                  href="#"
                  className="rounded-circle bg-light p-2 mx-1"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasSearch"
                  aria-controls="offcanvasSearch"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#search" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="d-flex justify-content-sm-between align-items-center">
          <nav className="main-menu d-flex navbar navbar-expand-lg">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
            >
              <div className="offcanvas-header justify-content-center">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;