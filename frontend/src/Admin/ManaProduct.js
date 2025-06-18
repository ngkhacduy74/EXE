import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Plus, Eye, EyeOff, Check, Package, Trash2 } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Sử dụng trực tiếp biến môi trường mà không cần dấu $ và {}
  timeout: 5000,
});

const ManageProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Token state management - similar to AdminDashboard
  const [tokens, setTokens] = useState(() => {
    // First try to get from location state
    const locationToken = location.state?.token;
    const locationRefreshToken = location.state?.refresh_token;

    if (locationToken && locationRefreshToken) {
      return {
        accessToken: locationToken,
        refreshToken: locationRefreshToken,
      };
    }

    // Fallback to localStorage
    try {
      const accessToken = localStorage.getItem("token");
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        localStorage.getItem("refresh_token");
      return {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
      };
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return { accessToken: null, refreshToken: null };
    }
  });

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

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  console.log("Access token found:", tokens.accessToken ? "Yes" : "No");
  console.log("Refresh token found:", tokens.refreshToken ? "Yes" : "No");

  // Effect to update tokens when location state changes
  useEffect(() => {
    const locationToken = location.state?.token;
    const locationRefreshToken = location.state?.refresh_token;

    if (locationToken && locationRefreshToken) {
      console.log(
        "✅ Token from location:",
        locationToken.substring(0, 15) + "..."
      );
      console.log(
        "🔄 Refresh Token from location:",
        locationRefreshToken.substring(0, 15) + "..."
      );

      setTokens({
        accessToken: locationToken,
        refreshToken: locationRefreshToken,
      });

      // Optionally save to localStorage for persistence
      try {
        localStorage.setItem("token", locationToken);
        localStorage.setItem("refreshToken", locationRefreshToken);
      } catch (error) {
        console.error("Error saving tokens to localStorage:", error);
      }
    } else if (!tokens.accessToken || !tokens.refreshToken) {
      console.warn("⚠️ No token data passed via location state");
    }
  }, [location.state]);

  // Token refresh function
  const refreshAccessToken = async () => {
    if (!tokens.refreshToken) {
      console.error("No refresh token available");
      throw new Error("No refresh token available");
    }

    try {
      console.log("Attempting to refresh token...");

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

      // Update localStorage
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refresh_token);
      } catch (error) {
        console.error("Error saving refreshed tokens:", error);
      }

      setTokens(newTokens);
      console.log("✅ Tokens refreshed successfully");
      return token;
    } catch (err) {
      console.error("Error refreshing token:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("refresh_token"); // Clean up old key too
      window.location.href = "/login";
      throw err;
    }
  };

  // API call with token refresh logic
  const makeAuthenticatedRequest = async (config, retryCount = 0) => {
    try {
      if (!tokens.accessToken) {
        throw new Error("No access token available");
      }

      const requestConfig = {
        ...config,
        headers: {
          ...config.headers,
          token: tokens.accessToken,
        },
      };

      const response = await api.request(requestConfig);
      return response;
    } catch (err) {
      if (
        err.response?.status === 401 &&
        retryCount === 0 &&
        tokens.refreshToken
      ) {
        console.warn("Access token expired. Attempting to refresh...");
        try {
          await refreshAccessToken();
          return makeAuthenticatedRequest(config, 1); // Retry once
        } catch (refreshErr) {
          throw new Error("Session expired. Please log in again.");
        }
      } else if (err.response?.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      } else if (!err.response) {
        throw new Error(
          "Server connection error. Please check your connection."
        );
      }
      throw err;
    }
  };

  // Fetch product data and extract unique brands
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we have tokens
        if (!tokens.accessToken) {
          console.log("No access token available");
          setError("No access token available. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await makeAuthenticatedRequest({
          method: "GET",
          url: "/product/",
        });

        console.log("API Response:", response.data);

        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setProducts(productData);
        setFilteredProducts(productData);

        // Extract unique brands
        const uniqueBrands = [
          ...new Set(productData.map((p) => p.brand).filter(Boolean)),
        ];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(
          err.message || "Failed to fetch products. Please try again later."
        );
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have access token
    if (tokens.accessToken) {
      fetchProducts();
    }
  }, [tokens.accessToken]); // Add tokens.accessToken as dependency

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
      result = result.filter((product) =>
        selectedBrands.includes(product.brand)
      );
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
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
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
    navigate(`/product/${productId}`);
    console.log(`Navigating to product details for ID: ${productId}`);
  };

  // Handle create product
  const handleCreateProduct = () => {
    navigate("/create-product");
  };

  // Handle toggle status with authentication
  const handleToggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === "New" ? "SecondHand" : "New";
    try {
      await makeAuthenticatedRequest({
        method: "PUT",
        url: `/product/${productId}`,
        data: {
          status: newStatus,
        },
      });

      // Update local state
      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, status: newStatus } : product
        )
      );

      console.log(`Product ${productId} status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating product status:", err);
      setError(err.message || "Failed to update product status.");
    }
  };

  // Handle delete product - show confirmation modal
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setDeleteLoading(true);
      await makeAuthenticatedRequest({
        method: "DELETE",
        url: `/product/${productToDelete.id}`,
      });

      // Remove product from local state
      setProducts(
        products.filter((product) => product.id !== productToDelete.id)
      );

      console.log(`Product ${productToDelete.id} deleted successfully`);

      // Close modal and reset state
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Failed to delete product.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  if (error && error.includes("Session expired")) {
    return <ErrorPage message={error} />;
  }

  if (loading) {
    return (
      <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
        <HeaderAdmin />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading products...</p>
          </div>
        </div>
      </Container>
    );
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
          {/* Token Status Display - Similar to AdminDashboard */}
          {/* <div className="mb-3">
            <div className={`alert alert-${tokens.accessToken && tokens.refreshToken ? 'success' : 'warning'} py-2`}>
              <Row>
                <Col md={6}>
                  <small className={`text-${tokens.accessToken ? 'success' : 'danger'}`}>
                    {tokens.accessToken ? '✅' : '❌'} Access Token: {tokens.accessToken ? `${tokens.accessToken.substring(0, 15)}...` : 'Not found'}
                  </small>
                </Col>
                <Col md={6}>
                  <small className={`text-${tokens.refreshToken ? 'success' : 'danger'}`}>
                    {tokens.refreshToken ? '✅' : '❌'} Refresh Token: {tokens.refreshToken ? `${tokens.refreshToken.substring(0, 15)}...` : 'Not found'}
                  </small>
                </Col>
              </Row>
              {tokens.accessToken && tokens.refreshToken && (
                <div className="mt-2">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={refreshAccessToken}
                  >
                    Refresh Access Token
                  </button>
                </div>
              )}
              {location.state?.token && (
                <div className="mt-2">
                  <small className="text-info">
                    📍 Tokens loaded from navigation state
                  </small>
                </div>
              )}
            </div>
          </div> */}

          <div id="manage-products" className="mb-5">
            {/* Error Alert */}
            {error && !error.includes("Session expired") && (
              <div className="alert alert-warning mb-3" role="alert">
                <strong>Warning:</strong> {error}
                <button
                  className="btn btn-link btn-sm ms-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Header with title and Create button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Manage Products</h3>
              <Button
                variant="success"
                size="lg"
                onClick={handleCreateProduct}
                className="d-flex align-items-center"
              >
                <Plus size={20} className="me-2" />
                Create Product
              </Button>
            </div>

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
                  <Form.Select
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    <option value="All">All</option>
                    <option value="New">New</option>
                    <option value="SecondHand">Second Hand</option>
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
                  <div style={{ maxHeight: "120px", overflowY: "auto" }}>
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
                      <p className="text-muted small">No brands available.</p>
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

            {/* Products Summary */}
            <div className="mb-3">
              <small className="text-muted">
                Showing {filteredProducts.length} of {products.length} products
              </small>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-5">
                <Package size={48} className="text-muted mb-3" />
                <p className="text-muted">No products found.</p>
                {products.length === 0 && !error && (
                  <Button
                    variant="primary"
                    onClick={handleCreateProduct}
                    className="mt-2"
                  >
                    Create your first product
                  </Button>
                )}
              </div>
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
                    <th>Tên</th>
                    <th>Thương hiệu</th>
                    <th>Giá tiền</th>
                    <th>Dung tích/ Ngày</th>
                    <th>Trạng thái</th>
                    <th>Chỉnh sủa</th>
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
                          ? `${parseFloat(product.price).toLocaleString(
                              "vi-VN"
                            )} VND`
                          : "N/A"}
                      </td>
                      <td>
                        {product.capacity ? `${product.capacity} kg` : "N/A"}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            product.status === "New"
                              ? "bg-success"
                              : "bg-warning"
                          }`}
                        >
                          {product.status || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleViewDetails(product.id)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant={
                              product.status === "New" ? "danger" : "success"
                            }
                            size="sm"
                            onClick={() =>
                              handleToggleStatus(product.id, product.status)
                            }
                            title={
                              product.status === "New"
                                ? "Mark as Second Hand"
                                : "Mark as New"
                            }
                          >
                            {product.status === "New" ? (
                              <EyeOff size={16} />
                            ) : (
                              <Check size={16} />
                            )}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteProduct(product)}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <Trash2 size={24} className="me-2" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <Trash2 size={48} className="text-danger" />
            </div>
            <h5>Are you sure you want to delete this product?</h5>
            {productToDelete && (
              <div className="mt-3 p-3 bg-light rounded">
                <strong>{productToDelete.name}</strong>
                <br />
                <small className="text-muted">
                  Brand: {productToDelete.brand} | Price:{" "}
                  {productToDelete.price
                    ? `${parseFloat(productToDelete.price).toLocaleString(
                        "vi-VN"
                      )} VND`
                    : "N/A"}
                </small>
              </div>
            )}
            <div className="alert alert-warning mt-3">
              <strong>Warning:</strong> This action cannot be undone. The
              product will be permanently deleted from the system.
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={cancelDelete}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDeleteProduct}
            disabled={deleteLoading}
            className="d-flex align-items-center"
          >
            {deleteLoading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} className="me-2" />
                Delete Product
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageProduct;
