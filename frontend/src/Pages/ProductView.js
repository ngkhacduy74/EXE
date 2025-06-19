import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Alert,
  Card,
  Modal,
  Spinner,
} from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import Header from "../Components/Header"; // User header component
import Footer from "../Components/Footer"; // User footer component
import ErrorPage from "../Components/ErrorPage";
import WigdetChat from "../Components/WidgetChat.js";
import {
  addToRecentlyViewed,
  loadRecentlyViewed,
} from "../utils/recentlyViewed";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 5000,
});

const ProductView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!productId) {
        setError("Product ID is missing from the URL.");
        return;
      }

      // For user view, we might not need authentication token
      // or use a different endpoint for public product access
      const headers = {
        "Content-Type": "application/json",
      };

      // If authentication is still required for users
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");
      if (token) {
        headers.token = token;
      }

      const response = await api.get(`/product/${productId}`, { headers });

      const productData =
        response.data.data || response.data.product || response.data;
      setProduct(productData);
      addToRecentlyViewed(productData);
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            // For user view, might redirect to login or show guest view
            setError("Vui lòng đăng nhập để xem chi tiết sản phẩm.");
            break;
          case 403:
            setError("Sản phẩm này không khả dụng để xem.");
            break;
          case 404:
            setError(
              "Không tìm thấy sản phẩm. Sản phẩm có thể không còn khả dụng."
            );
            break;
          case 500:
            setError("Lỗi máy chủ. Vui lòng thử lại sau.");
            break;
          default:
            setError(
              `Error ${err.response.status}: ${
                err.response.data?.message || "Unknown error occurred"
              }`
            );
        }
      } else if (err.request) {
        setError("Lỗi mạng. Vui lòng kiểm tra kết nối và thử lại.");
      } else {
        setError("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId, navigate]);

  // Load recently viewed products
  useEffect(() => {
    const loadRecentlyViewedProducts = () => {
      const recentlyViewedProducts = loadRecentlyViewed();
      // Filter out current product
      const filteredProducts = recentlyViewedProducts.filter(
        (p) => p.id !== productId
      );
      setRecentlyViewed(filteredProducts.slice(0, 4)); // Show only 4 products
    };

    loadRecentlyViewedProducts();
  }, [productId]);

  const getQuantityStatus = useCallback((quantity) => {
    if (quantity === undefined || quantity === null)
      return { variant: "secondary", text: "Liên hệ" };
    if (quantity === 0) return { variant: "danger", text: "Hết hàng" };
    if (quantity < 10) return { variant: "warning", text: "Sắp hết hàng" };
    return { variant: "success", text: "Còn hàng" };
  }, []);

  const formatPrice = useCallback((price) => {
    if (!price) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "success";
      case "used":
        return "warning";
      case "refurbished":
        return "info";
      case "second hand":
        return "warning";
      default:
        return "secondary";
    }
  }, []);

  const getProductImages = useCallback((product) => {
    if (Array.isArray(product?.image) && product.image.length > 0) {
      return product.image.filter((img) => img && typeof img === "string");
    } else if (typeof product?.image === "string" && product.image) {
      return [product.image];
    }
    // Return a placeholder image if no images are available
    return [
      "https://fushimavina.com/data/data/files/test/may-lam-da-100kg.jpg",
    ];
  }, []);

  const handleImageError = (e) => {
    e.target.src =
      "https://fushimavina.com/data/data/files/test/may-lam-da-100kg.jpg";
  };

  const handleVideoPlay = (videoUrl) => {
    if (videoUrl && typeof videoUrl === "string") {
      setSelectedVideo(videoUrl);
      setShowVideoModal(true);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleContactUs = () => {
    // Redirect to contact page or show contact modal
    navigate("/contact", {
      state: {
        product: product,
        message: `Tôi quan tâm đến sản phẩm: ${product.name}`,
      },
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="py-5" style={{ minHeight: "60vh" }}>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "40vh" }}
          >
            <Card className="shadow-sm w-100" style={{ maxWidth: "600px" }}>
              <Card.Body>
                <div className="placeholder-glow">
                  <div
                    className="placeholder col-6 mb-3"
                    style={{ height: "30px" }}
                  ></div>
                  <div
                    className="placeholder col-12 mb-3"
                    style={{ height: "200px" }}
                  ></div>
                  <div
                    className="placeholder col-4"
                    style={{ height: "20px" }}
                  ></div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <ErrorPage message={error} />
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <ErrorPage message="Product not available." />
        <Footer />
      </>
    );
  }

  const images = getProductImages(product);
  const quantityStatus = getQuantityStatus(product.quantity);

  return (
    <>
      <Header />
      <style>
        {`
          /* Swiper Styles */
          .product-image-swiper {
            border-radius: 0.375rem;
            overflow: hidden;
          }
          
          .product-image-swiper .swiper-slide {
            text-align: center;
          }
          
          .product-thumbs-swiper {
            height: 100px;
          }
          
          .product-thumbs-swiper .swiper-slide {
            opacity: 0.6;
            transition: opacity 0.3s ease;
          }
          
          .product-thumbs-swiper .swiper-slide-thumb-active {
            opacity: 1;
          }
          
          .thumbnail-item {
            transition: all 0.3s ease;
          }
          
          .thumbnail-item:hover {
            transform: scale(1.05);
          }
          
          .thumbnail-item.active {
            transform: scale(1.1);
          }
          
          /* Navigation buttons */
          .product-image-swiper .swiper-button-next,
          .product-image-swiper .swiper-button-prev {
            color: #007bff;
            background: rgba(255, 255, 255, 0.9);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-top: -20px;
          }
          
          .product-image-swiper .swiper-button-next:after,
          .product-image-swiper .swiper-button-prev:after {
            font-size: 18px;
          }
          
          /* Video thumbnail styles */
          .bg-gradient-dark {
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          }
          
          /* Recently viewed product cards */
          .product-card {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }
          
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          }
          
          .product-card .card-img-top {
            transition: transform 0.3s ease;
          }
          
          .product-card:hover .card-img-top {
            transform: scale(1.05);
          }
          
          /* Responsive */
          @media (max-width: 768px) {
            .product-image-swiper .swiper-slide img {
              height: 300px !important;
            }
            
            .product-thumbs-swiper {
              height: 80px;
            }
            
            .product-thumbs-swiper .swiper-slide img {
              height: 60px !important;
            }
          }
        `}
      </style>
      <Container className="py-4" style={{ minHeight: "80vh" }}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => navigate("/")}
              >
                Trang chủ
              </Button>
            </li>
            <li className="breadcrumb-item">
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => navigate("/products")}
              >
                Sản phẩm
              </Button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name || `Product #${productId}`}
            </li>
          </ol>
        </nav>

        {/* Product Header */}
        <div className="mb-4">
          <h1 className="mb-2 text-primary">
            {product.name || "Product Name"}
          </h1>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <p className="text-muted mb-0">Tình trạng sp: </p>
            {product.brand && (
              <Badge bg="outline-primary" className="px-3 py-1">
                <i className="fas fa-tag me-1"></i>
                {product.brand}
              </Badge>
            )}
            {product.status && (
              <Badge bg={getStatusColor(product.status)} className="px-3 py-1">
                {product.status}
              </Badge>
            )}
            <Badge bg={quantityStatus.variant} className="px-3 py-1">
              {quantityStatus.text}
            </Badge>
          </div>
        </div>

        <Row>
          {/* Product Images & Videos */}
          <Col lg={6}>
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-0">
                {/* Main Image Slider */}
                <div className="position-relative">
                  <Swiper
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    modules={[Navigation, Pagination, Thumbs]}
                    className="product-image-swiper"
                    onSlideChange={(swiper) =>
                      setSelectedImageIndex(swiper.activeIndex)
                    }
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="position-relative">
                          <img
                            src={image}
                            alt={`${product.name} - Image ${index + 1}`}
                            className="img-fluid rounded"
                            style={{
                              width: "100%",
                              height: "fit-content",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={handleImageError}
                            loading="lazy"
                          />
                          {product.discount && index === 0 && (
                            <Badge
                              bg="danger"
                              className="position-absolute top-0 start-0 m-3 fs-5"
                            >
                              -{product.discount}% GIẢM
                            </Badge>
                          )}
                          {/* Image counter */}
                          <div className="position-absolute bottom-0 end-0 m-3">
                            <Badge bg="dark" className="px-3 py-2">
                              {index + 1} / {images.length}
                            </Badge>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Thumbnail Slider */}
                {images.length > 1 && (
                  <div className="mt-3 p-3">
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[Navigation, Thumbs]}
                      className="product-thumbs-swiper"
                    >
                      {images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className={`thumbnail-item ${
                              selectedImageIndex === index ? "active" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={image}
                              alt={`${product.name} thumbnail ${index + 1}`}
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "80px",
                                objectFit: "cover",
                                border:
                                  selectedImageIndex === index
                                    ? "3px solid #007bff"
                                    : "1px solid #dee2e6",
                              }}
                              onError={handleImageError}
                              loading="lazy"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Product Videos */}
            {product.video &&
              Array.isArray(product.video) &&
              product.video.length > 0 && (
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0">
                      <i className="fas fa-video text-primary me-2"></i> Video
                      sản phẩm
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {product.video.map((vid, index) => (
                        <Col key={index} xs={6} className="mb-3">
                          <div
                            className="position-relative bg-dark rounded overflow-hidden"
                            style={{ height: "120px", cursor: "pointer" }}
                            onClick={() => handleVideoPlay(vid)}
                            role="button"
                            aria-label={`Play video ${index + 1}`}
                          >
                            <div className="position-absolute top-50 start-50 translate-middle text-white">
                              <i
                                className="fas fa-play-circle"
                                style={{ fontSize: "3rem" }}
                              ></i>
                            </div>
                            <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-dark text-white p-2">
                              <small>Video {index + 1}</small>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              )}
          </Col>

          {/* Product Details & Purchase */}
          <Col lg={6}>
            {/* Price & Purchase Options */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <div className="mb-4">
                  <h2 className="text-success fw-bold mb-2">
                    {formatPrice(product.price)}
                  </h2>
                  {product.discount && (
                    <p className="text-muted text-decoration-line-through mb-0">
                      {formatPrice(
                        product.price * (1 + product.discount / 100)
                      )}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <Row className="align-items-center">
                    <Col sm={6}>
                      <label className="form-label fw-medium mb-2">
                        Số lượng:
                      </label>
                      <div className="input-group" style={{ width: "150px" }}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => handleQuantityChange(-1)}
                          aria-label="Giảm số lượng"
                        >
                          −
                        </button>
                        <input
                          type="text"
                          className="form-control text-center fw-medium"
                          value={quantity}
                          readOnly
                          aria-label="Số lượng hiện tại"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => handleQuantityChange(1)}
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <p className="text-muted mb-0">
                        {product.quantity !== undefined
                          ? `${product.quantity} sản phẩm có sẵn`
                          : "Liên hệ để biết tình trạng hàng"}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div className="d-grid gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleContactUs}
                    className="py-3 fw-medium"
                  >
                    <i className="fas fa-phone me-2"></i>
                    Liên hệ
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Product Information */}
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle text-primary me-2"></i> Thông
                  tin sản phẩm
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    {product.brand && (
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">
                          THƯƠNG HIỆU
                        </label>
                        <p className="mb-0">{product.brand}</p>
                      </div>
                    )}
                    {product.category && (
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">
                          DANH MỤC
                        </label>
                        <p className="mb-0">{product.category}</p>
                      </div>
                    )}
                  </Col>
                  <Col md={6}>
                    {product.status && (
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">
                          TÌNH TRẠNG
                        </label>
                        <Badge
                          bg={getStatusColor(product.status)}
                          className="fs-6 px-3 py-2"
                        >
                          {product.status}
                        </Badge>
                      </div>
                    )}
                    {product.warranty_period && (
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">
                          BẢO HÀNH
                        </label>
                        <p className="mb-0">{product.warranty_period} tháng</p>
                      </div>
                    )}
                  </Col>
                </Row>

                {product.description && (
                  <>
                    <hr className="my-4" />
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">
                        MÔ TẢ
                      </label>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-0" style={{ lineHeight: "1.6" }}>
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {product.features && product.features.length > 0 && (
                  <>
                    <hr className="my-4" />
                    <div>
                      <label className="form-label text-muted small fw-bold">
                        TÍNH NĂNG NỔI BẬT
                      </label>
                      <div className="row">
                        {product.features.map((feature, index) => (
                          <div
                            key={feature.id || index}
                            className="col-md-12 mb-3"
                          >
                            <div className="border rounded p-3">
                              <h6 className="text-primary mb-2">
                                <i className="fas fa-check-circle me-2"></i>
                                {feature.title}
                              </h6>
                              <p className="mb-0 small text-muted">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Low Stock Alert */}
            {product.quantity !== undefined &&
              product.quantity < 10 &&
              product.quantity > 0 && (
                <Alert variant="warning" className="mb-4">
                  <Alert.Heading className="h6">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Sắp hết hàng
                  </Alert.Heading>
                  <p className="mb-0 small">
                    Chỉ còn {product.quantity} sản phẩm trong kho. Đặt hàng sớm!
                  </p>
                </Alert>
              )}
          </Col>
        </Row>
      </Container>

      {/* Video Modal */}
      <Modal
        show={showVideoModal}
        onHide={() => setShowVideoModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-video text-primary me-2"></i>
            Video sản phẩm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedVideo && (
            <div className="position-relative">
              {/* Check if it's a YouTube URL */}
              {selectedVideo.includes("youtube.com") ||
              selectedVideo.includes("youtu.be") ? (
                <div className="ratio ratio-16x9">
                  <iframe
                    src={selectedVideo
                      .replace("watch?v=", "embed/")
                      .replace("youtu.be/", "youtube.com/embed/")}
                    title="Product video"
                    allowFullScreen
                    style={{ border: "none" }}
                  ></iframe>
                </div>
              ) : (
                <video
                  controls
                  className="w-100"
                  style={{ maxHeight: "400px" }}
                  src={selectedVideo}
                  aria-label="Product video playback"
                  onError={(e) => {
                    console.error("Video playback error:", e);
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Fallback message if video fails to load */}
              <div
                className="d-none text-center p-4 bg-light"
                style={{
                  minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div>
                  <i
                    className="fas fa-exclamation-triangle text-warning mb-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <p className="mb-0">Không thể phát video này.</p>
                  <small className="text-muted">
                    Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
                  </small>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section className="py-5 bg-light">
          <Container>
            <div className="mb-4">
              <h3 className="fw-bold mb-2">Sản phẩm đã xem gần đây</h3>
              <p className="text-muted mb-0">Dựa trên lịch sử xem của bạn</p>
            </div>
            <Row>
              {recentlyViewed.map((recentProduct) => (
                <Col key={recentProduct.id} xs={6} md={3} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm product-card">
                    <div
                      className="position-relative"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/productView/${recentProduct.id}`)
                      }
                    >
                      <img
                        src={getProductImages(recentProduct)[0]}
                        className="card-img-top"
                        alt={recentProduct.name}
                        style={{
                          height: "200px",
                          objectFit: "cover",
                        }}
                        onError={handleImageError}
                        loading="lazy"
                      />
                      {recentProduct.discount && (
                        <Badge
                          bg="danger"
                          className="position-absolute top-0 start-0 m-2"
                        >
                          -{recentProduct.discount}%
                        </Badge>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <h6
                        className="card-title fw-bold mb-2"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {recentProduct.name}
                      </h6>
                      <p className="text-muted mb-2 small">
                        {recentProduct.brand}
                      </p>
                      <div className="mt-auto">
                        <div className="h6 text-success fw-bold mb-2">
                          {formatPrice(recentProduct.price)}
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="w-100"
                          onClick={() =>
                            navigate(`/productView/${recentProduct.id}`)
                          }
                        >
                          Xem lại
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      <WigdetChat></WigdetChat>
      <Footer />
    </>
  );
};

export default ProductView;
