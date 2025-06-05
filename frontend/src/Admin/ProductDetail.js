import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { ArrowLeft, Package, ShoppingCart, Heart, Share2, Star, MapPin, Clock, Shield } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import HeaderAdmin from '../Components/HeaderAdmin';

// Create axios instance outside component to avoid recreation
const api = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 5000,
});

// Custom hook for token management
const useTokenManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [tokens, setTokens] = useState(() => {
    // Initialize tokens from location state or localStorage
    const locationToken = location.state?.token;
    const locationRefreshToken = location.state?.refresh_token;
    
    if (locationToken && locationRefreshToken) {
      return {
        accessToken: locationToken,
        refreshToken: locationRefreshToken
      };
    }
    
    try {
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken") || localStorage.getItem("refresh_token");
      return {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null
      };
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return { accessToken: null, refreshToken: null };
    }
  });

  // Update tokens when location state changes
  useEffect(() => {
    const locationToken = location.state?.token;
    const locationRefreshToken = location.state?.refresh_token;
    
    if (locationToken && locationRefreshToken) {
      console.log("✅ Updating tokens from location state");
      
      setTokens({
        accessToken: locationToken,
        refreshToken: locationRefreshToken
      });
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem("token", locationToken);
        localStorage.setItem("refreshToken", locationRefreshToken);
      } catch (error) {
        console.error("Error saving tokens to localStorage:", error);
      }
    }
  }, [location.state]);

  const refreshAccessToken = useCallback(async () => {
    if (!tokens.refreshToken) {
      throw new Error("No refresh token available");
    }
    
    try {
      console.log("Refreshing access token...");
      const response = await api.post("/auth/refresh-token", {
        refresh_token: tokens.refreshToken,
      });
      
      const { token, refresh_token } = response.data;
      if (!token || !refresh_token) {
        throw new Error("Invalid refresh token response");
      }
      
      const newTokens = {
        accessToken: token,
        refreshToken: refresh_token,
      };
      
      // Update state and localStorage
      setTokens(newTokens);
      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refresh_token);
      
      return token;
    } catch (err) {
      console.error("Refresh token error:", err.response?.data);
      
      if (err.response?.status === 401 || err.response?.status === 400) {
        // Clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        setTokens({ accessToken: null, refreshToken: null });
        navigate("/login", { replace: true });
      }
      throw err;
    }
  }, [tokens.refreshToken, navigate]);

  const makeAuthenticatedRequest = useCallback(async (config, retryCount = 0) => {
    if (!tokens.accessToken) {
      throw new Error('No access token available');
    }

    const requestConfig = {
      ...config,
      headers: {
        ...config.headers,
        token: tokens.accessToken,
      },
    };

    try {
      return await api.request(requestConfig);
    } catch (err) {
      // Handle 401 with token refresh
      if (err.response?.status === 401 && retryCount === 0 && tokens.refreshToken) {
        console.warn('Access token expired. Attempting to refresh...');
        try {
          await refreshAccessToken();
          return makeAuthenticatedRequest(config, 1); // Retry once
        } catch (refreshErr) {
          throw new Error('Session expired. Please log in again.');
        }
      }
      
      // Handle other errors
      if (err.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      
      if (!err.response) {
        throw new Error('Server connection error. Please check your connection.');
      }
      
      throw err;
    }
  }, [tokens.accessToken, tokens.refreshToken, refreshAccessToken]);

  return {
    tokens,
    refreshAccessToken,
    makeAuthenticatedRequest,
    hasValidTokens: Boolean(tokens.accessToken && tokens.refreshToken)
  };
};

// Enhanced Loading Component with Animation
const LoadingSpinner = () => (
  <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
    <HeaderAdmin />
    <Row>
      <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
        <Sidebar />
      </Col>
      <Col className="p-4 d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="text-center">
          <div className="mb-4">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          </div>
          <h4 className="text-muted mb-2">Loading Product Details</h4>
          <p className="text-muted">Please wait while we fetch the product information...</p>
        </div>
      </Col>
    </Row>
  </Container>
);

