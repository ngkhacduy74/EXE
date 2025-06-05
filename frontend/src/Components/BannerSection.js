import React, { useState, useEffect } from 'react';

const BannerSection = () => {
  // Dữ liệu top 5 sản phẩm bán chạy - bạn có thể thay thế bằng dữ liệu thực tế
  const [topProducts] = useState([
    {
      id: 1,
      name: "Tủ Lạnh Samsung Inverter",
      category: "Thiết Bị Gia Dụng",
      description: "Tủ lạnh tiết kiệm điện với công nghệ Inverter hiện đại. Dung tích lớn, bảo quản thực phẩm tươi ngon lâu hơn.",
      price: "12.500.000đ",
      discount: "Giảm 20%",
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop",
      badge: "Bán Chạy #1",
      buttonText: "Mua Ngay"
    },
    {
      id: 2,
      name: "Quạt Điều Hòa Sunhouse",
      category: "Làm Mát",
      description: "Quạt điều hòa không khí cao cấp, làm mát nhanh chóng với công suất lớn. Tiết kiệm điện năng vượt trội.",
      price: "3.200.000đ",
      discount: "Giảm 15%",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
      badge: "Yêu Thích",
      buttonText: "Xem Thêm"
    },
    {
      id: 3,
      name: "Máy Làm Đá Công Nghiệp",
      category: "Thiết Bị Chuyên Dụng",
      description: "Máy làm đá viên tự động, công suất cao phù hợp cho quán cà phê, nhà hàng. Chất lượng đá trong suốt.",
      price: "8.900.000đ",
      discount: "Giảm 25%",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      badge: "Hàng Mới",
      buttonText: "Đặt Hàng"
    },
    {
      id: 4,
      name: "Tủ Đông Alaska 450L",
      category: "Bảo Quản Lạnh",
      description: "Tủ đông dung tích lớn, phù hợp cho cửa hàng, gia đình đông người. Công nghệ làm lạnh nhanh, tiết kiệm điện.",
      price: "6.800.000đ",
      discount: "Giảm 18%",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      badge: "Khuyến Mãi",
      buttonText: "Mua Ngay"
    },
    {
      id: 5,
      name: "Quạt Trần Panasonic",
      category: "Thiết Bị Làm Mát",
      description: "Quạt trần cao cấp với động cơ bền bỉ, vận hành êm ái. Thiết kế hiện đại, phù hợp mọi không gian.",
      price: "1.850.000đ",
      discount: "Giảm 12%",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      badge: "Giá Tốt",
      buttonText: "Xem Chi Tiết"
    }
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topProducts.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [topProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % topProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + topProducts.length) % topProducts.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section
      className="py-4"
      style={{
        background: '#ffffff',
        minHeight: '500px'
      }}
    >
      <div className="container-fluid px-4">
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-4">
              <h2 className="text-dark display-6 fw-bold mb-2">Sản phẩm bán chạy</h2>
              <p className="text-muted">Khám phá những sản phẩm được yêu thích nhất</p>
            </div>

            {/* Main Banner Carousel */}
            <div className="position-relative bg-white rounded-4 shadow-lg overflow-hidden mb-4">
              <div 
                className="d-flex transition-all duration-500"
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: 'transform 0.5s ease-in-out'
                }}
              >
                {topProducts.map((product, index) => (
                  <div key={product.id} className="w-100 flex-shrink-0">
                    <div className="row g-0 align-items-center" style={{ minHeight: '400px' }}>
                      <div className="col-md-7 p-5">
                        <div className="position-relative">
                          <span className="badge bg-primary rounded-pill mb-3 px-3 py-2">
                            {product.badge} #{index + 1}
                          </span>
                          <div className="text-muted mb-2 fw-semibold">{product.category}</div>
                          <h3 className="display-5 fw-bold text-dark mb-3">{product.name}</h3>
                          <p className="text-muted mb-4 fs-5">{product.description}</p>
                          
                          <div className="d-flex align-items-center gap-3 mb-4">
                            <span className="h4 text-success fw-bold mb-0">{product.price}</span>
                            <span className="badge bg-danger fs-6 px-3 py-2">{product.discount}</span>
                          </div>
                          
                          <button className="btn btn-dark btn-lg px-4 py-3 rounded-3 fw-semibold">
                            {product.buttonText} →
                          </button>
                        </div>
                      </div>
                      <div className="col-md-5 p-4">
                        <div className="position-relative">
                          <img
                            src={product.image}
                            className="img-fluid rounded-3 shadow-sm"
                            alt={product.name}
                            style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                          />
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                              Top {index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="position-absolute top-50 start-0 translate-middle-y btn btn-white rounded-circle ms-3 shadow-sm"
                style={{ width: '50px', height: '50px', zIndex: 10 }}
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="position-absolute top-50 end-0 translate-middle-y btn btn-white rounded-circle me-3 shadow-sm"
                style={{ width: '50px', height: '50px', zIndex: 10 }}
              >
                →
              </button>

              {/* Pagination Dots */}
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
                <div className="d-flex gap-2">
                  {topProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`btn rounded-circle p-0 ${
                        currentSlide === index ? 'btn-primary' : 'btn-outline-light'
                      }`}
                      style={{ width: '12px', height: '12px' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;