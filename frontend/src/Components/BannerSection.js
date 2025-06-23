import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBanner } from "../context/BannerContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BannerSection = () => {
  const navigate = useNavigate();
  const {
    bannerProducts: savedProducts,
    loading,
    clearBannerData
  } = useBanner();
  const [visibleSlides, setVisibleSlides] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  const isCustomProducts = savedProducts.length > 0;

  // Function to calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountText) => {
    if (!originalPrice || !discountText) return { original: originalPrice, discounted: originalPrice };

    // Extract percentage from discount text (e.g., "Giảm 15%" -> 15)
    const percentageMatch = discountText.match(/(\d+)/);
    if (!percentageMatch) return { original: originalPrice, discounted: originalPrice };

    const discountPercentage = parseInt(percentageMatch[1]);

    // Extract numeric value from formatted price (e.g., "1.500.000 ₫" -> 1500000)
    const priceMatch = originalPrice.match(/[\d.]+/g);
    if (!priceMatch) return { original: originalPrice, discounted: originalPrice };

    // Remove commas and convert to number
    const originalPriceNum = parseInt(priceMatch.join('').replace(/\./g, ''));

    if (isNaN(originalPriceNum) || isNaN(discountPercentage)) {
      return { original: originalPrice, discounted: originalPrice };
    }

    const discountedPrice = originalPriceNum * (1 - discountPercentage / 100);

    return {
      original: originalPrice,
      discounted: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(discountedPrice)
    };
  };

  // Animation effect for slides appearing one by one
  useEffect(() => {
    if (isCustomProducts && savedProducts.length > 0) {
      setVisibleSlides([]);
      setAnimationComplete(false);

      savedProducts.forEach((_, index) => {
        setTimeout(() => {
          setVisibleSlides(prev => [...prev, index]);
          if (index === savedProducts.length - 1) {
            setTimeout(() => setAnimationComplete(true), 300);
          }
        }, index * 400); // Delay 400ms between each slide
      });
    }
  }, [savedProducts, isCustomProducts]);

  const resetToDefault = async () => {
    try {
      const result = await clearBannerData();
      if (result.success) {
        // Reset logic if needed
      }
    } catch (error) {
      console.error("Error resetting banner:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section
        className="py-3"
        style={{ background: "#f8f9fa", minHeight: "150px" }}
      >
        <div className="container-fluid px-4">
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Đang tải banner...</p>
          </div>
        </div>
      </section>
    );
  };

  // Empty state when no products are saved
  if (!isCustomProducts || savedProducts.length === 0) {
    return (
      <section
        className="py-3"
        style={{
          background: "#ffffff",
          minHeight: "350px",
        }}
      >
        <div className="container-fluid px-4">
          <div
            className="row justify-content-center align-items-center"
            style={{ minHeight: "300px" }}
          >
            <div className="col-lg-8 text-center">
              <div className="bg-light rounded-4 p-4 shadow-sm border">
                <div className="mb-3">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="fas fa-shopping-bag fa-1x text-primary"></i>
                  </div>
                </div>

                <h3 className="text-dark fw-bold mb-3">
                  Chưa có sản phẩm nào được chọn
                </h3>

                <p className="text-muted mb-3">
                  Hãy sử dụng Multi-Product Viewer để chọn và lưu sản phẩm yêu
                  thích của bạn. Chúng sẽ xuất hiện ở đây dưới dạng banner đẹp
                  mắt.
                </p>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <div className="bg-primary bg-opacity-10 rounded-3 px-3 py-1">
                    <small className="text-primary fw-semibold">
                      <i className="fas fa-star me-2"></i>
                      Chọn sản phẩm yêu thích
                    </small>
                  </div>
                  <div className="bg-success bg-opacity-10 rounded-3 px-3 py-1">
                    <small className="text-success fw-semibold">
                      <i className="fas fa-save me-2"></i>
                      Lưu vào banner
                    </small>
                  </div>
                  <div className="bg-info bg-opacity-10 rounded-3 px-3 py-1">
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

  // Banner with saved products using Swiper
  return (
    <section
      className="py-3"
      style={{
        background: "#ffffff",
        minHeight: "350px",
      }}
    >
      <div className="container-fluid px-4">
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="flex-grow-1">
                  <h3 className="text-dark fw-bold mb-2">
                    Sản phẩm được quan tâm
                  </h3>
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

            {/* Swiper Banner */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={15}
              slidesPerView={2}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              loop={savedProducts.length > 2}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
              }}
              className="product-banner-swiper"
            >
              {savedProducts.map((product, index) => (
                <SwiperSlide key={product.id}>
                  <div className="position-relative bg-white rounded-3 shadow-lg overflow-hidden h-100">
                    <div
                      className="d-flex flex-row"
                      style={{ minHeight: "280px" }}
                    >
                      <div className="p-2 flex-grow-1 d-flex justify-content-center align-items-center">
                        <div className="position-relative" style={{ marginLeft: "15px" }}>
                          <span className="badge bg-primary rounded-pill mb-1 px-2 py-1 small">
                            {product.badge} #{index + 1}
                          </span>
                          <div className="text-muted mb-1 small fw-semibold">
                            {product.category}
                          </div>
                          <h5 className="fw-bold text-dark mb-2">
                            {product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}
                          </h5>

                          <div className="d-flex align-items-center gap-2 mb-2">
                            <div className="price-display">
                              {(() => {
                                const priceInfo = calculateDiscountedPrice(product.price, product.discount);
                                const hasValidDiscount = product.discount && product.discount.trim() !== "" && product.discount.match(/(\d+)/);

                                return (
                                  <>
                                    {hasValidDiscount && (
                                      <span className="original-price">
                                        {priceInfo.original}
                                      </span>
                                    )}
                                    <span className="discounted-price">
                                      {hasValidDiscount ? priceInfo.discounted : product.price}
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                            {product.discount && product.discount.trim() !== "" && product.discount.match(/(\d+)/) && (
                              <span className="badge bg-danger small px-2 py-1">
                                {product.discount}
                              </span>
                            )}
                          </div>

                          <button
                            className="btn btn-dark btn-sm px-2 py-1 rounded-3 fw-semibold"
                            onClick={() => navigate(`/productView/${product.id}`)}
                          >
                            {product.buttonText} →
                          </button>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="position-relative pe-3">
                          <img
                            src={product.image}
                            className="img-fluid rounded-3 shadow-sm"
                            alt={product.name}
                            style={{
                              height: "300px",
                              width: "180px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="position-absolute top-0 end-0 m-1">
                            <span className="badge bg-warning text-dark px-2 py-1 rounded-pill small">
                              Top {index + 1}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom CSS for Swiper */}
            <style jsx>{`
              .product-banner-swiper .swiper-pagination-bullet {
                background: #007bff;
                opacity: 0.5;
              }
              
              .product-banner-swiper .swiper-pagination-bullet-active {
                opacity: 1;
              }
              
              .product-banner-swiper .swiper-button-next,
              .product-banner-swiper .swiper-button-prev {
                color: #007bff;
                background: white;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
              }
              
              .product-banner-swiper .swiper-button-next:after,
              .product-banner-swiper .swiper-button-prev:after {
                font-size: 14px;
                font-weight: bold;
              }
              
              .product-banner-swiper .swiper-slide {
                height: auto;
              }
              
              .price-display {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 2px;
              }
              
              .original-price {
                text-decoration: line-through;
                color: #6c757d;
                font-size: 0.85em;
                font-weight: normal;
              }
              
              .discounted-price {
                color: #28a745;
                font-weight: bold;
                font-size: 1.1em;
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;