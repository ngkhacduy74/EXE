import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Badge, Alert, Card, Modal, Spinner } from 'react-bootstrap';
import HeaderAdmin from '../Components/HeaderAdmin';
import Sidebar from '../Components/Sidebar';
import ErrorPage from '../Components/ErrorPage';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  timeout: 5000,
});

const convertToEmbedUrl = (url) => {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?]+)/
  );
  return videoIdMatch
    ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
    : url;
};

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedVideoType, setSelectedVideoType] = useState(''); // 'youtube' or 'direct'
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!productId) {
        setError('Product ID is missing from the URL.');
        return;
      }

      const response = await api.get(`/product/${productId}`, {
        headers: {
          token,
          'Content-Type': 'application/json',
        },
      });

      const productData = response.data.data || response.data.product || response.data;
      setProduct(productData);
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setError('Session expired. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
            break;
          case 403:
            setError('Access denied. You dont have permission to view this product.');
            break;
          case 404:
            setError('Product not found. It may have been deleted or the ID is incorrect.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(`Error ${err.response.status}: ${err.response.data?.message || 'Unknown error occurred'}`);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId, navigate]);

  const getQuantityStatus = useCallback((quantity) => {
    if (quantity === undefined || quantity === null) return { variant: 'secondary', text: 'Unknown' };
    if (quantity === 0) return { variant: 'danger', text: 'Out of Stock' };
    if (quantity < 10) return { variant: 'warning', text: 'Low Stock' };
    return { variant: 'success', text: 'In Stock' };
  }, []);

  const formatPrice = useCallback((price) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'success';
      case 'used': return 'warning';
      case 'refurbished': return 'info';
      case 'second hand': return 'warning';
      default: return 'secondary';
    }
  }, []);

  const getProductImages = useCallback((product) => {
    if (Array.isArray(product?.image) && product.image.length > 0) {
      return product.image.filter(img => img && typeof img === 'string');
    } else if (typeof product?.image === 'string' && product.image) {
      return [product.image];
    }
    return ['https://fushimavina.com/data/data/files/test/may-lam-da-100kg.jpg'];
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://fushimavina.com/data/data/files/test/may-lam-da-100kg.jpg';
  };

  const handleVideoPlay = (videoUrl) => {
    if (videoUrl && typeof videoUrl === 'string') {
      setSelectedVideo(videoUrl);
      // Kiểm tra xem có phải YouTube video không
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        setSelectedVideoType('youtube');
      } else {
        setSelectedVideoType('direct');
      }
      setShowVideoModal(true);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    if (product) {
      // Placeholder for cart logic
      alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
    }
  };

  if (loading) {
    return (
      <Container fluid className="bg-light" style={{ minHeight: '100vh' }}>
        <HeaderAdmin />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <Card className="shadow-sm w-100" style={{ maxWidth: '600px' }}>
            <Card.Body>
              <div className="placeholder-glow">
                <div className="placeholder col-6 mb-3" style={{ height: '30px' }}></div>
                <div className="placeholder col-12 mb-3" style={{ height: '200px' }}></div>
                <div className="placeholder col-4" style={{ height: '20px' }}></div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    );
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (!product) {
    return <ErrorPage message="No product data available." />;
  }

  const images = getProductImages(product);
  const quantityStatus = getQuantityStatus(product.quantity);

  return (
    <Container fluid className="bg-light" style={{ minHeight: '100vh' }}>
      <HeaderAdmin />
      <Row>
        <Col md="auto" style={{ width: '250px', background: '#2c3e50', color: 'white', padding: 0 }}>
          <Sidebar />
        </Col>
        <Col className="p-4">
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

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-2 text-primary">{product.name || 'Unnamed Product'}</h2>
              <div className="d-flex align-items-center gap-3">
                <p className="text-muted mb-0">ID: {product.id || productId}</p>
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
                <i className="fas fa-edit me-1"></i> Edit Product
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left me-1"></i> Back
              </Button>
            </div>
          </div>

          <Row>
            <Col lg={5}>
              <Card className="shadow-sm mb-4">
                <Card.Body className="p-0">
                  <div className="position-relative">
                    <img
                      src={images[selectedImageIndex]}
                      alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                      className="img-fluid rounded"
                      style={{ width: '100%', maxHeight: 'fit-content', objectFit: 'cover' }}
                      onError={handleImageError}
                      loading="lazy"
                    />
                    {product.discount && (
                      <Badge bg="success" className="position-absolute top-0 start-0 m-3 fs-6">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="d-flex gap-2 flex-wrap mt-3 p-3">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className={`img-thumbnail ${selectedImageIndex === index ? 'border-primary' : ''}`}
                          style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => setSelectedImageIndex(index)}
                          onError={handleImageError}
                          loading="lazy"
                          role="button"
                          aria-label={`Select image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>

              {product.video && Array.isArray(product.video) && product.video.length > 0 && (
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0">
                      <i className="fas fa-video text-primary me-2"></i> Product Videos
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {product.video.map((vid, index) => (
                        <Col key={index} xs={6} className="mb-3">
                          {vid.includes("youtube.com") || vid.includes("youtu.be") ? (
                            <div 
                              className="ratio ratio-16x9 position-relative"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleVideoPlay(vid)}
                            >
                              <iframe
                                src={convertToEmbedUrl(vid)}
                                title={`YouTube video ${index + 1}`}
                                allowFullScreen
                                className="rounded"
                                style={{ pointerEvents: 'none' }}
                              ></iframe>
                              <div 
                                className="position-absolute top-50 start-50 translate-middle"
                                style={{ 
                                  background: 'rgba(0,0,0,0.7)', 
                                  borderRadius: '50%', 
                                  padding: '15px',
                                  color: 'white',
                                  fontSize: '24px'
                                }}
                              >
                                <i className="fas fa-expand-alt"></i>
                              </div>
                            </div>
                          ) : (
                            <div className="position-relative" style={{ cursor: 'pointer' }}>
                              <video
                                src={vid}
                                className="w-100 rounded"
                                style={{ height: "200px", objectFit: "cover" }}
                                onClick={() => handleVideoPlay(vid)}
                              ></video>
                              <div 
                                className="position-absolute top-50 start-50 translate-middle"
                                style={{ 
                                  background: 'rgba(0,0,0,0.7)', 
                                  borderRadius: '50%', 
                                  padding: '15px',
                                  color: 'white',
                                  fontSize: '24px',
                                  pointerEvents: 'none'
                                }}
                              >
                                <i className="fas fa-play"></i>
                              </div>
                            </div>
                          )}
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Col>

            <Col lg={7}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">
                    <i className="fas fa-info-circle text-primary me-2"></i> Product Information
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
                        <p className="fs-4 fw-bold text-success mb-0">{formatPrice(product.price)}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">STATUS</label>
                        <Badge bg={getStatusColor(product.status)} className="fs-6 px-3 py-2">
                          {product.status || 'Unknown'}
                        </Badge>
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
                        <label className="form-label text-muted small fw-bold">CATEGORY</label>
                        <p className="mb-0">{product.category || 'N/A'}</p>
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

              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                  <h6 className="mb-0">
                    <i className="fas fa-cart-plus text-primary me-2"></i> Purchase Options
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="align-items-center mb-4">
                    <Col sm={6}>
                      <label className="form-label fw-medium">Quantity:</label>
                      <div className="input-group" style={{ width: '150px' }}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => handleQuantityChange(-1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <input
                          type="text"
                          className="form-control text-center fw-medium"
                          value={quantity}
                          readOnly
                          aria-label="Current quantity"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => handleQuantityChange(1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-100 mb-3 py-3 fw-medium"
                        onClick={handleAddToCart}
                        disabled={product.quantity === 0}
                      >
                        <i className="fas fa-shopping-cart me-2"></i>
                        Add to Cart
                      </Button>
                      <Button
                        variant="success"
                        size="lg"
                        className="w-100 py-3 fw-medium"
                        onClick={() => alert('Proceeding to checkout...')}
                        disabled={product.quantity === 0}
                      >
                        <i className="fas fa-bolt me-2"></i>
                        Buy Now
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {product.quantity !== undefined && product.quantity < 10 && (
                <Alert variant="warning" className="mb-4">
                  <Alert.Heading className="h6">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Low Quantity Alert
                  </Alert.Heading>
                  <p className="mb-0 small">
                    This product is running low on quantity ({product.quantity} units remaining). Consider restocking soon.
                  </p>
                </Alert>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Video Modal */}
      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-video me-2"></i>
            {product.name} - Product Video
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedVideo && selectedVideoType === 'youtube' ? (
            <div className="ratio ratio-16x9">
              <iframe
                src={convertToEmbedUrl(selectedVideo)}
                title="Product video"
                allowFullScreen
                className="w-100"
                style={{ minHeight: '400px' }}
              ></iframe>
            </div>
          ) : selectedVideo && selectedVideoType === 'direct' ? (
            <video
              controls
              autoPlay
              className="w-100"
              style={{ maxHeight: '600px' }}
              src={selectedVideo}
              aria-label="Product video playback"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center p-4">
              <p>Video không thể tải được.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
            <i className="fas fa-times me-2"></i>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDetail;