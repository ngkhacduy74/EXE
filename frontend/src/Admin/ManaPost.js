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
        const response = await axios.get("http://localhost:4000/post/");
        console.log("API Response:", response.data);

        // Extract the product array, assuming response.data.data is the array
        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
        setProducts(productData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (productId) => {
    navigate(`/post/${productId}`);
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === "New" ? "Discontinued" : "New";
      await axios.patch(`http://localhost:4000/post/${productId}`, {
        status: newStatus,
      });
      setProducts(
        products.map((product) =>
          product._id === productId ? { ...product, status: newStatus } : product
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
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
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Condition</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>{product.title || "N/A"}</td>
                      <td>{product.category || "N/A"}</td>
                      <td>{product.status || "N/A"}</td>
                      <td>{product.condition || "N/A"}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewDetails(product._id)}
                        >
                          Details
                        </Button>
                        <Button
                          variant={product.status === "New" ? "danger" : "success"}
                          size="sm"
                          onClick={() =>
                            handleToggleStatus(product._id, product.status)
                          }
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

export default ManageProduct;