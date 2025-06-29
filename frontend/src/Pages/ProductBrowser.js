import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "./styles/style.css";
import "./styles/vendor.css";
import Footer from "../Components/Footer";
import Canvas from "../Components/Canvas";
import ChatWidget from "../Components/WidgetChat";
import Header from "../Components/Header";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  Sliders,
} from "lucide-react";
import { authApiClient } from "../Services/auth.service";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import SearchWithAutocomplete from "../Components/SearchWithAutocomplete";
import axios from "axios";

const ProductBrowser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    status: searchParams.get("status") || "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Backup image path
  const backUpImg = "/images/frigde.png";

  // Get product image (handle array format) - Same as BrandCarousel
  const getProductImage = (product) => {
    if (product.image) {
      if (Array.isArray(product.image) && product.image.length > 0) {
        const firstImage = product.image[0];

        // Check if URL is valid
        if (firstImage && firstImage.trim() !== "") {
          // If it's a relative URL, make it absolute
          if (firstImage.startsWith("/") || firstImage.startsWith("./")) {
            const baseUrl = `${process.env.REACT_APP_BACKEND_URL}`;
            const fullUrl = firstImage.startsWith("/")
              ? `${baseUrl}${firstImage}`
              : `${baseUrl}/${firstImage.replace("./", "")}`;
            return fullUrl;
          }

          // If it's already a full URL (http/https), use it directly
          if (
            firstImage.startsWith("http://") ||
            firstImage.startsWith("https://")
          ) {
            return firstImage;
          }

          // If it's a Cloudinary URL or other image service, use it directly
          if (
            firstImage.includes("cloudinary.com") ||
            firstImage.includes("res.cloudinary.com") ||
            firstImage.includes("imgur.com") ||
            firstImage.includes("unsplash.com")
          ) {
            return firstImage;
          }

          return firstImage;
        }
      } else if (typeof product.image === "string") {
        if (product.image.trim() !== "") {
          // If it's a relative URL, make it absolute
          if (product.image.startsWith("/") || product.image.startsWith("./")) {
            const baseUrl = `${process.env.REACT_APP_BACKEND_URL}`;
            const fullUrl = product.image.startsWith("/")
              ? `${baseUrl}${product.image}`
              : `${baseUrl}/${product.image.replace("./", "")}`;
            return fullUrl;
          }

          // If it's already a full URL (http/https), use it directly
          if (
            product.image.startsWith("http://") ||
            product.image.startsWith("https://")
          ) {
            return product.image;
          }

          // If it's a Cloudinary URL or other image service, use it directly
          if (
            product.image.includes("cloudinary.com") ||
            product.image.includes("res.cloudinary.com") ||
            product.image.includes("imgur.com") ||
            product.image.includes("unsplash.com")
          ) {
            return product.image;
          }

          return product.image;
        }
      }
    }
    // Fallback image
    return backUpImg;
  };

  // Handle image load error
  const handleImageError = (e) => {
    // Prevent infinite loop
    if (e.target.src === backUpImg) {
      return;
    }

    e.target.src = backUpImg;
    e.target.alt = "product placeholder";
    e.target.onerror = null; // Prevent infinite loop
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await authApiClient.get("/product/");
        console.log("API Response:", response.data);

        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setProducts(productData);
        setFilteredProducts(productData);

        // Extract unique categories and brands
        const uniqueCategories = [
          ...new Set(productData.map((p) => p.category).filter(Boolean)),
        ];
        const uniqueBrands = [
          ...new Set(productData.map((p) => p.brand).filter(Boolean)),
        ];

        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.brand?.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.category
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }

    // Price range filter
    if (filters.minPrice !== "" || filters.maxPrice !== "") {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price) || 0;
        const min = filters.minPrice !== "" ? parseFloat(filters.minPrice) : 0;
        const max =
          filters.maxPrice !== "" ? parseFloat(filters.maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(
        (product) => product.status === filters.status
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "price") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    products,
    filters.search,
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.status,
  ]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      status: "",
    });
    setSearchParams({});
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Render star rating
  const renderStars = (rating) => {
    if (!rating) return <span className="text-muted small">Chưa đánh giá</span>;

    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            fill={i < Math.floor(rating) ? "currentColor" : "none"}
            className="text-warning"
          />
        ))}
        <span className="ms-1 small text-muted">({rating})</span>
      </div>
    );
  };

  // Get stock status
  const getStockStatus = (quantity) => {
    if (quantity === undefined || quantity === null)
      return { variant: "secondary", text: "Liên hệ" };
    if (quantity === 0) return { variant: "danger", text: "Hết hàng" };
    if (quantity < 10) return { variant: "warning", text: "Sắp hết hàng" };
    return { variant: "success", text: "Còn hàng" };
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/productView/${productId}`);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    // Implement add to cart functionality
    console.log("Add to cart:", product);
  };

  // Handle add to wishlist
  const handleAddToWishlist = (product) => {
    // Implement add to wishlist functionality
    console.log("Add to wishlist:", product);
  };

  const handleSearch = (searchQuery) => {
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set("search", searchQuery);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <HelmetProvider>
        <div>
          <Header />
          <div className="content-wrapper">
            <div className="container mt-5">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Đang tải sản phẩm...</p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  if (error) {
    return (
      <HelmetProvider>
        <div>
          <Header />
          <div className="content-wrapper">
            <div className="container mt-5">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>Duyệt Sản Phẩm - Vinsaky Shop</title>
          <meta
            name="description"
            content="Duyệt và tìm kiếm sản phẩm tại Vinsaky Shop"
          />
        </Helmet>

        {/* Cart Offcanvas */}
        <div
          className="offcanvas offcanvas-end"
          data-bs-scroll="true"
          tabIndex="-1"
          id="offcanvasCart"
          aria-labelledby="offcanvasCartLabel"
        >
          <div className="offcanvas-header justify-content-center">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <Canvas />
          </div>
        </div>

        <Header />

        <div className="content-wrapper">
          <div className="container-fluid" style={{ paddingTop: "1rem" }}>
            <div className="row">
              {/* Filters Sidebar */}
              <div className="col-lg-3">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <Sliders size={16} className="me-2" />
                      Bộ lọc
                    </h6>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearFilters}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="card-body">
                    {/* Search */}
                    <div className="mb-3">
                      <label className="form-label">Tìm kiếm</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <Search size={14} />
                        </span>
                        <SearchWithAutocomplete
                          onSearch={handleSearch}
                          placeholder="Tìm sản phẩm..."
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-3">
                      <label className="form-label">Danh mục</label>
                      <select
                        className="form-select"
                        value={filters.category}
                        onChange={(e) =>
                          handleFilterChange("category", e.target.value)
                        }
                      >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Brand Filter */}
                    <div className="mb-3">
                      <label className="form-label">Thương hiệu</label>
                      <select
                        className="form-select"
                        value={filters.brand}
                        onChange={(e) =>
                          handleFilterChange("brand", e.target.value)
                        }
                      >
                        <option value="">Tất cả thương hiệu</option>
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div className="mb-3">
                      <label className="form-label">Khoảng giá</label>
                      <div className="row">
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Từ"
                            value={filters.minPrice}
                            onChange={(e) =>
                              handleFilterChange("minPrice", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Đến"
                            value={filters.maxPrice}
                            onChange={(e) =>
                              handleFilterChange("maxPrice", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-3">
                      <label className="form-label">Tình trạng</label>
                      <select
                        className="form-select"
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                      >
                        <option value="">Tất cả</option>
                        <option value="New">Mới</option>
                        <option value="SecondHand">Đã qua sử dụng</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="col-lg-9">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4>Duyệt Sản Phẩm</h4>
                    <p className="text-muted mb-0">
                      Hiển thị {filteredProducts.length} sản phẩm
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className={`btn btn-outline-secondary ${
                          viewMode === "grid" ? "active" : ""
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid size={16} />
                      </button>
                      <button
                        type="button"
                        className={`btn btn-outline-secondary ${
                          viewMode === "list" ? "active" : ""
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Info */}
                <Row className="mb-3">
                  <Col>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0">
                          Kết quả tìm kiếm
                          {filters.search && (
                            <span className="text-muted">
                              {" "}
                              cho "{filters.search}"
                            </span>
                          )}
                        </h5>
                        <small className="text-muted">
                          {pagination.totalItems || filteredProducts.length} sản
                          phẩm
                        </small>
                      </div>
                      {pagination.totalPages > 1 && (
                        <div>
                          <small className="text-muted">
                            Trang {pagination.currentPage} /{" "}
                            {pagination.totalPages}
                          </small>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                {/* Error Message */}
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                {/* Products Grid/List */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-5">
                    <h5>Không tìm thấy sản phẩm</h5>
                    <p className="text-muted">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                  </div>
                ) : (
                  <div className={`row ${viewMode === "list" ? "g-3" : "g-4"}`}>
                    {currentProducts.map((product) => (
                      <div
                        key={product.id}
                        className={
                          viewMode === "list"
                            ? "col-12"
                            : "col-md-6 col-lg-4 col-xl-3"
                        }
                      >
                        <div
                          className={`card h-100 product-browser ${
                            viewMode === "list" ? "flex-row" : ""
                          }`}
                        >
                          <div
                            className={viewMode === "list" ? "col-md-3" : ""}
                          >
                            <img
                              src={getProductImage(product)}
                              className={`card-img-top ${
                                viewMode === "list" ? "h-100" : ""
                              }`}
                              alt={product.name}
                              style={{
                                width: "250px",
                                height: "250px",
                                objectFit: "contain",
                                backgroundColor: "#f9f9f9",
                                border: "1px solid #eee",
                                borderRadius: "6px",
                              }}
                              onError={handleImageError}
                              onClick={() => handleProductClick(product.id)}
                            />
                          </div>
                          <div
                            className={`card-body ${
                              viewMode === "list" ? "col-md-9" : ""
                            }`}
                          >
                            <h6
                              className="card-title"
                              onClick={() => handleProductClick(product.id)}
                              style={{ cursor: "pointer" }}
                            >
                              {product.name}
                            </h6>
                            <p className="card-text text-muted small">
                              {product.brand} • {product.category}
                            </p>
                            {renderStars(product.rating)}
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="fw-bold text-primary">
                                {formatPrice(product.price)}
                              </span>
                              <span
                                className={`badge ${
                                  getStockStatus(product.quantity).variant
                                }`}
                              >
                                {getStockStatus(product.quantity).text}
                              </span>
                            </div>
                            <div className="d-flex gap-2 mt-3">
                              <button
                                className="btn btn-primary btn-sm flex-fill"
                                onClick={() => handleProductClick(product.id)}
                              >
                                <Eye size={14} className="me-1" />
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft size={16} />
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              currentPage === pageNumber ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        );
                      })}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>

        <ChatWidget />
        <Footer />

        {/* Custom CSS for consistent image sizing and hover effects */}
        <style>
          {`
            .product-browser .card-img-top {
              width: 100%;
              height: 240px;
              object-fit: cover;
              object-position: center;
              transition: transform 0.3s ease;
            }
            .product-browser:hover .card-img-top {
              transform: scale(1.05);
            }
            .product-browser .card {
              height: 100%;
              min-height: 420px;
              transition: box-shadow 0.3s ease;
              border: 1px solid #e9ecef;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              display: flex;
              flex-direction: column;
            }
            .product-browser:hover .card {
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
              border-color: #007bff;
            }
            .product-browser {
              transition: transform 0.2s ease-in-out;
            }
            .product-browser:hover {
              transform: translateY(-2px);
            }
            .product-browser .card-body {
              display: flex;
              flex-direction: column;
              min-height: 180px;
              justify-content: flex-start;
            }
            .product-browser .card-title {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              min-height: 2.6em;
              line-height: 1.3;
              margin-bottom: 0.5rem;
            }
            .product-browser .card-text.text-muted.small {
              min-height: 1.5em;
              margin-bottom: 0.5rem;
              display: block;
            }
            .product-browser .d-flex.gap-2.mt-3 {
              margin-top: auto;
            }
            .product-browser .card-img-top[alt="product placeholder"] {
              background-color: #f8f9fa;
              border: 2px dashed #dee2e6;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            }
            .product-browser .card-img-top[alt="product placeholder"]::before {
              content: "📦";
              font-size: 3rem;
              color: #6c757d;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          `}
        </style>
      </div>
    </HelmetProvider>
  );
};

export default ProductBrowser;
