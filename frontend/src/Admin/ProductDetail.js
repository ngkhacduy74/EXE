// src/Pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Badge, Alert, Card, Carousel, Modal } from "react-bootstrap";
import HeaderAdmin from "../Components/HeaderAdmin";
import Sidebar from "../Components/Sidebar";
import ErrorPage from "../Components/ErrorPage";

const api = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 5000,
});

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        
        console.log("📦 Product ID:", productId);
        console.log("🔑 Token from localStorage:", token ? "Token exists" : "No token found");

        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        if (!productId) {
          setError("Product ID is missing from the URL.");
          setLoading(false);
          return;
        }

        const response = await api.get(`/product/${productId}`, {
          headers: {
            token,
            'Content-Type': 'application/json',
          },
        });

        console.log("✅ Product fetched successfully:", response.data);

        if (response.data.data) {
          setProduct(response.data.data);
        } else if (response.data.product) {
          setProduct(response.data.product);
        } else {
          setProduct(response.data);
        }

      } catch (err) {
        console.error("❌ Error fetching product:", err);
        
        if (err.response) {
          switch (err.response.status) {
            case 401:
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              setError("Session expired. Please log in again.");
              break;
            case 403:
              setError("Access denied. You don't have permission to view this product.");
              break;
            case 404:
              setError("Product not found. It may have been deleted or the ID is incorrect.");
              break;
            case 500:
              setError("Server error. Please try again later.");
              break;
            default:
              setError(`Error ${err.response.status}: ${err.response.data?.message || 'Unknown error occurred'}`);
          }
        } else if (err.request) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const getQuantityStatus = (quantity) => {
    if (quantity === undefined || quantity === null) return { variant: "secondary", text: "Unknown" };
    if (quantity === 0) return { variant: "danger", text: "Out of Stock" };
    if (quantity < 10) return { variant: "warning", text: "Low Stock" };
    return { variant: "success", text: "In Stock" };
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'success';
      case 'used': return 'warning';
      case 'refurbished': return 'info';
      default: return 'secondary';
    }
  };

  const handleVideoPlay = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShowVideoModal(true);
  };

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (loading) {
    return (
      <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
        <HeaderAdmin />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted">Loading product details...</h5>
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return <ErrorPage message="No product data available." />;
  }

  const quantityStatus = getQuantityStatus(product.quantity);

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Row>
        <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
          <Sidebar />
        </Col>
        <Col className="p-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Button variant="link" className="p-0 text-decoration-none" onClick={() => navigate('/products')}>
                  Products
                </Button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name || `Product #${productId}`}
              </li>
            </ol>
          </nav>

          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-2 text-primary">{product.name || 'Unnamed Product'}</h2>
              <div className="d-flex align-items-center gap-3">
                <p className="text-muted mb-0">ID: {product.Id || product.id || productId}</p>
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
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={() => navigate(`/products/edit/${productId}`)}>
                <i className="fas fa-edit me-1"></i>
                Edit Product
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left me-1"></i>
                Back
              </Button>
            </div>
          </div>

          <Row>
            {/* Media Section */}
            <Col lg={5}>
              {/* Images Carousel */}
              {product.image && product.image.length > 0 && (
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <i className="fas fa-images text-primary me-2"></i>
                      Product Images
                    </h6>
                    <small className="text-muted">
                      {Math.min(product.image.length, 3)} of {product.image.length} images
                    </small>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Carousel 
                      indicators={Math.min(product.image.length, 3) > 1}
                      controls={Math.min(product.image.length, 3) > 1}
                      interval={4000}
                      pause="hover"
                    >
                      {/* {product.image.slice(0, 3).map((img, index) => (
                        <Carousel.Item key={index}>
                          <div className="position-relative">
                            <img
                              className="d-block w-100"
                              src={img}
                              alt={`${product.name} - Image ${index + 1}`}
                              style={{ height: "350px", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/400x350?text=Image+Not+Found";
                              }}
                            />
                            <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-dark text-white p-2">
                              <small className="fw-bold">Image {index + 1} of {Math.min(product.image.length, 3)}</small>
                            </div>
                          </div>
                        </Carousel.Item>
                      ))} */}
                    </Carousel>
                    {product.image.length > 3 && (
                      <div className="p-3 bg-light border-top text-center">
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          Showing first 3 images. Total: {product.image.length} images available.
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}

              {/* Videos */}
              {product.video && product.video.length > 0 && (
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0">
                      <i className="fas fa-video text-primary me-2"></i>
                      Product Videos
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
                          >
                            <div className="position-absolute top-50 start-50 translate-middle text-white">
                              <i className="fas fa-play-circle" style={{ fontSize: "3rem" }}></i>
                            </div>
                            <div className="position-absolute bottom-0 start-0 end-0 bg-gradient text-white p-2">
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

            {/* Main Product Info */}
            <Col lg={7}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">
                    <i className="fas fa-info-circle text-primary me-2"></i>
                    Product Information
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">PRODUCT NAME</label>
                        <p className="fs-5 mb-0">{product.name || 'N/A'}</p>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">BRAND</label>
                        <p className="mb-0">{product.brand || 'N/A'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">PRICE</label>
                        <p className="fs-4 fw-bold text-success mb-0">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">STATUS</label>
                        <div>
                          <Badge bg={getStatusColor(product.status)} className="fs-6 px-3 py-2">
                            {product.status || 'Unknown'}
                          </Badge>
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">QUANTITY STATUS</label>
                        <div className="d-flex align-items-center">
                          <Badge bg={quantityStatus.variant} className="fs-6 px-3 py-2 me-2">
                            {quantityStatus.text}
                          </Badge>
                          <span className="text-muted">
                            ({product.quantity !== undefined ? `${product.quantity} units` : 'Unknown quantity'})
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">DIMENSIONS</label>
                        <p className="mb-0">{product.size || 'N/A'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">WEIGHT</label>
                        <p className="mb-0">{product.weight ? `${product.weight} kg` : 'N/A'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">WARRANTY</label>
                        <p className="mb-0">{product.warranty_period ? `${product.warranty_period} months` : 'N/A'}</p>
                      </div>
                    </Col>
                  </Row>

                  <hr className="my-4" />

                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold">DESCRIPTION</label>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-0" style={{ lineHeight: '1.6' }}>
                        {product.description || 'No description provided for this product.'}
                      </p>
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold">TECHNICAL SPECIFICATIONS</label>
                    <div className="bg-light p-3 rounded">
                      <Row>
                        {product.capacity && (
                          <Col md={6} className="mb-2">
                            <strong>Capacity:</strong> {product.capacity}L
                          </Col>
                        )}
                        {product.voltage && (
                          <Col md={6} className="mb-2">
                            <strong>Voltage:</strong> {product.voltage}
                          </Col>
                        )}
                        {product.weight && (
                          <Col md={6} className="mb-2">
                            <strong>Weight:</strong> {product.weight} kg
                          </Col>
                        )}
                        {product.size && (
                          <Col md={6} className="mb-2">
                            <strong>Dimensions:</strong> {product.size}
                          </Col>
                        )}
                      </Row>
                    </div>
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <label className="form-label text-muted small fw-bold">KEY FEATURES</label>
                      <div className="row">
                        {product.features.map((feature, index) => (
                          <div key={feature.id || index} className="col-md-6 mb-3">
                            <div className="border rounded p-3 h-100">
                              <h6 className="text-primary mb-2">
                                <i className="fas fa-check-circle me-2"></i>
                                {feature.title}
                              </h6>
                              <p className="mb-0 small text-muted">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                  <h6 className="mb-0">
                    <i className="fas fa-chart-bar text-primary me-2"></i>
                    Quick Stats
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3} className="text-center mb-3">
                      <div className="bg-primary text-white rounded p-3">
                        <h4 className="mb-1">{product.quantity || 0}</h4>
                        <small>Quantity</small>
                      </div>
                    </Col>
                    <Col md={3} className="text-center mb-3">
                      <div className="bg-success text-white rounded p-3">
                        <h4 className="mb-1">{formatPrice(product.price).replace('₫', '')}</h4>
                        <small>Price (VND)</small>
                      </div>
                    </Col>
                    <Col md={3} className="text-center mb-3">
                      <div className="bg-info text-white rounded p-3">
                        <h4 className="mb-1">{product.warranty_period || 0}</h4>
                        <small>Warranty (months)</small>
                      </div>
                    </Col>
                    <Col md={3} className="text-center mb-3">
                      <div className="bg-warning text-white rounded p-3">
                        <h4 className="mb-1">{product.weight || 0}</h4>
                        <small>Weight (kg)</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Low Quantity Alert */}
              {product.quantity !== undefined && product.quantity < 10 && (
                <Alert variant="warning" className="mb-4">
                  <Alert.Heading className="h6">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Low Quantity Alert
                  </Alert.Heading>
                  <p className="mb-0 small">
                    This product is running low on quantity ({product.quantity} units remaining). 
                    Consider restocking soon.
                  </p>
                </Alert>
              )}
            </Col>
          </Row>

        
        </Col>
      </Row>

      {/* Video Modal */}
      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Product Video</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedVideo && (
            <video
              controls
              className="w-100"
              style={{ maxHeight: "400px" }}
              src={selectedVideo}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProductDetail;