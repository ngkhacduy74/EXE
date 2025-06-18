// src/Pages/MultiProductViewer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Alert,
  Card,
  Form,
  InputGroup,
  Modal,
  Spinner,
  Table,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import HeaderAdmin from "../Components/HeaderAdmin";
import Sidebar from "../Components/Sidebar";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

const MultiProductViewer = () => {
  const navigate = useNavigate();
  const [productNames, setProductNames] = useState(["", "", "", "", ""]); // 5 product names
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for search
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errors, setErrors] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedForBanner, setSelectedForBanner] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Load all products for search suggestions
  useEffect(() => {
    fetchAllProducts();
    loadSavedData();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/product", {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      setAllProducts(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadSavedData = () => {
    // Load saved product names
    const savedNames = localStorage.getItem("savedProductNames");
    if (savedNames) {
      try {
        const parsedNames = JSON.parse(savedNames);
        if (Array.isArray(parsedNames) && parsedNames.length === 5) {
          setProductNames(parsedNames);
        }
      } catch (error) {
        console.error("Error parsing saved product names:", error);
      }
    }

    // Load saved banner selections
    const savedBannerSelections = localStorage.getItem("savedBannerSelections");
    if (savedBannerSelections) {
      try {
        const parsedSelections = JSON.parse(savedBannerSelections);
        setSelectedForBanner(new Set(parsedSelections));
      } catch (error) {
        console.error("Error parsing saved banner selections:", error);
      }
    }
  };

  // Save product names to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedProductNames", JSON.stringify(productNames));
  }, [productNames]);

  // Save banner selections to localStorage
  useEffect(() => {
    localStorage.setItem(
      "savedBannerSelections",
      JSON.stringify([...selectedForBanner])
    );
  }, [selectedForBanner]);

  const handleInputChange = (index, value) => {
    const newNames = [...productNames];
    newNames[index] = value;
    setProductNames(newNames);
  };

  const clearAllInputs = () => {
    setProductNames(["", "", "", "", ""]);
    setProducts([]);
    setShowProducts(false);
    setErrors([]);
    setSelectedForBanner(new Set());
  };

  const searchProductsByName = async () => {
    setLoading(true);
    setErrors([]);
    const fetchedProducts = [];
    const fetchErrors = [];

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors(["Authentication token not found. Please log in again."]);
      setLoading(false);
      return;
    }

    // Filter out empty product names
    const validNames = productNames.filter((name) => name.trim() !== "");

    if (validNames.length === 0) {
      setErrors(["Please enter at least one Product Name"]);
      setLoading(false);
      return;
    }

    for (let i = 0; i < productNames.length; i++) {
      const productName = productNames[i].trim();

      if (productName === "") {
        continue; // Skip empty inputs
      }

      try {
        // Search for products that match the name (case-insensitive)
        const matchedProducts = allProducts.filter(
          (product) =>
            product.name &&
            product.name.toLowerCase().includes(productName.toLowerCase())
        );

        if (matchedProducts.length > 0) {
          // Take the first match
          const product = matchedProducts[0];
          fetchedProducts.push({
            ...product,
            originalIndex: i + 1,
            searchName: productName,
            matchCount: matchedProducts.length,
          });
        } else {
          fetchErrors.push(
            `No products found matching "${productName}" (Input ${i + 1})`
          );
        }
      } catch (err) {
        fetchErrors.push(
          `Error searching for "${productName}" (Input ${i + 1}): ${
            err.message
          }`
        );
      }
    }

    setProducts(fetchedProducts);
    setErrors(fetchErrors);
    setShowProducts(true);
    setLoading(false);
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getQuantityStatus = (quantity) => {
    if (quantity === undefined || quantity === null)
      return { variant: "secondary", text: "Unknown" };
    if (quantity === 0) return { variant: "danger", text: "Out of Stock" };
    if (quantity < 10) return { variant: "warning", text: "Low Stock" };
    return { variant: "success", text: "In Stock" };
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "success";
      case "used":
        return "warning";
      case "refurbished":
        return "info";
      default:
        return "secondary";
    }
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleGoToProductDetail = (productId) => {
    navigate(`/products/${productId}`);
  };

  const toggleBannerSelection = (productId) => {
    const newSelection = new Set(selectedForBanner);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      if (newSelection.size >= 5) {
        showToastMessage(
          "Chỉ có thể chọn tối đa 5 sản phẩm cho banner!",
          "warning"
        );
        return;
      }
      newSelection.add(productId);
    }
    setSelectedForBanner(newSelection);
  };

  const saveToBanner = () => {
    if (selectedForBanner.size === 0) {
      showToastMessage(
        "Vui lòng chọn ít nhất một sản phẩm để lưu vào banner!",
        "warning"
      );
      return;
    }

    // Get selected products data
    const selectedProducts = products.filter((product) =>
      selectedForBanner.has(product.Id || product.id)
    );

    // Transform to banner format
    const bannerProducts = selectedProducts.map((product, index) => ({
      id: product.Id || product.id,
      name: product.name || "Unnamed Product",
      category: product.category || "Sản phẩm",
      description:
        product.description || `${product.name} - Sản phẩm chất lượng cao`,
      price: formatPrice(product.price),
      discount: "Giảm 15%", // Default discount
      image:
        (product.image && product.image[0]) ||
        "https://via.placeholder.com/400x300?text=No+Image",
      badge: index === 0 ? "Bán Chạy #1" : `Top ${index + 1}`,
      buttonText: "Mua Ngay",
    }));

    // Save to localStorage for BannerSection
    localStorage.setItem("bannerProducts", JSON.stringify(bannerProducts));

    showToastMessage(
      `Đã lưu ${selectedProducts.length} sản phẩm vào banner thành công!`,
      "success"
    );
  };

  const showToastMessage = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Get product suggestions based on input
  const getProductSuggestions = (input, index) => {
    if (!input || input.length < 2) return [];

    return allProducts
      .filter(
        (product) =>
          product.name &&
          product.name.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  };

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
        <Col className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-2 text-primary">Multi-Product Search</h2>
              <p className="text-muted mb-0">
                Search up to 5 products by name to view them simultaneously
              </p>
            </div>
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-1"></i>
              Back
            </Button>
          </div>

          {/* Input Section */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-search text-primary me-2"></i>
                  Product Names
                </h5>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={clearAllInputs}
                >
                  <i className="fas fa-trash me-1"></i>
                  Clear All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                {productNames.map((name, index) => (
                  <Col md={6} lg={4} key={index} className="mb-3">
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted">
                        PRODUCT NAME {index + 1}
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fas fa-tag"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder={`Enter Product Name ${index + 1}`}
                          value={name}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          list={`suggestions-${index}`}
                        />
                        <datalist id={`suggestions-${index}`}>
                          {getProductSuggestions(name, index).map(
                            (product, idx) => (
                              <option key={idx} value={product.name} />
                            )
                          )}
                        </datalist>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                ))}
              </Row>

              <div className="text-center mt-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={searchProductsByName}
                  disabled={loading || loadingProducts}
                  className="px-4 me-3"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Searching Products...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2"></i>
                      Search Products
                    </>
                  )}
                </Button>

                {selectedForBanner.size > 0 && (
                  <Button
                    variant="success"
                    size="lg"
                    onClick={saveToBanner}
                    className="px-4"
                  >
                    <i className="fas fa-save me-2"></i>
                    Save to Banner ({selectedForBanner.size})
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="warning" className="mb-4">
              <Alert.Heading className="h6">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Search Results
              </Alert.Heading>
              <ul className="mb-0">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          {/* Products Display */}
          {showProducts && products.length > 0 && (
            <Card className="shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-box text-primary me-2"></i>
                    Products Found ({products.length})
                  </h5>
                  <div className="d-flex gap-2">
                    <Badge bg="success" className="fs-6">
                      {products.length} of{" "}
                      {productNames.filter((name) => name.trim() !== "").length}{" "}
                      found
                    </Badge>
                    {selectedForBanner.size > 0 && (
                      <Badge bg="info" className="fs-6">
                        {selectedForBanner.size} selected for banner
                      </Badge>
                    )}
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">
                        <Form.Check type="checkbox" />
                      </th>
                      <th className="border-0">#</th>
                      <th className="border-0">Product</th>
                      <th className="border-0">Brand</th>
                      <th className="border-0">Price</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Stock</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => {
                      const quantityStatus = getQuantityStatus(
                        product.quantity
                      );
                      const productId = product.Id || product.id;
                      const isSelected = selectedForBanner.has(productId);

                      return (
                        <tr
                          key={index}
                          className={isSelected ? "table-success" : ""}
                        >
                          <td>
                            <Form.Check
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleBannerSelection(productId)}
                            />
                          </td>
                          <td className="fw-bold text-muted">
                            {product.originalIndex}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {product.image && product.image[0] && (
                                <img
                                  src={product.image[0]}
                                  alt={product.name}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                  }}
                                  className="rounded me-3"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/40x40?text=No+Image";
                                  }}
                                />
                              )}
                              <div>
                                <div className="fw-bold">
                                  {product.name || "Unnamed Product"}
                                </div>
                                <small className="text-muted">
                                  ID: {productId}
                                </small>
                                {product.matchCount > 1 && (
                                  <small className="text-info d-block">
                                    ({product.matchCount} matches found)
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {product.brand ? (
                              <Badge bg="outline-primary">
                                {product.brand}
                              </Badge>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          <td className="fw-bold text-success">
                            {formatPrice(product.price)}
                          </td>
                          <td>
                            <Badge bg={getStatusColor(product.status)}>
                              {product.status || "Unknown"}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={quantityStatus.variant}>
                              {product.quantity !== undefined
                                ? `${product.quantity} units`
                                : "Unknown"}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewDetail(product)}
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() =>
                                  handleGoToProductDetail(productId)
                                }
                              >
                                <i className="fas fa-external-link-alt"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {showProducts && products.length === 0 && errors.length === 0 && (
            <Alert variant="info" className="text-center">
              <i className="fas fa-info-circle me-2"></i>
              No products found. Please check your search terms and try again.
            </Alert>
          )}
        </Col>
      </Row>

      {/* Product Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-box text-primary me-2"></i>
            Product Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={4}>
                {selectedProduct.image && selectedProduct.image[0] && (
                  <img
                    src={selectedProduct.image[0]}
                    alt={selectedProduct.name}
                    className="img-fluid rounded"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                )}
              </Col>
              <Col md={8}>
                <h4 className="text-primary mb-3">
                  {selectedProduct.name || "Unnamed Product"}
                </h4>

                <div className="mb-3">
                  <strong>ID:</strong>{" "}
                  {selectedProduct.Id || selectedProduct.id}
                </div>

                <div className="mb-3">
                  <strong>Brand:</strong> {selectedProduct.brand || "N/A"}
                </div>

                <div className="mb-3">
                  <strong>Price:</strong>
                  <span className="text-success fw-bold ms-2">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>

                <div className="mb-3">
                  <strong>Status:</strong>
                  <Badge
                    bg={getStatusColor(selectedProduct.status)}
                    className="ms-2"
                  >
                    {selectedProduct.status || "Unknown"}
                  </Badge>
                </div>

                <div className="mb-3">
                  <strong>Quantity:</strong>
                  <Badge
                    bg={getQuantityStatus(selectedProduct.quantity).variant}
                    className="ms-2"
                  >
                    {selectedProduct.quantity !== undefined
                      ? `${selectedProduct.quantity} units`
                      : "Unknown"}
                  </Badge>
                </div>

                {selectedProduct.description && (
                  <div className="mb-3">
                    <strong>Description:</strong>
                    <p className="mt-2 text-muted">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          {selectedProduct && (
            <Button
              variant="primary"
              onClick={() => {
                setShowDetailModal(false);
                handleGoToProductDetail(
                  selectedProduct.Id || selectedProduct.id
                );
              }}
            >
              <i className="fas fa-external-link-alt me-1"></i>
              View Full Details
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body
            className={toastVariant === "success" ? "text-white" : ""}
          >
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default MultiProductViewer;
