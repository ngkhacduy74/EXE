import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, LogOut, LogIn, Copy, ChevronDown, Search, Menu, X } from 'lucide-react';
import axios from 'axios';

function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  
  // New states for product suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentsearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() && searchTerm.length >= 2) {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch product suggestions
  const fetchSuggestions = async (query) => {
    try {
      setLoadingSuggestions(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/product/search/suggestions`,
        {
          params: {
            q: query,
            limit: 8,
            category: selectedCategory !== 'all' ? selectedCategory : undefined
          }
        }
      );

      if (response.data && response.data.suggestions) {
        setSuggestions(response.data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Fallback: search in existing products
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/product/`
        );
        
        const productData = Array.isArray(response.data.data) ? response.data.data : [];
        const filtered = productData
          .filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 8)
          .map(product => ({
            id: product._id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            image: product.images?.[0],
            type: 'product'
          }));

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch (fallbackError) {
        console.error('Fallback search failed:', fallbackError);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Save search term to recent searches
  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Fetch categories and brands from products
  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/product/`
        );

        const productData = Array.isArray(response.data.data) ? response.data.data : [];
        
        if (productData.length > 0) {
          const uniqueCategories = [...new Set(
            productData
              .map(product => product.category)
              .filter(category => category && category.trim() !== '')
          )].sort();

          const uniqueBrands = [...new Set(
            productData
              .map(product => product.brand)
              .filter(brand => brand && brand.trim() !== '')
          )].sort();

          setCategories(uniqueCategories);
          setBrands(uniqueBrands);
        }
      } catch (error) {
        console.error('Error fetching categories and brands:', error);
        setCategories([]);
        setBrands([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (isLoggingOut) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        let parsedUser = null;

        try {
          if (userData) {
            parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }

        if (parsedUser?.email) {
          try {
            const response = await axios.get(
              `http://localhost:4000/auth/getUserByEmail?email=${encodeURIComponent(parsedUser.email)}`
            );

            if (response.data && response.data.user) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
              handleLogout();
            }
          } catch (err) {
            console.error('Failed to fetch user by email:', err);
            if (err.response?.status === 401) {
              handleLogout();
            }
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [isLoggingOut, navigate]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const handleSearch = (e, searchQuery = null) => {
    if (e) e.preventDefault();
    
    const query = searchQuery || searchTerm;
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    
    const params = new URLSearchParams();
    
    if (query.trim()) {
      params.append('search', query.trim());
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      params.append('category', selectedCategory);
    }
    
    const queryString = params.toString();
    navigate(`/product-browser${queryString ? `?${queryString}` : ''}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/productView/${suggestion.id}`);
    } else {
      setSearchTerm(suggestion.name);
      handleSearch(null, suggestion.name);
    }
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBrandClick = (brand) => {
    navigate(`/product-browser?brand=${encodeURIComponent(brand)}`);
    setShowBrandsDropdown(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/product-browser?category=${encodeURIComponent(category)}`);
    setShowCategoriesDropdown(false);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <header className="sticky-top bg-white shadow-sm">
      {/* Top Header */}
      <div className="container-fluid border-bottom">
        <div className="row py-3 align-items-center">
          {/* Logo */}
          <div className="col-6 col-sm-4 col-lg-3">
            <div className="main-logo">
              <a href="/" className="d-flex align-items-center">
                <img
                  src="../images/Logo.jpg"
                  alt="logo"
                  className="img-fluid"
                  style={{ width: '50px', height: 'auto' }}
                />
                <span className="ms-2 fw-bold text-primary d-none d-sm-inline">
                  Vinsaky
                </span>
              </a>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="col-lg-6 d-none d-lg-block position-relative">
            <div className="search-bar" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="input-group shadow-sm rounded-pill overflow-hidden">
                  <select 
                    className="form-select border-0 bg-light"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    disabled={loadingCategories}
                    style={{ maxWidth: '200px', borderRadius: '50px 0 0 50px' }}
                  >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Tìm kiếm hơn 20,000 sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleSearchFocus}
                    style={{ boxShadow: 'none' }}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    style={{ borderRadius: '0 50px 50px 0' }}
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <div 
                  ref={suggestionsRef}
                  className="position-absolute w-100 bg-white shadow-lg border rounded mt-1"
                  style={{ 
                    zIndex: 1050,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    top: '100%'
                  }}
                >
                  {loadingSuggestions ? (
                    <div className="p-3 text-center">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-2 text-muted small">Đang tìm kiếm...</div>
                    </div>
                  ) : (
                    <>
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && !searchTerm.trim() && (
                        <div className="p-2 border-bottom">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted fw-bold">Tìm kiếm gần đây</small>
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
                              className="py-2 px-3 cursor-pointer hover-bg-light d-flex align-items-center"
                              onClick={() => {
                                setSearchTerm(term);
                                handleSearch(null, term);
                              }}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={(e) => e.target.classList.add('bg-light')}
                              onMouseLeave={(e) => e.target.classList.remove('bg-light')}
                            >
                              <Search size={14} className="text-muted me-2" />
                              <span>{term}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Product Suggestions */}
                      {suggestions.length > 0 && (
                        <div className="p-2">
                          <small className="text-muted fw-bold mb-2 d-block">Sản phẩm gợi ý</small>
                          {suggestions.map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="d-flex align-items-center py-2 px-3 cursor-pointer rounded"
                              onClick={() => handleSuggestionClick(suggestion)}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={(e) => e.target.closest('div').classList.add('bg-light')}
                              onMouseLeave={(e) => e.target.closest('div').classList.remove('bg-light')}
                            >
                              {suggestion.image && (
                                <img
                                  src={suggestion.image}
                                  alt={suggestion.name}
                                  className="me-3 rounded"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div className="flex-grow-1">
                                <div className="fw-medium text-truncate" style={{ maxWidth: '300px' }}>
                                  {suggestion.name}
                                </div>
                                <div className="small text-muted">
                                  {suggestion.brand} • {suggestion.category}
                                  {suggestion.price && (
                                    <span className="text-primary fw-bold ms-2">
                                      {suggestion.price.toLocaleString('vi-VN')}đ
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* No results */}
                      {searchTerm.trim() && suggestions.length === 0 && !loadingSuggestions && (
                        <div className="p-3 text-center text-muted">
                          <div>Không tìm thấy sản phẩm phù hợp</div>
                          <small>Thử tìm kiếm với từ khóa khác</small>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="col-6 col-sm-8 col-lg-3 d-flex justify-content-end align-items-center">
            <div className="d-flex align-items-center gap-2">
              {/* Mobile Search Toggle */}
              <button
                className="btn btn-light rounded-circle p-2 d-lg-none"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasSearch"
                aria-controls="offcanvasSearch"
              >
                <Search size={20} />
              </button>

              {/* User Profile */}
              <div className="dropdown">
                <button
                  className="btn btn-light rounded-circle p-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {user ? (
                    <>
                      <li><h6 className="dropdown-header">Xin chào, {user.name || user.email}</h6></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a className="dropdown-item" href="/profile">Hồ sơ</a></li>
                      <li><a className="dropdown-item" href="/orders">Đơn hàng</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button></li>
                    </>
                  ) : (
                    <>
                      <li><a className="dropdown-item" href="/login">Đăng nhập</a></li>
                      <li><a className="dropdown-item" href="/register">Đăng ký</a></li>
                    </>
                  )}
                </ul>
              </div>

              {/* Create Post - Only for logged in users */}
              {/* {user && (
                <a href="/newPost" className="btn btn-light rounded-circle p-2" title="Tạo bài viết">
                  <Edit size={20} />
                </a>
              )} */}

              {/* Compare Products - Only for logged in users */}
              {user && (
                <a href="/compare-product" className="btn btn-light rounded-circle p-2" title="So sánh sản phẩm">
                  <Copy size={20} />
                </a>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="btn btn-light rounded-circle p-2 d-lg-none"
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
                <a className="nav-link fw-medium px-3 py-2" href="/product-browser">
                  Tất cả sản phẩm
                </a>
              </li>

              {/* Categories Dropdown */}
              <li className="nav-item dropdown position-relative">
                <button
                  className="nav-link dropdown-toggle fw-medium px-3 py-2 btn btn-link text-decoration-none border-0 bg-transparent"
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                  style={{ color: 'inherit' }}
                >
                  Danh mục <ChevronDown size={16} className="ms-1" />
                </button>
                <div 
                  className={`dropdown-menu ${showCategoriesDropdown ? 'show' : ''} shadow-lg border-0`}
                  style={{ 
                    minWidth: '280px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    borderRadius: '12px'
                  }}
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                >
                  <h6 className="dropdown-header text-primary fw-bold">Danh mục sản phẩm</h6>
                  <div className="row g-0 px-3">
                    {loadingCategories ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      categories.map((category) => (
                        <div key={category} className="col-12">
                          <a
                            className="dropdown-item py-2 px-2 rounded"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryClick(category);
                            }}
                            style={{ 
                              transition: 'all 0.2s ease',
                              borderLeft: '3px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderLeftColor = '#0d6efd';
                              e.target.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderLeftColor = 'transparent';
                              e.target.style.backgroundColor = 'transparent';
                            }}
                          >
                            {category}
                          </a>
                        </div>
                      ))
                    )}
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
                    style={{ color: 'inherit' }}
                  >
                    Thương hiệu <ChevronDown size={16} className="ms-1" />
                  </button>
                  <div 
                    className={`dropdown-menu ${showBrandsDropdown ? 'show' : ''} shadow-lg border-0`}
                    style={{ 
                      minWidth: '300px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      borderRadius: '12px'
                    }}
                    onMouseEnter={() => setShowBrandsDropdown(true)}
                    onMouseLeave={() => setShowBrandsDropdown(false)}
                  >
                    <h6 className="dropdown-header text-primary fw-bold">Thương hiệu nổi bật</h6>
                    <div className="row g-0 px-3">
                      {brands.map((brand) => (
                        <div key={brand} className="col-6">
                          <a
                            className="dropdown-item py-2 px-2 rounded text-truncate"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleBrandClick(brand);
                            }}
                            title={brand}
                            style={{ 
                              transition: 'all 0.2s ease',
                              borderLeft: '3px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderLeftColor = '#0d6efd';
                              e.target.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderLeftColor = 'transparent';
                              e.target.style.backgroundColor = 'transparent';
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
          <form onSubmit={handleSearch}>
            <div className="row g-2">
              <div className="col-12">
                <select 
                  className="form-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-9">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-3">
                <button className="btn btn-primary w-100" type="submit">
                  Tìm
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
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
              <a className="nav-link fw-medium py-3 border-bottom" href="/">
                Trang chủ
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium py-3 border-bottom" href="/product-browser">
                Tất cả sản phẩm
              </a>
            </li>
            
            {/* Mobile Categories */}
            <li className="nav-item">
              <h6 className="nav-link text-primary fw-bold mt-3 mb-2">Danh mục</h6>
            </li>
            {categories.map((category) => (
              <li className="nav-item" key={category}>
                <a 
                  className="nav-link ps-3 py-2 border-bottom" 
                  href={`/product-browser?category=${encodeURIComponent(category)}`}
                >
                  {category}
                </a>
              </li>
            ))}
            
            {/* Mobile Brands */}
            {brands.length > 0 && (
              <>
                <li className="nav-item">
                  <h6 className="nav-link text-primary fw-bold mt-3 mb-2">Thương hiệu</h6>
                </li>
                {brands.slice(0, 10).map((brand) => (
                  <li className="nav-item" key={brand}>
                    <a
                      className="nav-link ps-3 py-2 border-bottom"
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
                    <a className="nav-link ps-3 text-primary" href="/brands">
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