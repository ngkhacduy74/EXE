import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import HeaderAdmin from "../Components/HeaderAdmin";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const getAuthToken = useCallback(() => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token retrieved:", token);
      return token;
    } catch (err) {
      console.warn("localStorage not available:", err);
      return null;
    }
  }, []);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setError("Product ID is missing");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      // Setup axios config with headers
      const config = {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Add Authorization header only if token exists
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        // OR if your API expects just 'token' as key:
        // config.headers['token'] = token;
      }

      console.log("Request config:", config);

      const response = await axios.get(
        `http://localhost:4000/product/${productId}`,
        config
      );

      console.log("API Response:", response.data);

      // Handle different response structures
      let productData;
      if (response.data?.product && Array.isArray(response.data.product)) {
        productData = response.data.product[0];
      } else if (response.data?.product) {
        productData = response.data.product;
      } else {
        productData = response.data;
      }
      
      if (!productData) {
        throw new Error("No product data found");
      }
      
      setProduct(productData);
    } catch (err) {
      console.error("Error fetching product:", err);
      
      if (err.code === 'ECONNABORTED') {
        setError("Request timed out. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized access. Please log in again.");
        // Optionally redirect to login
        // navigate('/login');
      } else if (err.response?.status === 404) {
        setError("Product not found.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to fetch product details");
      }
    } finally {
      setLoading(false);
    }
  }, [productId, getAuthToken]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleRetry = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    navigate(`/admin/products/edit/${productId}`);
  }, [navigate, productId]);

  const handleDelete = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = getAuthToken();
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        await axios.delete(`http://localhost:4000/product/${productId}`, config);
        navigate('/admin/products');
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete product");
      }
    }
  }, [productId, getAuthToken, navigate]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center" role="status" aria-live="polite">
          <Spinner animation="border" role="status" aria-hidden="true" />
          <div className="mt-2">Loading product details...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <HeaderAdmin />
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error Loading Product</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-danger" onClick={handleRetry}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-4">
        <HeaderAdmin />
        <Alert variant="warning" className="text-center">
          <Alert.Heading>Product Not Found</Alert.Heading>
          <p>The requested product could not be found.</p>
          <Button variant="secondary" onClick={handleGoBack}>
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <HeaderAdmin />
      
      {/* Back button */}
      <div className="mb-3">
        <Button variant="outline-secondary" onClick={handleGoBack} className="mb-3">
          ← Back to Products
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title as="h1">{product.name}</Card.Title>
          
          <div className="row">
            <div className="col-md-8">
              <Card.Text>
                <strong>Description:</strong>{" "}
                {product.description || "No description available"}
              </Card.Text>
              
              {product.category && (
                <Card.Text>
                  <strong>Category:</strong> {product.category}
                </Card.Text>
              )}
              
              {product.sku && (
                <Card.Text>
                  <strong>SKU:</strong> {product.sku}
                </Card.Text>
              )}

              {product.id && (
                <Card.Text>
                  <strong>Product ID:</strong> {product.id}
                </Card.Text>
              )}
            </div>
            
            <div className="col-md-4">
              <Card className="bg-light">
                <Card.Body>
                  <Card.Title as="h3" className="h4">Price</Card.Title>
                  <Card.Text className="h2 text-primary">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00'}
                  </Card.Text>
                  
                  {product.stock !== undefined && (
                    <Card.Text>
                      <strong>Stock:</strong>{" "}
                      <span className={product.stock > 0 ? "text-success" : "text-danger"}>
                        {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                      </span>
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
          
          {/* Product image if available */}
          {product.image && (
            <div className="mt-3">
              <img 
                src={product.image} 
                alt={product.name || "Product image"}
                className="img-fluid rounded"
                style={{ maxHeight: "400px" }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-4 d-flex gap-2">
            <Button variant="primary" onClick={handleEdit}>
              Edit Product
            </Button>
            <Button variant="outline-danger" onClick={handleDelete}>
              Delete Product
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductDetails;