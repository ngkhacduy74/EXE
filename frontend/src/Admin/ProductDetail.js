import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner } from "react-bootstrap"; // Optional: Add Bootstrap for styling

const ProductDetails = () => {
  const { productId } = useParams(); // Use useParams to get productId from URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is missing");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/product/${productId}` // Use environment variable
        );

        // Handle different response structures
        const productData = response.data?.product?.[0] || response.data;
        if (!productData) {
          throw new Error("No product data found");
        }
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Loading product details...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Card className="text-center p-4">
          <Card.Title className="text-danger">Error</Card.Title>
          <Card.Text>{error}</Card.Text>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Card className="text-center p-4">
          <Card.Title>Product Not Found</Card.Title>
          <Card.Text>The requested product could not be found.</Card.Text>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>
            <strong>Price:</strong> ${product.price}
          </Card.Text>
          <Card.Text>
            <strong>Description:</strong> {product.description || "No description available"}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductDetails;