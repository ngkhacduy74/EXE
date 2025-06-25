import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./styles/style.css";
import "./styles/vendor.css";
import Footer from "../Components/Footer";
import Canvas from "../Components/Canvas";
import ChatWidget from "../Components/WidgetChat";
import Header from "../Components/Header";
import {
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  X,
  Package,
  Star,
} from "lucide-react";
import { authApiClient } from "../Services/auth.service";

const ProductBrowse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(false);

  // UI states
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    brand: true,
    price: true,
    rating: true,
  });

  // Available filter options
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Handle URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get("search");

    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

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
        setError("Failed to fetch products. Please try again later.");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters whenever any filter state changes
  useEffect(() => {
    let result = products;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
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

    // Filter by rating
    if (rating > 0) {
      result = result.filter((product) => (product.rating || 0) >= rating);
    }

    // Filter by stock status (using quantity)
    if (inStock) {
      result = result.filter((product) => product.quantity > 0);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)
        );
        break;
      case "price-high":
        result.sort(
          (a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0)
        );
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "name":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchTerm,
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    rating,
    inStock,
    sortBy,
    products,
  ]);

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setRating(0);
    setInStock(false);
  };

  const toggleFilterExpand = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={isMobile ? "" : ""}>
      {!isMobile && (
        <div className="mb-4">
          <label className="form-label fw-semibold">Search Products</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, brand, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Clear Filters */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Filters</h6>
        <button
          className="btn btn-link btn-sm text-decoration-none p-0"
          onClick={clearFilters}
        >
          Clear All
        </button>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="filter-group mb-4">
          <div
            className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
            onClick={() => toggleFilterExpand("category")}
          >
            <h6 className="mb-0">Categories</h6>
            {expandedFilters.category ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
          {expandedFilters.category && (
            <div className="filter-content mt-2">
              {categories.map((category) => (
                <div key={category} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`category-${category}`}
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div className="filter-group mb-4">
          <div
            className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
            onClick={() => toggleFilterExpand("brand")}
          >
            <h6 className="mb-0">Brands</h6>
            {expandedFilters.brand ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
          {expandedFilters.brand && (
            <div
              className="filter-content mt-2"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {brands.map((brand) => (
                <div key={brand} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`brand-${brand}`}
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      <div className="filter-group mb-4">
        <div
          className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
          onClick={() => toggleFilterExpand("price")}
        >
          <h6 className="mb-0">Price Range (VND)</h6>
          {expandedFilters.price ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedFilters.price && (
          <div className="filter-content mt-2">
            <div className="row g-2 mb-3">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            {minPrice && maxPrice && (
              <div className="small text-muted">
                Range: {parseFloat(minPrice).toLocaleString("vi-VN")} -{" "}
                {parseFloat(maxPrice).toLocaleString("vi-VN")} VND
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stock Filter */}
      <div className="filter-group mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="inStock">
            In Stock Only
          </label>
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => {
    // Xử lý hình ảnh với fallback tốt hơn
    const getProductImage = (product) => {
      if (product.image) {
        if (Array.isArray(product.image) && product.image.length > 0) {
          return product.image[0];
        } else if (typeof product.image === "string") {
          return product.image;
        }
      }
      // Fallback image
      return "./styles/images/product-thumb-1.png";
    };

    const handleImageError = (e) => {
      e.target.src = "./styles/images/product-thumb-1.png";
      e.target.alt = "product placeholder";
    };

    const handleProductClick = () => {
      // Scroll to top before navigating
      window.scrollTo(0, 0);
      navigate(`/productView/${product.id}`);
    };

    return (
      <div
        className={`product-card ${
          viewMode === "list" ? "product-card-list" : ""
        } mb-4`}
      >
        <div className={`card h-100 ${viewMode === "list" ? "flex-row" : ""}`}>
          <div
            className={`position-relative image-container ${
              viewMode === "list" ? "flex-shrink-0" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={handleProductClick}
          >
            <img
              src={getProductImage(product)}
              className={`card-img-top ${
                viewMode === "list" ? "card-img-list" : ""
              }`}
              alt={product.name || "Product"}
              onError={handleImageError}
              loading="lazy"
            />

            {/* Discount Badge */}
            {product.discount && product.discount > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                -{product.discount}%
              </span>
            )}

            {/* Stock Badge */}
            {product.quantity <= 0 && (
              <span className="badge bg-secondary position-absolute top-0 end-0 m-2">
                Out of Stock
              </span>
            )}

            {/* New Badge */}
            {product.isNew && (
              <span className="badge bg-success position-absolute bottom-0 start-0 m-2">
                New
              </span>
            )}
          </div>

          <div className="card-body d-flex flex-column">
            {/* Brand và Category */}
            <div className="mb-2">
              <small className="text-muted">
                {product.brand || "No Brand"}
              </small>
              {product.category && (
                <small className="text-muted ms-2">• {product.category}</small>
              )}
            </div>

            {/* Product Name */}
            <h6 className="card-title" title={product.name}>
              {product.name || "Unnamed Product"}
            </h6>

            {/* Rating */}
            {product.rating && (
              <div className="mb-2">
                <span className="text-warning me-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={
                        i < Math.floor(product.rating) ? "currentColor" : "none"
                      }
                      className={
                        i < Math.floor(product.rating)
                          ? "text-warning"
                          : "text-muted"
                      }
                    />
                  ))}
                </span>
                <small className="text-muted">
                  (
                  {typeof product.rating === "number"
                    ? product.rating.toFixed(1)
                    : product.rating}
                  )
                </small>
              </div>
            )}

            {/* Price Section */}
            <div className="price-section mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="h6 text-primary mb-0">
                  {product.price
                    ? `${parseFloat(product.price).toLocaleString("vi-VN")} VND`
                    : "Price not available"}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="small text-muted text-decoration-line-through">
                      {parseFloat(product.originalPrice).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VND
                    </span>
                  )}
              </div>

              {/* Discount percentage */}
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <small className="text-success">
                    Save{" "}
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </small>
                )}
            </div>

            {/* Additional Info */}
            {product.capacity && (
              <div className="mb-2">
                <small className="text-muted">
                  <Package size={12} className="me-1" />
                  Capacity: {product.capacity} kg
                </small>
              </div>
            )}

            {/* Stock Info */}
            <div className="mb-3">
              <small
                className={`${
                  product.quantity > 0 ? "text-success" : "text-danger"
                }`}
              >
                {product.quantity > 0
                  ? `${product.quantity} in stock`
                  : "Out of stock"}
              </small>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <button
                className={`btn btn-sm w-100 ${
                  product.quantity > 0 ? "btn-outline-primary" : "btn-secondary"
                }`}
                disabled={product.quantity <= 0}
                onClick={handleProductClick}
              >
                {product.quantity > 0 ? "Xem chi tiết" : "Hết hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <HelmetProvider>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading products...</p>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  if (error) {
    return (
      <HelmetProvider>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div
        style={{
          overflowX: "hidden",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <Helmet>
          <title>Browse Products - Vinsaky Shop</title>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
            crossOrigin="anonymous"
          />
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
            crossOrigin="anonymous"
          ></script>
          <style>
            {`
              /* CSS cho đồng nhất kích thước hình ảnh */
              .product-card .card-img-top {
                width: 100%;
                height: 250px;
                object-fit: cover;
                object-position: center;
                transition: transform 0.3s ease;
              }

              .product-card:hover .card-img-top {
                transform: scale(1.05);
              }

              .product-card-list .card-img-list {
                width: 200px;
                height: 150px;
                object-fit: cover;
                object-position: center;
              }

              .product-card .image-container {
                overflow: hidden;
                border-radius: 0.375rem 0.375rem 0 0;
              }

              .product-card-list .image-container {
                overflow: hidden;
                border-radius: 0.375rem 0 0 0.375rem;
              }

              .product-card .card {
                height: 100%;
                transition: box-shadow 0.3s ease;
                border: 1px solid #e9ecef;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }

              .product-card:hover .card {
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                border-color: #007bff;
              }

              .product-card {
                transition: transform 0.2s ease-in-out;
              }

              .product-card:hover {
                transform: translateY(-2px);
              }

              .product-card .card-title {
                font-size: 1rem;
                font-weight: 600;
                line-height: 1.3;
                margin-bottom: 0.5rem;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }

              .product-card .badge {
                z-index: 10;
                font-size: 0.75rem;
              }

              .product-card .card-body {
                padding: 1rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }

              .cursor-pointer {
                cursor: pointer;
              }

              /* Responsive fixes */
              @media (max-width: 768px) {
                .product-card .card-img-top {
                  height: 200px;
                }
                
                .product-card .card-title {
                  font-size: 0.9rem;
                }
                
                .product-card .card-body {
                  padding: 0.75rem;
                }
                
                .top-filters-bar {
                  flex-direction: column !important;
                  align-items: stretch !important;
                  gap: 1rem !important;
                }
                
                .top-filters-bar .d-flex {
                  justify-content: space-between !important;
                  flex-wrap: wrap !important;
                }
                
                .sort-select {
                  min-width: 140px !important;
                }
                
                .view-mode-buttons {
                  flex-shrink: 0 !important;
                }
                
                .active-filters {
                  flex-wrap: wrap !important;
                  gap: 0.5rem !important;
                }
                
                .active-filters .badge {
                  font-size: 0.75rem !important;
                  padding: 0.25rem 0.5rem !important;
                }
                
                .pagination {
                  flex-wrap: wrap !important;
                  justify-content: center !important;
                }
                
                .pagination .page-link {
                  padding: 0.375rem 0.75rem !important;
                  font-size: 0.875rem !important;
                }
                
                .mobile-filter-overlay {
                  position: fixed !important;
                  top: 0 !important;
                  left: 0 !important;
                  right: 0 !important;
                  bottom: 0 !important;
                  z-index: 1050 !important;
                  background-color: white !important;
                  overflow-y: auto !important;
                }
                
                .mobile-filter-header {
                  position: sticky !important;
                  top: 0 !important;
                  background-color: white !important;
                  z-index: 1051 !important;
                  border-bottom: 1px solid #dee2e6 !important;
                }
                
                .filter-group {
                  border-bottom: 1px solid #f8f9fa !important;
                  padding-bottom: 1rem !important;
                }
                
                .filter-content {
                  max-height: 150px !important;
                  overflow-y: auto !important;
                }
              }
              
              @media (max-width: 576px) {
                .product-card .card-img-top {
                  height: 180px;
                }
                
                .product-card .card-title {
                  font-size: 0.85rem;
                }
                
                .product-card .card-body {
                  padding: 0.5rem;
                }
                
                .top-filters-bar .d-flex {
                  flex-direction: column !important;
                  gap: 0.5rem !important;
                }
                
                .sort-select {
                  width: 100% !important;
                }
                
                .view-mode-buttons {
                  align-self: center !important;
                }
                
                .active-filters .badge {
                  font-size: 0.7rem !important;
                  padding: 0.2rem 0.4rem !important;
                }
                
                .pagination .page-link {
                  padding: 0.25rem 0.5rem !important;
                  font-size: 0.8rem !important;
                }
                
                .container-fluid {
                  padding-left: 0.5rem !important;
                  padding-right: 0.5rem !important;
                }
              }
              
              @media (max-width: 480px) {
                .product-card .card-img-top {
                  height: 160px;
                }
                
                .product-card .card-title {
                  font-size: 0.8rem;
                }
                
                .product-card .price-section .h6 {
                  font-size: 0.9rem !important;
                }
                
                .product-card .btn-sm {
                  font-size: 0.75rem !important;
                  padding: 0.25rem 0.5rem !important;
                }
                
                .top-filters-bar {
                  margin-bottom: 1rem !important;
                }
                
                .active-filters {
                  margin-bottom: 0.75rem !important;
                }
              }

              /* Loading skeleton */
              .product-card .card-img-top[alt="product placeholder"] {
                background-color: #f8f9fa;
                border: 2px dashed #dee2e6;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              }

              .product-card .card-img-top[alt="product placeholder"]::before {
                content: "📦";
                font-size: 3rem;
                color: #6c757d;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
              
              /* Mobile filter improvements */
              .mobile-filter-backdrop {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background-color: rgba(0, 0, 0, 0.5) !important;
                z-index: 1049 !important;
              }
              
              .filter-header {
                cursor: pointer;
                user-select: none;
              }
              
              .filter-header:hover {
                background-color: #f8f9fa;
                border-radius: 0.375rem;
                padding: 0.25rem;
                margin: -0.25rem;
              }
              
              /* Product grid improvements */
              .product-grid {
                margin: 0 -0.5rem;
              }
              
              .product-grid .col {
                padding: 0 0.5rem;
                margin-bottom: 1rem;
              }
              
              @media (max-width: 768px) {
                .product-grid .col {
                  margin-bottom: 0.75rem;
                }
              }
              
              @media (max-width: 576px) {
                .product-grid .col {
                  margin-bottom: 0.5rem;
                }
              }
            `}
          </style>
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

        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <div className="d-md-none">
            <div className="mobile-filter-backdrop" onClick={() => setShowMobileFilters(false)}></div>
            <div className="mobile-filter-overlay">
              <div className="mobile-filter-header">
                <div className="d-flex justify-content-between align-items-center p-3">
                  <h5 className="mb-0">Filters</h5>
                  <button
                    className="btn btn-link p-0"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                {/* Mobile Search */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Search Products</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, brand, category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <FilterSidebar isMobile={true} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container-fluid py-4">
          <div className="row">
            {/* Desktop Sidebar Filters */}
            <div className="col-md-3 d-none d-md-block">
              <div className="card">
                <div className="card-body">
                  <FilterSidebar />
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="col-md-9">
              {/* Top Filters Bar */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 top-filters-bar">
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-outline-secondary d-md-none"
                    onClick={() => setShowMobileFilters(true)}
                  >
                    <Filter size={16} className="me-1" />
                    Filters
                  </button>
                  <span className="text-muted">
                    Showing {indexOfFirstProduct + 1}-
                    {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                    {filteredProducts.length} products
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select form-select-sm sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: "auto" }}
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>

                  <div className="btn-group view-mode-buttons" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        viewMode === "grid"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        viewMode === "list"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 ||
                selectedBrands.length > 0 ||
                rating > 0 ||
                inStock ||
                minPrice ||
                maxPrice) && (
                <div className="mb-3 active-filters">
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <span className="small text-muted">Active filters:</span>
                    {selectedCategories.map((category) => (
                      <span key={category} className="badge bg-secondary">
                        {category}
                        <button
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: "0.6em" }}
                          onClick={() => handleCategoryChange(category)}
                        ></button>
                      </span>
                    ))}
                    {selectedBrands.map((brand) => (
                      <span key={brand} className="badge bg-secondary">
                        {brand}
                        <button
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: "0.6em" }}
                          onClick={() => handleBrandChange(brand)}
                        ></button>
                      </span>
                    ))}
                    {rating > 0 && (
                      <span className="badge bg-secondary">
                        {rating}+ Stars
                        <button
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: "0.6em" }}
                          onClick={() => setRating(0)}
                        ></button>
                      </span>
                    )}
                    {(minPrice || maxPrice) && (
                      <span className="badge bg-secondary">
                        Price: {minPrice || "0"} - {maxPrice || "∞"} VND
                        <button
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: "0.6em" }}
                          onClick={() => {
                            setMinPrice("");
                            setMaxPrice("");
                          }}
                        ></button>
                      </span>
                    )}
                    {inStock && (
                      <span className="badge bg-secondary">
                        In Stock
                        <button
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: "0.6em" }}
                          onClick={() => setInStock(false)}
                        ></button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {currentProducts.length === 0 ? (
                <div className="text-center py-5">
                  <Package size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No products found</h5>
                  <p className="text-muted">
                    Try adjusting your filters or search term
                  </p>
                  {(selectedCategories.length > 0 ||
                    selectedBrands.length > 0 ||
                    rating > 0 ||
                    inStock ||
                    minPrice ||
                    maxPrice ||
                    searchTerm) && (
                    <button className="btn btn-primary" onClick={clearFilters}>
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div
                    className={`row product-grid ${
                      viewMode === "list"
                        ? "row-cols-1"
                        : "row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4"
                    }`}
                  >
                    {currentProducts.map((product) => (
                      <div key={product.id} className="col">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav aria-label="Page navigation" className="mt-4">
                      <ul className="pagination justify-content-center">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>

                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          // Show first, last, current, and adjacent pages
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 &&
                              pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <li
                                key={pageNumber}
                                className={`page-item ${
                                  currentPage === pageNumber ? "active" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(pageNumber)}
                                >
                                  {pageNumber}
                                </button>
                              </li>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <li
                                key={pageNumber}
                                className="page-item disabled"
                              >
                                <span className="page-link">...</span>
                              </li>
                            );
                          }
                          return null;
                        })}

                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <ChatWidget />
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default ProductBrowse;
