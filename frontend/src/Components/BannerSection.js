import React, { useState, useEffect } from "react";
import axios from "axios";

const BannerSection = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCustomProducts, setIsCustomProducts] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load saved products from API
  const loadSavedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/banner`
      );

      if (response.data.success && response.data.data.length > 0) {
        setSavedProducts(response.data.data);
        setIsCustomProducts(true);
        console.log(
          "BannerSection: Loaded products from API:",
          response.data.data
        );
      } else {
        setSavedProducts([]);
        setIsCustomProducts(false);
      }
    } catch (error) {
      console.error("Error loading banner products from API:", error);
      setSavedProducts([]);
      setIsCustomProducts(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load immediately
    loadSavedProducts();

    // Check for updates every 30 seconds
    const interval = setInterval(() => {
      loadSavedProducts();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (savedProducts.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % savedProducts.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [savedProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % savedProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + savedProducts.length) % savedProducts.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const resetToDefault = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, cannot reset banner");
        return;
      }

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/banner/clear`, {
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      });

      setSavedProducts([]);
      setIsCustomProducts(false);
      setCurrentSlide(0);
    } catch (error) {
      console.error("Error resetting banner:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section
        className="py-4"
        style={{ background: "#f8f9fa", minHeight: "200px" }}
      >
        <div className="container-fluid px-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Đang tải banner...</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state when no products are saved
  if (!isCustomProducts || savedProducts.length === 0) {
    return (
      <section
        className="py-4"
        style={{
          background: "#ffffff",
          minHeight: "500px",
        }}
      >
        <div className="container-fluid px-4">
          <div
            className="row justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="col-lg-8 text-center">
              <div className="bg-light rounded-4 p-5 shadow-sm border">
                <div className="mb-4">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="fas fa-shopping-bag fa-2x text-primary"></i>
                  </div>
                </div>

                <h2 className="text-dark fw-bold mb-3 display-6">
                  Chưa có sản phẩm nào được chọn
                </h2>

                <p className="text-muted mb-4 fs-5">
                  Hãy sử dụng Multi-Product Viewer để chọn và lưu sản phẩm yêu
                  thích của bạn. Chúng sẽ xuất hiện ở đây dưới dạng banner đẹp
                  mắt.
                </p>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <div className="bg-primary bg-opacity-10 rounded-3 px-4 py-2">
                    <small className="text-primary fw-semibold">
                      <i className="fas fa-star me-2"></i>
                      Chọn sản phẩm yêu thích
                    </small>
                  </div>
                  <div className="bg-success bg-opacity-10 rounded-3 px-4 py-2">
                    <small className="text-success fw-semibold">
                      <i className="fas fa-save me-2"></i>
                      Lưu vào banner
                    </small>
                  </div>
                  <div className="bg-info bg-opacity-10 rounded-3 px-4 py-2">
                    <small className="text-info fw-semibold">
                      <i className="fas fa-eye me-2"></i>
                      Xem banner đẹp
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Banner with saved products
  return (
    <section
      className="py-4"
      style={{
        background: "#ffffff",
        minHeight: "500px",
      }}
    >
      <div className="container-fluid px-4">
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="flex-grow-1">
                  <h2 className="text-dark display-6 fw-bold mb-2">
                    Sản phẩm được quan tâm
                  </h2>
                </div>
                <button
                  onClick={resetToDefault}
                  className="btn btn-outline-secondary btn-sm"
                  title="Reset to default products"
                >
                  <i className="fas fa-undo me-1"></i>
                  Reset
                </button>
              </div>
            </div>

            {/* Main Banner Carousel */}
            <div className="position-relative bg-white rounded-4 shadow-lg overflow-hidden mb-4">
              <div
                className="d-flex transition-all duration-500"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                {savedProducts.map((product, index) => (
                  <div key={product.id} className="w-100 flex-shrink-0">
                    <div
                      className="row g-0 align-items-center"
                      style={{ minHeight: "400px" }}
                    >
                      <div className="col-md-7 p-5">
                        <div className="position-relative">
                          <span className="badge bg-primary rounded-pill mb-3 px-3 py-2">
                            {product.badge} #{index + 1}
                          </span>
                          <div className="text-muted mb-2 fw-semibold">
                            {product.category}
                          </div>
                          <h3 className="display-5 fw-bold text-dark mb-3">
                            {product.name}
                          </h3>
                          <p className="text-muted mb-4 fs-5">
                            {product.description}
                          </p>

                          <div className="d-flex align-items-center gap-3 mb-4">
                            <span className="h4 text-success fw-bold mb-0">
                              {product.price}
                            </span>
                            <span className="badge bg-danger fs-6 px-3 py-2">
                              {product.discount}
                            </span>
                          </div>

                          <button className="btn btn-dark btn-lg px-4 py-3 rounded-3 fw-semibold">
                            {product.buttonText} →
                          </button>

                          {/* Custom product indicator */}
                          <div className="mt-3"></div>
                        </div>
                      </div>
                      <div className="col-md-5 p-4">
                        <div className="position-relative">
                          <img
                            src={product.image}
                            className="img-fluid rounded-3 shadow-sm"
                            alt={product.name}
                            style={{
                              maxHeight: "fit-content",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                              Top {index + 1}
                            </span>
                          </div>
                          <div className="position-absolute bottom-0 start-0 m-3">
                            <span className="badge bg-info px-2 py-1 rounded-pill">
                              <i className="fas fa-check"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows - only show if more than 1 product */}
              {savedProducts.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="position-absolute top-50 start-0 translate-middle-y btn btn-white rounded-circle ms-3 shadow-sm"
                    style={{ width: "50px", height: "50px", zIndex: 10 }}
                  >
                    ←
                  </button>
                  <button
                    onClick={nextSlide}
                    className="position-absolute top-50 end-0 translate-middle-y btn btn-white rounded-circle me-3 shadow-sm"
                    style={{ width: "50px", height: "50px", zIndex: 10 }}
                  >
                    →
                  </button>

                  {/* Pagination Dots */}
                  <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
                    <div className="d-flex gap-2">
                      {savedProducts.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`btn rounded-circle p-0 ${
                            currentSlide === index
                              ? "btn-primary"
                              : "btn-outline-light"
                          }`}
                          style={{ width: "12px", height: "12px" }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Product Management Info */}
            <div className="row mt-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
