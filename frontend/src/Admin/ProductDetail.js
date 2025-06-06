// src/Pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the current token from localStorage
        const token = localStorage.getItem("token");
        
        console.log("📦 Product ID from URL:", productId);
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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("✅ Product fetched successfully:", response.data);

        // Handle different response structures
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
              // Token might be expired, try to refresh or redirect to login
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              setError("Session expired. Please log in again.");
              // Optionally redirect to login
              // navigate("/login");
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
  }, [productId, navigate]); // Added navigate to dependencies

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (loading) {
    return (
      <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
        <HeaderAdmin />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading product details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return <ErrorPage message="No product data available." />;
  }

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Row>
        <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
          <Sidebar />
        </Col>
        <Col style={{ marginLeft: "10px" }} className="p-4">
          <h3 className="mb-4">Product Details</h3>
          <div className="card shadow-sm p-4">
            {/* Safely access product properties */}
            <p><strong>Product ID:</strong> {product.Id || product.id || productId}</p>
            <p><strong>Name:</strong> {product.name || 'N/A'}</p>
            <p><strong>Description:</strong> {product.description || 'N/A'}</p>
            <p><strong>Price:</strong> {product.price ? `$${product.price}` : 'N/A'}</p>
            <p><strong>Category:</strong> {product.category || 'N/A'}</p>
            <p><strong>Stock:</strong> {product.stock !== undefined ? product.stock : 'N/A'}</p>
            
            {/* Display all available product properties for debugging */}
            <details className="mt-3">
              <summary>Debug: All Product Data</summary>
              <pre className="mt-2 p-2 bg-light border rounded">
                {JSON.stringify(product, null, 2)}
              </pre>
            </details>
            
            <div className="mt-4">
              <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
                Back
              </Button>
              
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;