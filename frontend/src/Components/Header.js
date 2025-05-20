import React from 'react';
import { Edit, LogOut } from 'lucide-react'; // Ensure you're using lucide-react or adjust if not

const Header = ({ handleLogout }) => {
  return (
    <header>
      <div className="container-fluid">
        <div className="row py-3 border-bottom">
          <div className="col-sm-4 col-lg-3 text-center text-sm-start">
            <div className="main-logo">
              <a href="/">
                <img src="./styles/images/logo.png" alt="logo" className="img-fluid" />
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
                <form id="search-form" className="text-center" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent"
                    placeholder="Search for more than 20,000 products"
                  />
                </form>
              </div>
              <div className="col-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"
                  />
                </svg>
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
              <li>
                <a href="/newPost" className="rounded-circle bg-light p-2 mx-1">
                  <Edit width={24} height={24} />
                </a>
              </li>
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                <a className="rounded-circle bg-light p-2 mx-1">
                  <LogOut width={24} height={24} />
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
        <div className="row py-3">
          <div
            className="d-flex justify-content-sm-between align-items-center"
            style={{ marginLeft: '200px' }}
          >
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

                <div className="offcanvas-body">
                  <select className="filter-categories border-0 mb-0 me-5">
                    <option>Shop by ABC</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>

                  <ul className="navbar-nav justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                    {[
                      'Category?',
                      'Category?',
                      'Category?',
                      'Category?',
                      'Brand?',
                      'Category?',
                      'Category?',
                      'Blog?',
                    ].map((item, index) => (
                      <li key={index} className="nav-item">
                        <a href="#" className="nav-link">{item}</a>
                      </li>
                    ))}

                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        role="button"
                        id="pages"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Brand?
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="pages">
                        {[
                          'About Us',
                          'Shop',
                          'Single Product',
                          'Cart',
                          'Checkout',
                          'Blog',
                          'Single Post',
                          'Styles',
                          'Contact',
                          'Thank You',
                          'My Account',
                          '404 Error',
                        ].map((page, idx) => (
                          <li key={idx}>
                            <a href="/" className="dropdown-item">
                              {page}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
