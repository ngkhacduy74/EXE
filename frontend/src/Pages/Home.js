import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./styles/style.css"; // Adjust path if needed
import "./styles/vendor.css"; // Adjust path if needed
import BrandCarousel from "../Components/BrandCarousel";
import ProductsCarousel from "../Components/ProductCarousel";
import BestSellingCarousel from "../Components/BestSellingCarousel";
import BlogCarousel from "../Components/BlogCarousel";
import RecommendTagCarousel from "../Components/RecommendTagCarousel";
import Footer from "../Components/Footer";
import Canvas from "../Components/Canvas"; // Assuming you have a Canvas component for the cart
import ChatWidget from "../Components/WidgetChat";
import Header from "../Components/Header";
import BannerSection from "../Components/BannerSection";
import BannerSection2 from "../Components/BannerSection2";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <HelmetProvider>
      <div>
        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
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

          <Header />
          <div className="d-flex justify-content-end mb-3">

          </div>

          <BannerSection2 />
          <BannerSection />
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
