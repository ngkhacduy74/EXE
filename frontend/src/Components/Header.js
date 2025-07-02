import React, { useEffect, useState, useRef } from "react";
import {
  useNavigate,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { Search, Star, X, Plus, Menu, ChevronDown, Heart } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { authApiClient } from "../Services/auth.service";
import SearchWithAutocomplete from "./SearchWithAutocomplete";

function Header() {
  const { user, loading, handleLogout } = useAuth();
  const [brands, setBrands] = useState([]);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [headerSearch, setHeaderSearch] = useState(
    searchParams.get("search") || ""
  );

  // Danh sách các danh mục sản phẩm
  const categories = [
    "Máy Làm Đá",
    "Bếp á công nghiệp",
    "Bàn inox",
    "Bếp âu công nghiệp",
    "Tủ đông công nghiệp",
    "Tủ lạnh công nghiệp",
    "Tủ mát công nghiệp",
    "Tủ nấu cơm",
    "Máy Pha Cafe",
    "Bàn Đông",
    "Bếp Từ Công Nghiệp",
    "Máy Làm Kem",
  ];

  const headerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  // Sync headerSearch with URL
  useEffect(() => {
    setHeaderSearch(searchParams.get("search") || "");
  }, [location.search]);

  // Handle search from header
  const handleSearch = (searchQuery) => {
    setHeaderSearch(searchQuery);
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  // Fetch brands - optimized with caching
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Check if brands are cached
        const cachedBrands = localStorage.getItem("cachedBrands");
        const cacheTime = localStorage.getItem("cachedBrandsTime");
        const now = Date.now();

        // Use cache if it's less than 5 minutes old
        if (
          cachedBrands &&
          cacheTime &&
          now - parseInt(cacheTime) < 5 * 60 * 1000
        ) {
          setBrands(JSON.parse(cachedBrands));
          return;
        }

        const response = await authApiClient.get("/product/");
        const products = response.data.data || [];

        // Extract unique brands
        const uniqueBrands = [
          ...new Set(products.map((product) => product.brand).filter(Boolean)),
        ];
        const limitedBrands = uniqueBrands.slice(0, 10);

        // Cache the brands
        localStorage.setItem("cachedBrands", JSON.stringify(limitedBrands));
        localStorage.setItem("cachedBrandsTime", now.toString());

        setBrands(limitedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      }
    };

    fetchBrands();
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
  };

  const handleBrandClick = (brand) => {
    navigate(`/products?brand=${encodeURIComponent(brand)}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?product=${encodeURIComponent(category)}`);
  };

  // Mobile search handlers
  const handleMobileSearch = {
    handleShow: () => setIsMobileSearchOpen(true),
    handleHide: () => {
      setIsMobileSearchOpen(false);
    },
  };

  // Thêm hàm normalizeText giống SearchWithAutocomplete
  function normalizeText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9\s]/gi, "")
      .trim();
  }

  // Hàm lọc danh mục giống search
  const filteredCategories = searchCategory
    ? categories.filter((cat) => {
        const filterWords = normalizeText(searchCategory)
          .split(/\s+/)
          .filter(Boolean);
        const normalizedCat = normalizeText(cat);
        return filterWords.every((word) => normalizedCat.includes(word));
      })
    : categories;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header
      className="sticky-top bg-white shadow-sm"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        width: "100%",
      }}
      ref={headerRef}
    >
      <style>
        {`
          .mobile-search-suggestions {
            max-height: 50vh !important;
            overflow-y: auto;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            margin-top: 10px;
            background: white;
            border: 1px solid #e0e0e0;
            z-index: 1060;
            position: relative;
          }
          
          .mobile-search-suggestions .suggestion-item {
            transition: background-color 0.15s ease;
            border-bottom: 1px solid #f0f0f0;
            padding: 12px 16px;
          }
          
          .mobile-search-suggestions .suggestion-item:last-child {
            border-bottom: none;
          }
          
          .mobile-search-suggestions .suggestion-item:hover {
            background-color: #f8f9fa;
          }
          
          .offcanvas-body .search-bar {
            position: relative;
          }
          
          .offcanvas-body .search-bar .suggestions-container {
            position: relative;
            top: auto;
            left: auto;
            right: auto;
            z-index: 1060;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            max-height: 50vh;
            overflow-y: auto;
            margin-top: 10px;
            border: 1px solid #e0e0e0;
          }
          
          /* Ensure offcanvas has enough height */
          .offcanvas-top {
            height: auto !important;
            max-height: 90vh !important;
          }
          
          .offcanvas-body {
            padding: 20px;
            overflow-y: auto;
            max-height: calc(90vh - 60px);
          }
          
          /* Make suggestions more visible */
          .mobile-search-suggestions .fw-semibold {
            font-size: 14px;
            line-height: 1.4;
          }
          
          .mobile-search-suggestions .small {
            font-size: 12px;
          }
          
          .mobile-search-suggestions .badge {
            font-size: 10px;
            padding: 4px 8px;
          }
          
          /* Improve mobile search form */
          .offcanvas-body .search-bar form {
            margin-bottom: 0;
          }
          
          .offcanvas-body .search-bar .row {
            margin-bottom: 15px;
          }
          
          /* Better spacing for mobile */
          @media (max-width: 768px) {
            .offcanvas-body {
              padding: 15px;
            }
            
            .mobile-search-suggestions {
              max-height: 45vh !important;
            }
            
            .suggestion-item {
              padding: 10px 12px !important;
            }
          }
          
          /* Mobile header improvements */
          @media (max-width: 768px) {
            .header-top-row {
              padding: 8px 0 !important;
            }
            
            .header-logo {
              font-size: 14px !important;
            }
            
            .header-logo img {
              width: 40px !important;
              height: auto !important;
            }
            
            .header-user-actions {
              gap: 8px !important;
            }
            
            .header-user-button {
              width: 40px !important;
              height: 40px !important;
              padding: 8px !important;
            }
            
            .header-user-button svg {
              width: 18px !important;
              height: 18px !important;
            }
            
            .header-dropdown-menu {
              min-width: 180px !important;
              border-radius: 8px !important;
              box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
              border: 1px solid #e5e7eb !important;
              z-index: 1070 !important;
            }
            
            .header-dropdown-item {
              padding: 10px 16px !important;
              font-size: 14px !important;
            }
            
            .header-dropdown-header {
              padding: 12px 16px 8px !important;
              font-size: 14px !important;
            }
            
            .header-dropdown-divider {
              margin: 4px 0 !important;
            }
          }
          
          @media (max-width: 480px) {
            .header-top-row {
              padding: 6px 0 !important;
            }
            
            .header-logo {
              font-size: 12px !important;
            }
            
            .header-logo img {
              width: 36px !important;
            }
            
            .header-user-button {
              width: 36px !important;
              height: 36px !important;
              padding: 6px !important;
            }
            
            .header-user-button svg {
              width: 16px !important;
              height: 16px !important;
            }
            
            .header-dropdown-menu {
              min-width: 160px !important;
            }
            
            .header-dropdown-item {
              padding: 8px 12px !important;
              font-size: 13px !important;
            }
          }
          
          /* Mobile navigation improvements */
          @media (max-width: 768px) {
            .mobile-nav-offcanvas {
              width: 280px !important;
            }
            
            .mobile-nav-item {
              padding: 12px 16px !important;
              border-bottom: 1px solid #f0f0f0 !important;
            }
            
            .mobile-nav-item:last-child {
              border-bottom: none !important;
            }
            
            .mobile-nav-header {
              padding: 16px !important;
              font-size: 16px !important;
              font-weight: 600 !important;
            }
            
            .mobile-nav-category {
              padding: 10px 16px 10px 24px !important;
              font-size: 14px !important;
              transition: all 0.2s ease !important;
            }
            
            .mobile-nav-category:hover {
              background-color: #f8f9fa !important;
              padding-left: 28px !important;
            }
            
            .mobile-nav-brand {
              padding: 8px 16px 8px 24px !important;
              font-size: 14px !important;
              transition: all 0.2s ease !important;
            }
            
            .mobile-nav-brand:hover {
              background-color: #f8f9fa !important;
              padding-left: 28px !important;
            }
            
            /* Category and brand icons */
            .mobile-nav-category::before,
            .mobile-nav-brand::before {
              content: "•";
              color: #0d6efd;
              font-weight: bold;
              margin-right: 8px;
              font-size: 16px;
            }
            
            /* Section headers styling */
            .mobile-nav-header {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border-radius: 8px;
              margin: 16px 8px 8px 8px;
              padding: 12px 16px !important;
              font-size: 14px !important;
              font-weight: 600 !important;
              color: #0d6efd !important;
              border-left: 4px solid #0d6efd;
            }
            
            /* Improved spacing */
            .offcanvas-body {
              padding: 0 !important;
            }
            
            .navbar-nav {
              margin: 0 !important;
            }
            
            /* Touch-friendly improvements */
            .mobile-nav-category,
            .mobile-nav-brand {
              min-height: 44px !important;
              display: flex !important;
              align-items: center !important;
            }
            
            .mobile-nav-category:active,
            .mobile-nav-brand:active {
              background-color: #e9ecef !important;
              transform: scale(0.98) !important;
            }
          }
          
          @media (max-width: 480px) {
            .mobile-nav-offcanvas {
              width: 260px !important;
            }
            
            .mobile-nav-header {
              font-size: 13px !important;
              padding: 10px 12px !important;
              margin: 12px 6px 6px 6px !important;
            }
            
            .mobile-nav-category,
            .mobile-nav-brand {
              font-size: 13px !important;
              padding: 8px 12px 8px 20px !important;
              min-height: 40px !important;
            }
            
            .mobile-nav-category:hover,
            .mobile-nav-brand:hover {
              padding-left: 24px !important;
            }
          }
          
          /* Hover effects for mobile */
          @media (hover: hover) {
            .header-user-button:hover {
              background-color: #f8f9fa !important;
              transform: scale(1.05) !important;
            }
            
            .header-dropdown-item:hover {
              background-color: #f8f9fa !important;
            }
          }
          
          /* Touch-friendly improvements */
          @media (max-width: 768px) {
            .header-user-button {
              transition: all 0.2s ease !important;
            }
            
            .header-user-button:active {
              transform: scale(0.95) !important;
            }
            
            .header-dropdown-item {
              transition: background-color 0.15s ease !important;
            }
            
            .header-dropdown-item:active {
              background-color: #e9ecef !important;
            }
          }
          
          /* Ensure dropdown menus appear above search suggestions */
          .header-dropdown-menu {
            z-index: 1070 !important;
          }
          
          /* Ensure dropdown items display properly */
          .header-dropdown-item {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            padding: 10px 16px !important;
            font-size: 14px !important;
            color: #333 !important;
            text-decoration: none !important;
            border: none !important;
            background: transparent !important;
            width: 100% !important;
            text-align: left !important;
            transition: all 0.2s ease !important;
            cursor: pointer !important;
          }
          
          .header-dropdown-item:hover {
            background-color: #f8f9fa !important;
            color: #333 !important;
          }
          
          .header-dropdown-item i {
            font-size: 16px !important;
            width: 16px !important;
            text-align: center !important;
          }
          
          /* Mobile navigation scroll improvements */
          .offcanvas-body {
            overflow-y: auto !important;
            scrollbar-width: thin !important;
            scrollbar-color: #0d6efd #f8f9fa !important;
          }
          
          .offcanvas-body::-webkit-scrollbar {
            width: 6px !important;
          }
          
          .offcanvas-body::-webkit-scrollbar-track {
            background: #f8f9fa !important;
            border-radius: 3px !important;
          }
          
          .offcanvas-body::-webkit-scrollbar-thumb {
            background: #0d6efd !important;
            border-radius: 3px !important;
          }
          
          .offcanvas-body::-webkit-scrollbar-thumb:hover {
            background: #0b5ed7 !important;
          }
          
          /* Mobile navigation animations */
          .mobile-nav-category,
          .mobile-nav-brand {
            position: relative !important;
            overflow: hidden !important;
          }
          
          .mobile-nav-category::after,
          .mobile-nav-brand::after {
            content: "" !important;
            position: absolute !important;
            top: 0 !important;
            left: -100% !important;
            width: 100% !important;
            height: 100% !important;
            background: linear-gradient(90deg, transparent, rgba(13, 110, 253, 0.1), transparent) !important;
            transition: left 0.5s ease !important;
          }
          
          .mobile-nav-category:hover::after,
          .mobile-nav-brand:hover::after {
            left: 100% !important;
          }
          
          /* Mobile navigation divider improvements */
          .mobile-nav-item {
            border-bottom: 1px solid #e9ecef !important;
          }
          
          .mobile-nav-category,
          .mobile-nav-brand {
            border-bottom: 1px solid #f8f9fa !important;
          }
          
          /* Mobile navigation focus states */
          .mobile-nav-category:focus,
          .mobile-nav-brand:focus {
            outline: 2px solid #0d6efd !important;
            outline-offset: -2px !important;
            background-color: #f8f9fa !important;
          }
        `}
      </style>
      {/* Top Header */}
      <div className="container-fluid border-bottom">
        <div className="row py-3 align-items-center header-top-row">
          {/* Logo */}
          <div className="col-6 col-sm-4 col-lg-3">
            <div className="main-logo header-logo">
              <a href="/" className="d-flex align-items-center">
                <img
                  src="../images/Logo.png"
                  alt="logo"
                  className="img-fluid"
                  style={{ width: "50px", height: "auto" }}
                />
                <span className="ms-2 fw-bold text-primary d-none d-sm-inline">
                  Vinsaky
                </span>
              </a>
            </div>
          </div>

          {/* Enhanced Search Bar - Desktop */}
          <div className="col-lg-6 d-none d-lg-block position-relative">
            <SearchWithAutocomplete
              value={headerSearch}
              onChangeValue={setHeaderSearch}
              onSearch={handleSearch}
              placeholder="Tìm kiếm sản phẩm..."
            />
          </div>

          {/* User Actions - Right Side */}
          <div className="col-6 col-sm-8 col-lg-3">
            <div className="d-flex align-items-center gap-2 header-user-actions">
              {/* Mobile Search Toggle */}
              <button
                className="btn btn-light rounded-circle p-2 d-lg-none header-user-button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasSearch"
                aria-controls="offcanvasSearch"
              >
                <Search size={20} />
              </button>

              {/* User Profile */}
              <div className="dropdown">
                <button
                  className="btn btn-light rounded-circle p-2 dropdown-toggle header-user-button"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  data-bs-display="static"
                  data-bs-reference="parent"
                  aria-expanded="false"
                  style={{ border: "none", outline: "none" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg header-dropdown-menu"
                  aria-labelledby="userDropdown"
                  data-bs-auto-close="true"
                  data-bs-offset="0,8"
                  data-bs-popper="static"
                  data-bs-boundary="viewport"
                  style={{
                    minWidth: "200px",
                    border: "none",
                    borderRadius: "12px",
                    padding: "8px 0",
                  }}
                >
                  {user ? (
                    <>
                      <li>
                        <h6 className="dropdown-header text-primary fw-bold px-3 py-2 header-dropdown-header">
                          Xin chào, {user.name || user.email}
                        </h6>
                      </li>
                      <li>
                        <hr className="dropdown-divider header-dropdown-divider" />
                      </li>
                      <li>
                        <Link
                          className="dropdown-item px-3 py-2 header-dropdown-item"
                          to="/profile"
                        >
                          <i className="bi bi-person"></i>
                          Hồ sơ
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item px-3 py-2 header-dropdown-item"
                          to="/favorites"
                        >
                          <i className="bi bi-heart"></i>
                          Sản phẩm yêu thích
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item px-3 py-2 header-dropdown-item"
                          to="/user-products"
                        >
                          <i className="bi bi-box"></i>
                          Quản lí sản phẩm
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider header-dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item px-3 py-2 text-danger header-dropdown-item"
                          onClick={handleLogoutClick}
                        >
                          <i className="bi bi-box-arrow-right"></i>
                          Đăng xuất
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          className="dropdown-item px-3 py-2 header-dropdown-item"
                          to="/login"
                        >
                          <i className="bi bi-box-arrow-in-right"></i>
                          Đăng nhập
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item px-3 py-2 header-dropdown-item"
                          to="/register"
                        >
                          <i className="bi bi-person-plus"></i>
                          Đăng ký
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Compare Products & New Post - Only for logged in users */}
              {user && (
                <>
                  {/* Plus button with dropdown for create actions */}
                  <div className="dropdown d-inline-block me-2">
                    <button
                      className="btn btn-light rounded-circle p-2 dropdown-toggle header-user-button"
                      type="button"
                      id="createDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      title="Tạo mới"
                    >
                      <Plus size={20} />
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end shadow-lg header-dropdown-menu"
                      aria-labelledby="createDropdown"
                      data-bs-auto-close="true"
                      data-bs-offset="0,8"
                      data-bs-popper="static"
                      data-bs-boundary="viewport"
                      style={{
                        minWidth: "200px",
                        border: "none",
                        borderRadius: "12px",
                        padding: "8px 0",
                      }}
                    >
                      <li>
                        <button
                          className="dropdown-item px-3 py-2 header-dropdown-item"
                          type="button"
                          onClick={() => navigate("/compare-product")}
                        >
                          <i className="bi bi-arrow-left-right"></i>
                          So sánh sản phẩm
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item px-3 py-2 header-dropdown-item"
                          type="button"
                          onClick={() => {
                            if (
                              user.role &&
                              user.role.toLowerCase() === "admin"
                            ) {
                              navigate("/create-product");
                            } else {
                              navigate("/user-create-product");
                            }
                          }}
                        >
                          <i className="bi bi-plus-circle"></i>
                          Tạo sản phẩm mới
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="btn btn-light rounded-circle p-2 d-lg-none header-user-button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-light py-2">
          {/* Desktop Navigation */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav me-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link fw-medium px-3 py-2" href="/">
                  Trang chủ
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium px-3 py-2" href="/products">
                  Tất cả sản phẩm
                </a>
              </li>
              {/* Nút yêu thích */}
              <li className="nav-item">
                <a
                  className="nav-link fw-medium px-3 py-2 d-flex align-items-center"
                  href="/favorites"
                  title="Sản phẩm yêu thích"
                  style={{ gap: 4 }}
                >
                  <Heart size={18} style={{ color: "#e74c3c" }} />
                  Yêu thích
                </a>
              </li>
              {/* Categories Dropdown */}
              <li className="nav-item dropdown position-relative">
                <button
                  className="nav-link dropdown-toggle fw-medium px-3 py-2 btn btn-link text-decoration-none border-0 bg-transparent"
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                  style={{ color: "inherit" }}
                >
                  Danh mục <ChevronDown size={16} className="ms-1" />
                </button>
                <div
                  className={`dropdown-menu ${
                    showCategoriesDropdown ? "show" : ""
                  } shadow-lg border-0`}
                  style={{
                    minWidth: "400px",
                    maxHeight: "500px",
                    overflowY: "auto",
                    borderRadius: "12px",
                  }}
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                >
                  <h6 className="dropdown-header text-primary fw-bold">
                    Danh mục sản phẩm
                  </h6>
                  <div className="px-3 pb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm danh mục..."
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      style={{ fontSize: 14 }}
                    />
                  </div>
                  <div className="row g-0 px-3">
                    {filteredCategories.length === 0 && (
                      <div className="col-12 text-muted py-2">
                        Không tìm thấy danh mục
                      </div>
                    )}
                    {filteredCategories.map((category) => (
                      <div key={category} className="col-6">
                        <a
                          className="dropdown-item py-3 px-3 rounded text-truncate"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategoryClick(category);
                          }}
                          title={category}
                          style={{
                            transition: "all 0.2s ease",
                            borderLeft: "3px solid transparent",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderLeftColor = "#0d6efd";
                            e.target.style.backgroundColor = "#f8f9fa";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderLeftColor = "transparent";
                            e.target.style.backgroundColor = "transparent";
                          }}
                        >
                          {category}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </li>

              {/* Brands Dropdown */}
              {brands.length > 0 && (
                <li className="nav-item dropdown position-relative">
                  <button
                    className="nav-link dropdown-toggle fw-medium px-3 py-2 btn btn-link text-decoration-none border-0 bg-transparent"
                    onMouseEnter={() => setShowBrandsDropdown(true)}
                    onMouseLeave={() => setShowBrandsDropdown(false)}
                    style={{ color: "inherit" }}
                  >
                    Thương hiệu <ChevronDown size={16} className="ms-1" />
                  </button>
                  <div
                    className={`dropdown-menu ${
                      showBrandsDropdown ? "show" : ""
                    } shadow-lg border-0`}
                    style={{
                      minWidth: "400px",
                      maxHeight: "500px",
                      overflowY: "auto",
                      borderRadius: "12px",
                    }}
                    onMouseEnter={() => setShowBrandsDropdown(true)}
                    onMouseLeave={() => setShowBrandsDropdown(false)}
                  >
                    <h6 className="dropdown-header text-primary fw-bold">
                      Thương hiệu nổi bật
                    </h6>
                    <div className="row g-0 px-3">
                      {brands.map((brand) => (
                        <div key={brand} className="col-6">
                          <a
                            className="dropdown-item py-3 px-3 rounded text-truncate"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleBrandClick(brand);
                            }}
                            title={brand}
                            style={{
                              transition: "all 0.2s ease",
                              borderLeft: "3px solid transparent",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderLeftColor = "#0d6efd";
                              e.target.style.backgroundColor = "#f8f9fa";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderLeftColor = "transparent";
                              e.target.style.backgroundColor = "transparent";
                            }}
                          >
                            {brand}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile Search Offcanvas */}
      <div
        className="offcanvas offcanvas-top"
        tabIndex="-1"
        id="offcanvasSearch"
        aria-labelledby="offcanvasSearchLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasSearchLabel">
            Tìm kiếm sản phẩm
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <SearchWithAutocomplete
            value={headerSearch}
            onChangeValue={setHeaderSearch}
            onSearch={handleSearch}
            placeholder="Tìm kiếm hơn 20,000 sản phẩm..."
          />
        </div>
      </div>

      {/* Mobile Navigation Offcanvas */}
      <div
        className="offcanvas offcanvas-end mobile-nav-offcanvas"
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header">
          <h5
            className="offcanvas-title mobile-nav-header"
            id="offcanvasNavbarLabel"
          >
            Menu
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link fw-medium py-3 border-bottom mobile-nav-item"
                href="/"
              >
                Trang chủ
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link fw-medium py-3 border-bottom mobile-nav-item"
                href="/product-browser"
              >
                Tất cả sản phẩm
              </a>
            </li>

            {/* Mobile Categories */}
            <li className="nav-item">
              <h6 className="nav-link text-primary fw-bold mt-3 mb-2 mobile-nav-header">
                Danh mục sản phẩm
              </h6>
            </li>
            <li className="nav-item px-3 pb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm danh mục..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                style={{ fontSize: 14 }}
              />
            </li>
            {filteredCategories.slice(0, 8).map((category) => (
              <li className="nav-item" key={category}>
                <a
                  className="nav-link ps-3 py-2 border-bottom mobile-nav-category"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category);
                  }}
                >
                  {category}
                </a>
              </li>
            ))}
            {filteredCategories.length > 8 && (
              <li className="nav-item">
                <a
                  className="nav-link ps-3 text-primary mobile-nav-category"
                  href="/product-browser"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/product-browser");
                  }}
                >
                  Xem tất cả danh mục...
                </a>
              </li>
            )}

            {/* Mobile Brands */}
            {brands.length > 0 && (
              <>
                <li className="nav-item">
                  <h6 className="nav-link text-primary fw-bold mt-3 mb-2 mobile-nav-header">
                    Thương hiệu
                  </h6>
                </li>
                {brands.slice(0, 10).map((brand) => (
                  <li className="nav-item" key={brand}>
                    <a
                      className="nav-link ps-3 py-2 border-bottom mobile-nav-brand"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBrandClick(brand);
                      }}
                    >
                      {brand}
                    </a>
                  </li>
                ))}
                {brands.length > 10 && (
                  <li className="nav-item">
                    <a
                      className="nav-link ps-3 text-primary mobile-nav-brand"
                      href="/brands"
                    >
                      Xem tất cả thương hiệu...
                    </a>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
