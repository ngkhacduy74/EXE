import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  // Fetch product data and extract unique brands
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/product/");
        console.log("API Response:", response.data);

        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setProducts(productData);
        setFilteredProducts(productData);

        // Extract unique brands
        const uniqueBrands = [...new Set(productData.map((p) => p.brand).filter(Boolean))];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch products. Please try again later.");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters whenever searchTerm, statusFilter, selectedBrands, minPrice, or maxPrice change
  useEffect(() => {
    let result = products;

    // Filter by search term
    if (searchTerm) {
      result = result.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      result = result.filter((product) => product.status === statusFilter);
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter((product) => selectedBrands.includes(product.brand));
    }

    // Filter by price range
    if (minPrice !== "" || maxPrice !== "") {
      result = result.filter((product) => {
        const price = parseFloat(product.price) || 0;
        const min = minPrice !== "" ? parseFloat(minPrice) : -Infinity;
        const max = maxPrice !== "" ? parseFloat(maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    setFilteredProducts(result);
  }, [searchTerm, statusFilter, selectedBrands, minPrice, maxPrice, products]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status dropdown change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle brand checkbox change
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  // Handle price input changes
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
  };

  // Handle view details
  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Handle toggle status
  const handleToggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === "New" ? "Second Hand" : "New";
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

            {/* Filter Controls */}
            <Row className="mb-4">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Search by Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Filter by Status</Form.Label>
                  <Form.Select value={statusFilter} onChange={handleStatusChange}>
                    <option value="All">All</option>
                    <option value="New">New</option>
                    <option value="Second Hand">Second Hand</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Price Range (VND)</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter by Brand</Form.Label>
                  <div>
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <Form.Check
                          key={brand}
                          type="checkbox"
                          label={brand}
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                        />
                      ))
                    ) : (
                      <p>No brands available.</p>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={1} className="d-flex align-items-end">
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear
                </Button>
              </Col>
            </Row>

            {filteredProducts.length === 0 ? (
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
                  {filteredProducts.map((product, index) => (
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
                          {product.status === "New" ? "Hide" : "Set New"}
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