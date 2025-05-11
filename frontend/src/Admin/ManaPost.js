import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/product/");
        // Log the response for debugging
        console.log("API Response:", response.data);

        // Extract the product array from response.data.data
        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        
        setProducts(productData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch products. Please try again later.");
        setProducts([]); // Ensure products remains an array
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === "New" ? "Discontinued" : "New"; // Adjust based on your API
    try {
      await axios.put(`http://localhost:4000/product/${productId}`, {
        status: newStatus,
      });
      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, status: newStatus } : product
        )
      );
    } catch (err) {
      setError("Failed to update product status.");
    }
  };

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Row>
        <Col
          md="auto"
          style={{
            width: "250px",
            background: "#2c3e50",
            color: "white",
            padding: 0,
          }}
        >
          <Sidebar />
        </Col>
        <Col style={{ marginLeft: "10px" }} className="p-4">
          <div id="manage-products" className="mb-5">
            <h3 className="mb-4">Manage Products</h3>
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <Table
                striped
                bordered
                hover
                className="shadow-sm"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <thead className="bg-primary text-white">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.name || "N/A"}</td>
                      <td>{product.brand || "N/A"}</td>
                      <td>
                        {product.price
                          ? `${parseFloat(product.price).toLocaleString("vi-VN")} VND`
                          : "N/A"}
                      </td>
                      <td>{product.capacity ? `${product.capacity} kg` : "N/A"}</td>
                      <td>{product.status || "N/A"}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewDetails(product.id)}
                        >
                          Details
                        </Button>
                        <Button
                          variant={product.status === "New" ? "danger" : "success"}
                          size="sm"
                          onClick={() => handleToggleStatus(product.id, product.status)}
                        >
                          {product.status === "New" ? "Discontinue" : "Set New"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagePost;