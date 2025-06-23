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
import Canvas from '../Components/Canvas'; // Assuming you have a Canvas component for the cart
import ChatWidget from '../Components/WidgetChat';
import Header from '../Components/Header';
import { House, Edit, LogOut } from 'lucide-react';
import BannerSection from '../Components/BannerSection';
import BannerSection2 from '../Components/BannerSection2'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const returnUrl = location.state?.returnUrl;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value; // Assuming input has name="search"
    console.log('Search query:', query);
    // Add your search logic here (e.g., navigate to a search results page)

  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  }



  return (
    <HelmetProvider>
      <div>
        <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
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

          <BannerSection2 />
          <BannerSection />
          {/* <CategoryCarousel /> */}
          <BrandCarousel />
          <ProductsCarousel />
          <BestSellingCarousel />
          <BlogCarousel />
          <RecommendTagCarousel />
          <ChatWidget />
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Home;