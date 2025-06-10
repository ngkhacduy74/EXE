import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Spinner, Alert, Button, Badge } from 'react-bootstrap';

const ProductView = () => {
  const { id } = useParams(); // Lấy id từ URL params
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Function để fetch chi tiết sản phẩm
  const fetchProductDetail = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/product/${productId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            token: 'token' // Thay thế bằng token thực tế của bạn
          }
        }
      );

      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product detail:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail(id);
    }
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  // Get product images (handle array format)
  const getProductImages = (product) => {
    if (Array.isArray(product.image) && product.image.length > 0) {
      return product.image;
    } else if (typeof product.image === 'string') {
      return [product.image];
    }
    return ['https://via.placeholder.com/500x500?text=No+Image'];
  };

  // Handle image load error
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    console.log(`Add to cart: ${product?.name} - Quantity: ${quantity}`);
    // Implement your cart logic here
    alert(`Đã thêm ${quantity} sản phẩm "${product?.name}" vào giỏ hàng!`);
  };

  // Loading state
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Đang tải chi tiết sản phẩm...</span>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Lỗi!</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </Alert>
      </Container>
    );
  }

  // No product found
  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Không tìm thấy sản phẩm!</Alert.Heading>
          <p>Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
          <Button variant="outline-warning" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </Alert>
      </Container>
    );
  }

  const images = getProductImages(product);

  return (
    <Container className="py-5">
      <Row>
        {/* Breadcrumb */}
        <Col xs={12} className="mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Button variant="link" className="p-0 text-decoration-none" onClick={() => navigate('/')}>
                  Trang chủ
                </Button>
              </li>
              <li className="breadcrumb-item">
                <Button variant="link" className="p-0 text-decoration-none" onClick={() => navigate(-1)}>
                  Sản phẩm
                </Button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </Col>

        {/* Product Images */}
        <Col lg={6} className="mb-4">
          <div className="product-images">
            {/* Main Image */}
            <div className="main-image mb-3">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="img-fluid rounded shadow"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                onError={handleImageError}
              />
              {product.discount && (
                <Badge bg="success" className="position-absolute top-0 start-0 m-3 fs-6">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="d-flex gap-2 flex-wrap">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`img-thumbnail cursor-pointer ${
                      selectedImageIndex === index ? 'border-primary' : ''
                    }`}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                    onError={handleImageError}
                  />
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Product Info */}
        <Col lg={6}>
          <div className="product-info">
            {/* Product Title & Brand */}
            <h1 className="h2 fw-bold mb-3">{product.name}</h1>
            <p className="text-muted mb-3 fs-5">
              <strong>Thương hiệu:</strong> {product.brand || 'N/A'}
            </p>

            {/* Status Badge */}
            <div className="mb-3">
              <Badge 
                bg={product.status === 'Second Hand' ? 'warning' : 'success'} 
                className="fs-6 px-3 py-2"
              >
                {product.status || 'N/A'}
              </Badge>
            </div>

            {/* Rating */}
            <div className="d-flex align-items-center mb-3">
              <span className="text-warning me-2 fs-5">★★★★☆</span>
              <small className="text-muted">(4.0) • 150 đánh giá</small>
            </div>

            {/* Price */}
            <div className="price-section mb-4">
              <h3 className="text-success fw-bold mb-0">
                {product.price
                  ? new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(product.price)
                  : 'Liên hệ'}
              </h3>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-4">
                <h5 className="fw-bold mb-2">Mô tả sản phẩm:</h5>
                <p className="text-muted" style={{ lineHeight: '1.6' }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="mb-4">
              <Row>
                <Col sm={6}>
                  <p><strong>Danh mục:</strong> {product.category || 'N/A'}</p>
                </Col>
                <Col sm={6}>
                  <p><strong>Tình trạng:</strong> Còn hàng</p>
                </Col>
              </Row>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="purchase-section">
              <Row className="align-items-center mb-4">
                <Col sm={6}>
                  <label className="form-label fw-medium">Số lượng:</label>
                  <div className="input-group" style={{ width: '150px' }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleQuantityChange(-1)}
                    >
                      −
                    </button>
                    <input
                      type="text"
                      className="form-control text-center fw-medium"
                      value={quantity}
                      readOnly
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleQuantityChange(1)}
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
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Thêm vào giỏ hàng
                  </Button>
                  
                  <Button
                    variant="success"
                    size="lg"
                    className="w-100 py-3 fw-medium"
                  >
                    <i className="fas fa-bolt me-2"></i>
                    Mua ngay
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Additional Product Details */}
      <Row className="mt-5">
        <Col xs={12}>
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0 fw-bold">Thông tin chi tiết</h5>
            </div>
            <div className="card-body">
              <Row>
                <Col md={6}>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Tên sản phẩm:</strong></td>
                        <td>{product.name}</td>
                      </tr>
                      <tr>
                        <td><strong>Thương hiệu:</strong></td>
                        <td>{product.brand || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Tình trạng:</strong></td>
                        <td>{product.status || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={6}>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Danh mục:</strong></td>
                        <td>{product.category || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Giá:</strong></td>
                        <td className="text-success fw-bold">
                          {product.price
                            ? new Intl.NumberFormat('vi-VN', { 
                                style: 'currency', 
                                currency: 'VND' 
                              }).format(product.price)
                            : 'Liên hệ'}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Mã sản phẩm:</strong></td>
                        <td>#{product.id}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductView;