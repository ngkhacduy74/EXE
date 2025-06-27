import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Star, X, Plus, Menu, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { authApiClient } from "../Services/auth.service";

function Header() {
  const { user, loading, handleLogout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState([]);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [splitKeywords, setSplitKeywords] = useState([]);

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
    "Máy Làm Kem"
  ];

  // Enhanced states for product suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const headerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  // Fetch all products for better search
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await authApiClient.get("/product/");

        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setAllProducts(productData);
      } catch (error) {
        console.error("Error fetching all products:", error);
        setAllProducts([]);
      }
    };

    fetchAllProducts();
  }, []);

  // Function to get first image safely
  const getFirstImage = (product) => {
    // Kiểm tra nếu có mảng images và có ít nhất 1 ảnh
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images[0];
    }
    // Fallback về image đơn lẻ nếu có
    if (product.image) {
      return product.image;
    }
    // Fallback về ảnh mặc định
    return "./styles/images/product-thumb-1.png";
  };

  // Enhanced debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() && searchTerm.length >= 2) {
        fetchEnhancedSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, allProducts]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if click is on dropdown menu or dropdown toggle
      const isDropdownClick = event.target.closest('.dropdown-menu') || 
                             event.target.closest('[data-bs-toggle="dropdown"]') ||
                             event.target.closest('.dropdown') ||
                             event.target.closest('.header-dropdown-menu') ||
                             event.target.closest('.header-user-button');
      
      if (isDropdownClick) {
        return; // Don't close suggestions if clicking on dropdown
      }

      // Check desktop search
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        // Only close if not in mobile search
        if (!isMobileSearchOpen) {
          setShowSuggestions(false);
        }
      }

      // Check mobile search
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target) &&
        mobileSuggestionsRef.current &&
        !mobileSuggestionsRef.current.contains(event.target)
      ) {
        // Only close if in mobile search
        if (isMobileSearchOpen) {
          setShowSuggestions(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSearchOpen]);

  // Enhanced product suggestions with detailed info
  const fetchEnhancedSuggestions = async (query) => {
    try {
      setLoadingSuggestions(true);

      // Tách từ khóa dựa trên khoảng trắng
      const keywords = query.trim().split(/\s+/).filter(keyword => keyword.length > 0);
      setSplitKeywords(keywords);

      // Filter products locally for faster response
      const filteredProducts = allProducts
        .filter((product) => {
          // Tìm kiếm với từ khóa gốc
          const originalMatch = 
            product.name?.toLowerCase().includes(query.toLowerCase()) ||
            product.brand?.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase());

          // Tìm kiếm với từ khóa đã tách
          const splitMatch = keywords.length > 1 && keywords.every(keyword => 
            product.name?.toLowerCase().includes(keyword.toLowerCase()) ||
            product.brand?.toLowerCase().includes(keyword.toLowerCase()) ||
            product.description?.toLowerCase().includes(keyword.toLowerCase())
          );

          return originalMatch || splitMatch;
        })
        .slice(0, 8)
        .map((product) => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          image: getFirstImage(product),
          rating: product.rating,
          quantity: product.quantity,
          description: product.description,
          type: "product",
        }));

      setSuggestions(filteredProducts);
      setShowSuggestions(filteredProducts.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Format price like in Compare Product
  const formatPrice = (price) => {
    if (!price) return "Chưa có giá";
    return `${parseFloat(price).toLocaleString("vi-VN")} VND`;
  };

  // Render star rating like in Compare Product
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

  // Save search term to recent searches
  const saveRecentSearch = (term) => {
    if (!term.trim()) return;

    const newSearches = [
      term.trim(),
      ...recentSearches.filter((s) => s !== term.trim()),
    ].slice(0, 5);

    setRecentSearches(newSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newSearches));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await authApiClient.get("/product/");

        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // Extract unique brands
        const uniqueBrands = [
          ...new Set(productData.map((p) => p.brand).filter(Boolean)),
        ];

        setBrands(uniqueBrands);
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

  const handleSearch = (e, searchQuery = null) => {
    if (e) e.preventDefault();

    const query = searchQuery || searchTerm;
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }

    const params = new URLSearchParams();

    if (query.trim()) {
      // Tách từ khóa và thêm vào URL params
      const keywords = query.trim().split(/\s+/).filter(keyword => keyword.length > 0);
      
      // Thêm từ khóa gốc
      params.append("search", query.trim());
      
      // Thêm từ khóa đã tách nếu có nhiều hơn 1 từ
      if (keywords.length > 1) {
        params.append("keywords", keywords.join(","));
      }
    }

    const queryString = params.toString();
    navigate(`/product-browser${queryString ? `?${queryString}` : ""}`);
    setShowSuggestions(false);

    // Close mobile search offcanvas if open
    if (isMobileSearchOpen) {
      const offcanvasElement = document.getElementById("offcanvasSearch");
      if (offcanvasElement) {
        // Use data attributes to close offcanvas
        const closeButton = offcanvasElement.querySelector(
          '[data-bs-dismiss="offcanvas"]'
        );
        if (closeButton) {
          closeButton.click();
        }
      }
      setIsMobileSearchOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "product") {
      // Scroll to top before navigating
      window.scrollTo(0, 0);
      navigate(`/productView/${suggestion.id}`);
    } else {
      setSearchTerm(suggestion.name);
      handleSearch(null, suggestion.name);
    }
    setShowSuggestions(false);

    // Close mobile search offcanvas if open
    if (isMobileSearchOpen) {
      const offcanvasElement = document.getElementById("offcanvasSearch");
      if (offcanvasElement) {
        // Use data attributes to close offcanvas
        const closeButton = offcanvasElement.querySelector(
          '[data-bs-dismiss="offcanvas"]'
        );
        if (closeButton) {
          closeButton.click();
        }
      }
      setIsMobileSearchOpen(false);
    }
  };

  const handleSearchFocus = () => {
    // Show suggestions if there are recent searches or current search term is long enough
    if (searchTerm.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (recentSearches.length > 0) {
      setShowSuggestions(true);
    }

    // For mobile, always show suggestions when focused if there are recent searches
    if (isMobileSearchOpen && recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBrandClick = (brand) => {
    // Navigate to product browser with brand filter in URL
    navigate(`/product-browser?brand=${encodeURIComponent(brand)}`);
    setShowBrandsDropdown(false);
  };

  const handleCategoryClick = (category) => {
    // Navigate to product browser with category filter in URL
    navigate(`/product-browser?category=${encodeURIComponent(category)}`);
    setShowCategoriesDropdown(false);
  };

  // Ensure sticky positioning works
  useEffect(() => {
    const header = headerRef.current;
    if (header) {
      // Force sticky positioning
      header.style.position = "fixed";
      header.style.top = "0";
      header.style.left = "0";
      header.style.right = "0";
      header.style.zIndex = "1030";
      header.style.backgroundColor = "white";
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      header.style.width = "100%";
    }
  }, []);

  // Monitor mobile search offcanvas state
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvasSearch");
    if (offcanvasElement) {
      const handleShow = () => setIsMobileSearchOpen(true);
      const handleHide = () => {
        setIsMobileSearchOpen(false);
        setShowSuggestions(false); // Close suggestions when offcanvas closes
      };

      offcanvasElement.addEventListener("shown.bs.offcanvas", handleShow);
      offcanvasElement.addEventListener("hidden.bs.offcanvas", handleHide);

      return () => {
        offcanvasElement.removeEventListener("shown.bs.offcanvas", handleShow);
        offcanvasElement.removeEventListener("hidden.bs.offcanvas", handleHide);
      };
    }
  }, []);

  // Show suggestions when mobile search is opened
  useEffect(() => {
    if (isMobileSearchOpen) {
      // Always show suggestions if there are recent searches
      if (recentSearches.length > 0) {
        setShowSuggestions(true);
      }
      // Or if there's a search term with suggestions
      else if (searchTerm.trim().length >= 2 && suggestions.length > 0) {
        setShowSuggestions(true);
      }

      // Focus on mobile search input when opened
      setTimeout(() => {
        const mobileInput = document.getElementById("mobileSearchInput");
        if (mobileInput) {
          mobileInput.focus();
        }
      }, 100);
    }
  }, [
    isMobileSearchOpen,
    recentSearches.length,
    searchTerm,
    suggestions.length,
  ]);

  // Ensure header is fixed positioned
  useEffect(() => {
    const header = headerRef.current;
    if (header) {
      // Force fixed positioning
      header.style.position = "fixed";
      header.style.top = "0";
      header.style.left = "0";
      header.style.right = "0";
      header.style.zIndex = "1030";
      header.style.backgroundColor = "white";
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      header.style.width = "100%";
    }
  }, []);

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
        zIndex: 1030,
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
            <div className="search-bar" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="input-group shadow-sm rounded-pill overflow-hidden">
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Tìm kiếm hơn 20,000 sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleSearchFocus}
                    style={{ boxShadow: "none", borderRadius: "50px 0 0 50px" }}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    style={{ borderRadius: "0 50px 50px 0" }}
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>

              {/* Enhanced Search Suggestions Dropdown */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="position-absolute w-100 bg-white shadow-lg border rounded mt-1"
                  style={{
                    zIndex: 1050,
                    maxHeight: "500px",
                    overflowY: "auto",
                    top: "100%",
                  }}
                >
                  {loadingSuggestions ? (
                    <div className="p-4 text-center">
                      <div
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-2 text-muted small">
                        Đang tìm kiếm sản phẩm...
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && !searchTerm.trim() && (
                        <div className="border-bottom">
                          <div className="d-flex justify-content-between align-items-center p-3 pb-2">
                            <small className="text-muted fw-bold">
                              Tìm kiếm gần đây
                            </small>
                            <button
                              className="btn btn-sm btn-link text-muted p-0"
                              onClick={clearRecentSearches}
                            >
                              <X size={14} />
                            </button>
                          </div>
                          {recentSearches.map((term, index) => (
                            <div
                              key={index}
                              className="suggestion-item py-3 px-3 cursor-pointer d-flex align-items-center"
                              onClick={() => {
                                setSearchTerm(term);
                                handleSearch(null, term);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <Search size={16} className="text-muted me-3" />
                              <span
                                style={{ fontSize: "14px", fontWeight: "500" }}
                              >
                                {term}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Product Suggestions */}
                      {suggestions.length > 0 && (
                        <div className="p-2">
                          <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                            <small className="text-muted fw-bold">
                              Sản phẩm gợi ý
                            </small>
                            <small className="text-muted">
                              {suggestions.length} kết quả
                            </small>
                          </div>
                          
                          {/* Hiển thị từ khóa đã tách */}
                          {splitKeywords.length > 1 && (
                            <div className="mb-3 px-2">
                              <small className="text-muted d-block mb-1">
                                Từ khóa tìm kiếm:
                              </small>
                              <div className="d-flex flex-wrap gap-1">
                                {splitKeywords.map((keyword, index) => (
                                  <span
                                    key={index}
                                    className="badge bg-primary bg-opacity-10 text-primary small"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {suggestions.map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="suggestion-item d-flex align-items-center p-3 cursor-pointer rounded"
                              onClick={() => handleSuggestionClick(suggestion)}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {/* Product Info */}
                              <div className="flex-grow-1 min-w-0">
                                <div
                                  className="fw-semibold text-truncate mb-1"
                                  style={{ maxWidth: "300px" }}
                                >
                                  {suggestion.name}
                                </div>

                                <div className="small text-muted mb-1">
                                  <span className="badge bg-light text-dark me-2">
                                    {suggestion.brand}
                                  </span>
                                  <span className="text-muted">
                                    {suggestion.category}
                                  </span>
                                </div>

                                {/* Price and Rating */}
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="text-primary fw-bold small">
                                    {formatPrice(suggestion.price)}
                                  </div>

                                  {suggestion.rating && (
                                    <div className="small">
                                      {renderStars(suggestion.rating)}
                                    </div>
                                  )}
                                </div>

                                {/* Stock Status */}
                                {suggestion.quantity !== undefined && (
                                  <div className="mt-1">
                                    <span
                                      className={`badge ${
                                        suggestion.quantity > 0
                                          ? "bg-success"
                                          : "bg-danger"
                                      } small`}
                                    >
                                      {suggestion.quantity > 0
                                        ? `Còn ${suggestion.quantity}`
                                        : "Hết hàng"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
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
                <a
                  className="nav-link fw-medium px-3 py-2"
                  href="/product-browser"
                >
                  Tất cả sản phẩm
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
                  <div className="row g-0 px-3">
                    {categories.map((category) => (
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
          <div className="search-bar" ref={mobileSearchRef}>
            <form onSubmit={handleSearch}>
              <div className="row g-2 mb-3">
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm hơn 20,000 sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleSearchFocus}
                    autoComplete="off"
                    id="mobileSearchInput"
                  />
                </div>
                <div className="col-3">
                  <button className="btn btn-primary w-100" type="submit">
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </form>

            {/* Mobile Search Suggestions */}
            {showSuggestions && (
              <div
                ref={mobileSuggestionsRef}
                className="mobile-search-suggestions suggestions-container"
              >
                {loadingSuggestions ? (
                  <div className="p-4 text-center">
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-2 text-muted small">
                      Đang tìm kiếm sản phẩm...
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && !searchTerm.trim() && (
                      <div className="border-bottom">
                        <div className="d-flex justify-content-between align-items-center p-3 pb-2">
                          <small className="text-muted fw-bold">
                            Tìm kiếm gần đây
                          </small>
                          <button
                            className="btn btn-sm btn-link text-muted p-0"
                            onClick={clearRecentSearches}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        {recentSearches.map((term, index) => (
                          <div
                            key={index}
                            className="suggestion-item py-3 px-3 cursor-pointer d-flex align-items-center"
                            onClick={() => {
                              setSearchTerm(term);
                              handleSearch(null, term);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <Search size={16} className="text-muted me-3" />
                            <span
                              style={{ fontSize: "14px", fontWeight: "500" }}
                            >
                              {term}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Product Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="p-2">
                        <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                          <small className="text-muted fw-bold">
                            Sản phẩm gợi ý
                          </small>
                          <small className="text-muted">
                            {suggestions.length} kết quả
                          </small>
                        </div>
                        
                        {/* Hiển thị từ khóa đã tách */}
                        {splitKeywords.length > 1 && (
                          <div className="mb-3 px-2">
                            <small className="text-muted d-block mb-1">
                              Từ khóa tìm kiếm:
                            </small>
                            <div className="d-flex flex-wrap gap-1">
                              {splitKeywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="badge bg-primary bg-opacity-10 text-primary small"
                                  style={{ fontSize: "11px" }}
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {suggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="suggestion-item d-flex align-items-center p-3 cursor-pointer rounded"
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {/* Product Info */}
                            <div className="flex-grow-1 min-w-0">
                              <div
                                className="fw-semibold text-truncate mb-1"
                                style={{ maxWidth: "300px" }}
                              >
                                {suggestion.name}
                              </div>

                              <div className="small text-muted mb-1">
                                <span className="badge bg-light text-dark me-2">
                                  {suggestion.brand}
                                </span>
                                <span className="text-muted">
                                  {suggestion.category}
                                </span>
                              </div>

                              {/* Price and Rating */}
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="text-primary fw-bold small">
                                  {formatPrice(suggestion.price)}
                                </div>

                                {suggestion.rating && (
                                  <div className="small">
                                    {renderStars(suggestion.rating)}
                                  </div>
                                )}
                              </div>

                              {/* Stock Status */}
                              {suggestion.quantity !== undefined && (
                                <div className="mt-1">
                                  <span
                                    className={`badge ${
                                      suggestion.quantity > 0
                                        ? "bg-success"
                                        : "bg-danger"
                                    } small`}
                                  >
                                    {suggestion.quantity > 0
                                      ? `Còn ${suggestion.quantity}`
                                      : "Hết hàng"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
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
          <h5 className="offcanvas-title mobile-nav-header" id="offcanvasNavbarLabel">
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
              <a className="nav-link fw-medium py-3 border-bottom mobile-nav-item" href="/">
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
            {categories.slice(0, 8).map((category) => (
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
            {categories.length > 8 && (
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
                    <a className="nav-link ps-3 text-primary mobile-nav-brand" href="/brands">
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

