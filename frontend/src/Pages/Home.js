import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./styles/style.css"; // Adjust path if needed
import "./styles/vendor.css"; // Adjust path if needed
import CategoryCarousel from "../Components/CategoryCarousel";
import BrandCarousel from "../Components/BrandCarousel";
import ProductsCarousel from "../Components/ProductCarousel";
import BestSellingCarousel from "../Components/BestSellingCarousel";
import BlogCarousel from "../Components/BlogCarousel";
import RecommendTagCarousel from "../Components/RecommendTagCarousel";
import Footer from "../Components/Footer";
import Canvas from "../Components/Canvas"; // Assuming you have a Canvas component for the cart
import ChatWidget from "../Components/WidgetChat";
import Header from "../Components/Header";
import { House, Edit, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value; // Assuming input has name="search"
    console.log("Search query:", query);
    // Add your search logic here (e.g., navigate to a search results page)
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <HelmetProvider>
      <div
        style={{
          overflowX: "hidden",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <Helmet>
          <title>Vinsaky Shop</title>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
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
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
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
            <Canvas />
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
        <Header />

        <div className="offcanvas-body d-flex justify-content-center align-items-center flex-wrap">
          <select className="filter-categories border-0 mb-0 me-5">
            <option>Shop by ABC</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          <ul className="navbar-nav d-flex flex-row gap-3 mb-0 list-unstyled">
            {[
              "Category1",
              "Category2",
              "Category3",
              "Category4",
              "Brand1",
              "Category5",
              "Category6",
              "Blog",
            ].map((item, index) => (
              <li key={index} className="nav-item">
                <a href="#" className="nav-link">
                  {item}
                </a>
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
                Brands
              </a>
              <ul className="dropdown-menu" aria-labelledby="pages">
                {[
                  "About Us",
                  "Shop",
                  "Single Product",
                  "Cart",
                  "Checkout",
                  "Blog",
                  "Single Post",
                  "Styles",
                  "Contact",
                  "Thank You",
                  "My Account",
                  "404 Error",
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

        <section
          className="py-3"
          style={{
            backgroundImage: "url('./styles/images/background-pattern.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="banner-blocks">
                  <div
                    className="banner-ad large bg-info block-1"
                    style={{ "--bs-info-rgb": "230, 243, 250" }}
                  >
                    <div className="swiper main-swiper">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="row banner-content p-5">
                            <div className="content-wrapper col-md-7">
                              <div className="categories my-3">
                                100% natural
                              </div>
                              <h3 className="display-4">
                                Fresh Smoothie & Summer Juice
                              </h3>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Dignissim massa diam elementum.
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
                              <div className="categories mb-3 pb-3">
                                100% natural
                              </div>
                              <h3 className="banner-title">
                                Fresh Smoothie & Summer Juice
                              </h3>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Dignissim massa diam elementum.
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
                              <div className="categories mb-3 pb-3">
                                100% natural
                              </div>
                              <h3 className="banner-title">
                                Heinz Tomato Ketchup
                              </h3>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Dignissim massa diam elementum.
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
                      background:
                        "url('./styles/images/ad-image-1.png') no-repeat",
                      backgroundPosition: "right bottom",
                    }}
                  >
                    <div className="row banner-content p-5">
                      <div className="content-wrapper col-md-7">
                        <div className="categories sale mb-3 pb-3">20% off</div>
                        <h3 className="banner-title">Fruits & Vegetables</h3>
                        <a
                          href="#"
                          className="d-flex align-items-center nav-link"
                        >
                          Shop Collection{" "}
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
                      "--bs-danger-rgb": "249, 235, 231",
                      background:
                        "url('./styles/images/ad-image-2.png') no-repeat",
                      backgroundPosition: "right bottom",
                    }}
                  >
                    <div className="row banner-content p-5">
                      <div className="content-wrapper col-md-7">
                        <div className="categories sale mb-3 pb-3">15% off</div>
                        <h3 className="item-title">Baked Products</h3>
                        <a
                          href="#"
                          className="d-flex align-items-center nav-link"
                        >
                          Shop Collection{" "}
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
        <ChatWidget />

        {/* Footer */}
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Home;
