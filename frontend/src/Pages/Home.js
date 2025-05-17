import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './styles/style.css'; // Adjust path if needed
import './styles/vendor.css'; // Adjust path if needed
import CategoryCarousel from '../Components/CategoryCarousel';
import BrandCarousel from '../Components/BrandCarousel';
import ProductsCarousel from '../Components/ProductCarousel';
import BestSellingCarousel from '../Components/BestSellingCarousel';
import BlogCarousel from '../Components/BlogCarousel';
import RecommendTagCarousel from '../Components/RecommendTagCarousel';
import Footer from '../Components/Footer';
import Chat from '../Components/Chat';
const Home = () => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value; // Assuming input has name="search"
    console.log('Search query:', query);
    // Add your search logic here (e.g., navigate to a search results page)

  };



  return (
    <HelmetProvider>
      <div style={{ overflowX: 'hidden', paddingLeft: '10px', paddingRight: '10px' }}>
        <Helmet>
          <title>Vinsaky Shop</title>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="author" content="" />
          <meta name="keywords" content="" />
          <meta name="description" content="" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
            crossOrigin="anonymous"
          />
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
            crossOrigin="anonymous"
          ></script>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        {/* Cart Offcanvas */}
        <div
          className="offcanvas offcanvas-end"
          data-bs-scroll="true"
          tabIndex="-1"
          id="offcanvasCart"
          aria-labelledby="offcanvasCartLabel"
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
            <div className="order-md-last">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Your cart</span>
                <span className="badge bg-primary rounded-pill">3</span>
              </h4>
              <ul className="list-group mb-3">
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Growers cider</h6>
                    <small className="text-body-secondary">Brief description</small>
                  </div>
                  <span className="text-body-secondary">$12</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Fresh grapes</h6>
                    <small className="text-body-secondary">Brief description</small>
                  </div>
                  <span className="text-body-secondary">$8</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Heinz tomato ketchup</h6>
                    <small className="text-body-secondary">Brief description</small>
                  </div>
                  <span className="text-body-secondary">$5</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total (USD)</span>
                  <strong>$20</strong>
                </li>
              </ul>
              <button
                className="w-100 btn btn-primary btn-lg"
                type="button"
                onClick={() => alert('Proceeding to checkout...')}
              >
                Continue to checkout
              </button>
            </div>
          </div>
        </div>

        {/* Search Offcanvas */}
        <div
          className="offcanvas offcanvas-end"
          data-bs-scroll="true"
          tabIndex="-1"
          id="offcanvasSearch"
          aria-labelledby="offcanvasSearchLabel"
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
            <div className="order-md-last">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Search</span>
              </h4>
              <form
                role="search"
                onSubmit={handleSearchSubmit}
                className="d-flex mt-3 gap-0"
              >
                <input
                  className="form-control rounded-start rounded-0 bg-light"
                  type="text" // Changed from "email" to "text" for search
                  name="search"
                  placeholder="What are you looking for?"
                  aria-label="What are you looking for?"
                />
                <button
                  className="btn btn-dark rounded-end rounded-0"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

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
                    <a href="#" className="rounded-circle bg-light p-2 mx-1">
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <use href="#heart" />
                      </svg>
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

                <div className="cart text-end d-none d-lg-block dropdown">
                  <button
                    className="border-0 bg-transparent d-flex flex-column gap-2 lh-1"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart"
                  >
                    <span className="fs-6 text-muted dropdown-toggle">Your Cart</span>
                    <span className="cart-total fs-5 fw-bold">$1290.00</span>
                  </button>
                </div>
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
                        <li className="nav-item active">
                          <a href="#Category?" className="nav-link">
                            Category?
                          </a>
                        </li>
                        <li className="nav-item dropdown">
                          <a href="#men" className="nav-link">
                            Category?
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="#kids" className="nav-link">
                            Category?
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="#accessories" className="nav-link">
                            Category?
                          </a>
                        </li>
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
                            <li>
                              <a href="/" className="dropdown-item">
                                About Us
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                Shop
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                Single Product
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                Cart
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                Checkout
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                Blog
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                Single Post
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                Styles
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                Contact
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                Thank You
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                My Account
                              </a>
                            </li>
                            <li>
                              <a href="/" className="dropdown-item">
                                404 Error
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item">
                          <a href="#brand" className="nav-link">
                            Category?
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="#sale" className="nav-link">
                            Category?
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="#blog" className="nav-link">
                            Blog?
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <section
          className="py-3"
          style={{
            backgroundImage: "url('./styles/images/background-pattern.jpg')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="banner-blocks">
                  <div className="banner-ad large bg-info block-1" style={{ '--bs-info-rgb': '230, 243, 250' }}>
                    <div className="swiper main-swiper">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div
                            className="row banner-content p-5"

                          >

                            <div className="content-wrapper col-md-7">
                              <div className="categories my-3">100% natural</div>
                              <h3 className="display-4">Fresh Smoothie & Summer Juice</h3>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Dignissim massa diam elementum.
                              </p>
                              <a
                                href="#"
                                className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 px-4 py-3 mt-3"
                              >
                                Shop Now
                              </a>
                            </div>
                            <div className="img-wrapper col-md-5">
                              <img
                                src="./styles/images/product-thumb-1.png"
                                className="img-fluid"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="row banner-content p-5">
                            <div className="content-wrapper col-md-7">
                              <div className="categories mb-3 pb-3">100% natural</div>
                              <h3 className="banner-title">Fresh Smoothie & Summer Juice</h3>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Dignissim massa diam elementum.
                              </p>
                              <a
                                href="#"
                                className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1"
                              >
                                Shop Collection
                              </a>
                            </div>
                            <div className="img-wrapper col-md-5">
                              <img
                                src="./styles/images/product-thumb-1.png"
                                className="img-fluid"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="row banner-content p-5">
                            <div className="content-wrapper col-md-7">
                              <div className="categories mb-3 pb-3">100% natural</div>
                              <h3 className="banner-title">Heinz Tomato Ketchup</h3>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Dignissim massa diam elementum.
                              </p>
                              <a
                                href="#"
                                className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1"
                              >
                                Shop Collection
                              </a>
                            </div>
                            <div className="img-wrapper col-md-5">
                              <img
                                src="./styles/images/product-thumb-2.png"
                                className="img-fluid"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-pagination"></div>
                    </div>
                  </div>

                  <div
                    className="banner-ad bg-success-subtle block-2"
                    style={{
                      background: "url('./styles/images/ad-image-1.png') no-repeat",
                      backgroundPosition: 'right bottom',
                    }}
                  >
                    <div className="row banner-content p-5">
                      <div className="content-wrapper col-md-7">
                        <div className="categories sale mb-3 pb-3">20% off</div>
                        <h3 className="banner-title">Fruits & Vegetables</h3>
                        <a href="#" className="d-flex align-items-center nav-link">
                          Shop Collection{' '}
                          <svg width="24" height="24">
                            <use href="#arrow-right" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div
                    className="banner-ad bg-danger block-3"
                    style={{
                      '--bs-danger-rgb': '249, 235, 231',
                      background: "url('./styles/images/ad-image-2.png') no-repeat",
                      backgroundPosition: 'right bottom',
                    }}
                  >

                    <div className="row banner-content p-5">
                      <div className="content-wrapper col-md-7">
                        <div className="categories sale mb-3 pb-3">15% off</div>
                        <h3 className="item-title">Baked Products</h3>
                        <a href="#" className="d-flex align-items-center nav-link">
                          Shop Collection{' '}
                          <svg width="24" height="24">
                            <use href="#arrow-right" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CategoryCarousel />
        <BrandCarousel />
        <ProductsCarousel />
        <BestSellingCarousel />
        <BlogCarousel />
        <RecommendTagCarousel />
        <Chat />
        {/* Footer */}
        <Footer />


      </div>
    </HelmetProvider>
  );
};

export default Home;