// Enhanced Error Component
const ErrorAlert = ({ error, onRetry, onLogin, onGoBack }) => (
  <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
    <HeaderAdmin />
    <Row>
      <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
        <Sidebar />
      </Col>
      <Col className="p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <Card className="shadow-lg border-0" style={{ maxWidth: '600px', width: '100%' }}>
            <Card.Body className="p-5 text-center">
              <div className="mb-4">
                <Package size={64} className="text-danger mb-3" />
                <h2 className="text-danger mb-3">Oops! Something went wrong</h2>
                <p className="text-muted mb-4">{error}</p>
              </div>
              
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {error.includes("Session expired") ? (
                  <Button variant="primary" size="lg" onClick={onLogin}>
                    <ArrowLeft size={18} className="me-2" />
                    Go to Login
                  </Button>
                ) : (
                  <>
                    <Button variant="outline-secondary" onClick={onRetry}>
                      <Package size={18} className="me-2" />
                      Try Again
                    </Button>
                    <Button variant="primary" onClick={onGoBack}>
                      <ArrowLeft size={18} className="me-2" />
                      Go Back
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Col>
    </Row>
  </Container>
);

// Enhanced Product Card with Premium Styling
const ProductCard = ({ product, onGoBack }) => {
  const formattedPrice = useMemo(() => {
    return parseFloat(product.price).toLocaleString("vi-VN", {
      style: 'currency',
      currency: 'VND'
    });
  }, [product.price]);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} - ${formattedPrice}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="mb-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb bg-transparent p-0">
          <li className="breadcrumb-item">
            <Button variant="link" className="text-decoration-none p-0" onClick={onGoBack}>
              <ArrowLeft size={16} className="me-1" />
              Products
            </Button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Card */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <Row className="g-0">
          {/* Product Image Section */}
          <Col lg={6}>
            <div className="position-relative" style={{ height: '500px' }}>
              <img
                src={imageError ? 'https://via.placeholder.com/500x500?text=No+Image+Available' : (product.imageUrl || 'https://via.placeholder.com/500x500?text=Product+Image')}
                alt={product.name}
                className="img-fluid w-100 h-100 object-fit-cover"
                onError={() => setImageError(true)}
                style={{ objectPosition: 'center' }}
              />
              
              {/* Image Overlay with Actions */}
              <div className="position-absolute top-0 end-0 p-3">
                <div className="d-flex flex-column gap-2">
                  <Button
                    variant={isWishlisted ? "danger" : "light"}
                    size="sm"
                    className="rounded-circle p-2 shadow-sm"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    style={{ width: '40px', height: '40px' }}
                  >
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    className="rounded-circle p-2 shadow-sm"
                    onClick={handleShare}
                    style={{ width: '40px', height: '40px' }}
                  >
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Status Badge */}
              {product.status && (
                <div className="position-absolute bottom-0 start-0 p-3">
                  <Badge 
                    bg={product.status === 'New' ? 'success' : 'warning'} 
                    className="px-3 py-2 fs-6 shadow-sm"
                  >
                    <Shield size={14} className="me-1" />
                    {product.status}
                  </Badge>
                </div>
              )}
            </div>
          </Col>

          {/* Product Information Section */}
          <Col lg={6}>
            <Card.Body className="p-5 h-100 d-flex flex-column">
              {/* Product Header */}
              <div className="mb-4">
                <h1 className="display-6 fw-bold text-dark mb-3">{product.name}</h1>
                
                {/* Rating (Placeholder) */}
                <div className="d-flex align-items-center mb-3">
                  <div className="d-flex text-warning me-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <small className="text-muted">(4.0) • 24 reviews</small>
                </div>
                
                {/* Price */}
                <div className="mb-4">
                  <h2 className="text-primary mb-0 display-5 fw-bold">{formattedPrice}</h2>
                  <small className="text-muted">Price includes VAT</small>
                </div>
              </div>

              {/* Product Details Grid */}
              <div className="mb-4">
                <Row className="g-3">
                  {product.brand && (
                    <Col sm={6}>
                      <div className="p-3 bg-light rounded-3">
                        <small className="text-muted d-block">Brand</small>
                        <strong className="text-dark">{product.brand}</strong>
                      </div>
                    </Col>
                  )}
                  
                  {product.capacity && (
                    <Col sm={6}>
                      <div className="p-3 bg-light rounded-3">
                        <small className="text-muted d-block">Capacity</small>
                        <strong className="text-dark">{product.capacity} kg</strong>
                      </div>
                    </Col>
                  )}
                  
                  <Col sm={6}>
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">Availability</small>
                      <span className="text-success fw-semibold">
                        <Package size={14} className="me-1" />
                        In Stock
                      </span>
                    </div>
                  </Col>
                  
                  <Col sm={6}>
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">Delivery</small>
                      <span className="text-info fw-semibold">
                        <Clock size={14} className="me-1" />
                        2-3 days
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-4">
                  <h3 className="h5 mb-3 text-dark">Description</h3>
                  <p className="text-muted lh-lg">{product.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto">
                <Row className="g-3">
                  <Col>
                    <Button variant="primary" size="lg" className="w-100 py-3">
                      <ShoppingCart size={20} className="me-2" />
                      Add to Cart
                    </Button>
                  </Col>
                  <Col>
                    <Button variant="success" size="lg" className="w-100 py-3">
                      Buy Now
                    </Button>
                  </Col>
                </Row>
                
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    <MapPin size={14} className="me-1" />
                    Free shipping within Hanoi • 30-day return policy
                  </small>
                </div>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Additional Information Tabs */}
      <Card className="mt-4 shadow-sm border-0">
        <Card.Header className="bg-white border-0 py-3">
          <h4 className="mb-0">Additional Information</h4>
        </Card.Header>
        <Card.Body className="p-4">
          <Row>
            <Col md={6}>
              <h5 className="text-dark mb-3">Specifications</h5>
              <ul className="list-unstyled">
                {product.brand && <li className="mb-2"><strong>Brand:</strong> {product.brand}</li>}
                {product.capacity && <li className="mb-2"><strong>Capacity:</strong> {product.capacity} kg</li>}
                <li className="mb-2"><strong>Condition:</strong> {product.status || 'N/A'}</li>
                <li className="mb-2"><strong>Warranty:</strong> 1 Year Manufacturer Warranty</li>
              </ul>
            </Col>
            <Col md={6}>
              <h5 className="text-dark mb-3">Delivery & Returns</h5>
              <ul className="list-unstyled">
                <li className="mb-2">✅ Free shipping on orders over 500,000 VND</li>
                <li className="mb-2">✅ 2-3 business days delivery</li>
                <li className="mb-2">✅ 30-day return policy</li>
                <li className="mb-2">✅ Professional installation available</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

// Token Status Component (Development Only)
const TokenStatus = ({ tokens, onRefresh, fromLocationState }) => (
  <Alert variant={tokens.accessToken && tokens.refreshToken ? 'success' : 'warning'} className="mb-4">
    <Row className="g-2">
      <Col md={6}>
        <small className={`text-${tokens.accessToken ? 'success' : 'danger'}`}>
          {tokens.accessToken ? '✅' : '❌'} Access Token: {
            tokens.accessToken ? `${tokens.accessToken.substring(0, 15)}...` : 'Not found'
          }
        </small>
      </Col>
      <Col md={6}>
        <small className={`text-${tokens.refreshToken ? 'success' : 'danger'}`}>
          {tokens.refreshToken ? '✅' : '❌'} Refresh Token: {
            tokens.refreshToken ? `${tokens.refreshToken.substring(0, 15)}...` : 'Not found'
          }
        </small>
      </Col>
    </Row>
    
    {tokens.accessToken && tokens.refreshToken && (
      <div className="mt-2">
        <Button size="sm" variant="outline-primary" onClick={onRefresh}>
          Refresh Token
        </Button>
      </div>
    )}
    
    {fromLocationState && (
      <div className="mt-2">
        <small className="text-info">📍 Tokens loaded from navigation state</small>
      </div>
    )}
  </Alert>
);

// Main Component
function ProductDetail({ productId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tokens, refreshAccessToken, makeAuthenticatedRequest, hasValidTokens } = useTokenManager();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized handlers
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleLogin = useCallback(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleRefreshToken = useCallback(async () => {
    try {
      await refreshAccessToken();
    } catch (err) {
      console.error('Manual token refresh failed:', err);
    }
  }, [refreshAccessToken]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!hasValidTokens) {
        setError("Please log in to view product details.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching product with ID:', productId);
        
        const response = await makeAuthenticatedRequest({
          method: 'GET',
          url: `/product/${productId}`,
        });

        // Handle different response structures
        let productData;
        if (response.data.product && Array.isArray(response.data.product)) {
          productData = response.data.product[0];
        } else if (response.data.data) {
          productData = response.data.data;
        } else {
          productData = response.data;
        }

        // Validate required fields
        if (!productData || !productData.name || productData.price === undefined) {
          throw new Error('Invalid product data received from server');
        }

        setProduct(productData);
        console.log('Product loaded successfully:', productData.name);

      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message || 'Failed to load product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, hasValidTokens, makeAuthenticatedRequest]);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return (
      <ErrorAlert 
        error={error} 
        onRetry={handleRetry}
        onLogin={handleLogin}
        onGoBack={handleGoBack}
      />
    );
  }

  // No product found
  if (!product) {
    return (
      <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
        <HeaderAdmin />
        <Row>
          <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
            <Sidebar />
          </Col>
          <Col className="p-4">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
              <Card className="shadow-lg border-0 text-center p-5">
                <Package size={64} className="text-muted mb-3 mx-auto" />
                <h3 className="text-muted mb-3">Product Not Found</h3>
                <p className="text-muted mb-4">The requested product could not be found.</p>
                <Button variant="primary" onClick={handleGoBack}>
                  <ArrowLeft size={18} className="me-2" />
                  Go Back
                </Button>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Success state
  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Row>
        <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
          <Sidebar />
        </Col>
        <Col className="p-4">
          {/* Development: Token Status Display */}
          {process.env.NODE_ENV === 'development' && (
            <TokenStatus 
              tokens={tokens}
              onRefresh={handleRefreshToken}
              fromLocationState={Boolean(location.state?.token)}
            />
          )}

          {/* Product Details */}
          <ProductCard product={product} onGoBack={handleGoBack} />
        </Col>
      </Row>
    </Container>
  );
}

ProductDetail.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default ProductDetail;