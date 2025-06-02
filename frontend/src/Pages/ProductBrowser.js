import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './styles/style.css';
import './styles/vendor.css';
import Footer from '../Components/Footer';
import Canvas from '../Components/Canvas';
import ChatWidget from '../Components/WidgetChat';
import Header from '../Components/Header';
import { Filter, Grid, List, ChevronDown, ChevronUp, X, Package, Star } from 'lucide-react';
import axios from 'axios';

const ProductBrowse = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  
  // UI states
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    brand: true,
    price: true,
    rating: true
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
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/product/");
        console.log("API Response:", response.data);

        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setProducts(productData);
        setFilteredProducts(productData);

        // Extract unique categories and brands
        const uniqueCategories = [...new Set(productData.map((p) => p.category).filter(Boolean))];
        const uniqueBrands = [...new Set(productData.map((p) => p.brand).filter(Boolean))];
        
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
      result = result.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category));
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter((product) => selectedBrands.includes(product.brand));
    }

    // Filter by price range
    if (minPrice !== '' || maxPrice !== '') {
      result = result.filter((product) => {
        const price = parseFloat(product.price) || 0;
        const min = minPrice !== '' ? parseFloat(minPrice) : -Infinity;
        const max = maxPrice !== '' ? parseFloat(maxPrice) : Infinity;
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
      case 'price-low':
        result.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategories, selectedBrands, minPrice, maxPrice, rating, inStock, sortBy, products]);

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setRating(0);
    setInStock(false);
  };

  const toggleFilterExpand = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'position-fixed top-0 start-0 w-100 h-100 bg-white overflow-auto' : ''} ${isMobile ? 'z-index-1050' : ''}`}>
      {isMobile && (
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom sticky-top bg-white">
          <h5 className="mb-0">Filters</h5>
          <button 
            className="btn btn-link p-0"
            onClick={() => setShowMobileFilters(false)}
          >
            <X size={24} />
          </button>
        </div>
      )}
      
      <div className={`${isMobile ? 'p-3' : ''}`}>
        {/* Search */}
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

        {/* Clear Filters */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Filters</h6>
          <button className="btn btn-link btn-sm text-decoration-none p-0" onClick={clearFilters}>
            Clear All
          </button>
        </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="filter-group mb-4">
            <div 
              className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleFilterExpand('category')}
            >
              <h6 className="mb-0">Categories</h6>
              {expandedFilters.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.category && (
              <div className="filter-content mt-2">
                {categories.map(category => (
                  <div key={category} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <label className="form-check-label" htmlFor={`category-${category}`}>
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
              onClick={() => toggleFilterExpand('brand')}
            >
              <h6 className="mb-0">Brands</h6>
              {expandedFilters.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.brand && (
              <div className="filter-content mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {brands.map(brand => (
                  <div key={brand} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <label className="form-check-label" htmlFor={`brand-${brand}`}>
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
            onClick={() => toggleFilterExpand('price')}
          >
            <h6 className="mb-0">Price Range (VND)</h6>
            {expandedFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                  Range: {parseFloat(minPrice).toLocaleString('vi-VN')} - {parseFloat(maxPrice).toLocaleString('vi-VN')} VND
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
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className={`product-card ${viewMode === 'list' ? 'product-card-list' : ''} mb-4`}>
      <div className={`card h-100 ${viewMode === 'list' ? 'flex-row' : ''}`}>
        <div className={`position-relative ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
          <img
            src={product.image || './styles/images/product-thumb-1.png'}
            className={`card-img-top ${viewMode === 'list' ? 'card-img-list' : ''}`}
            alt={product.name}
            style={{ 
              height: viewMode === 'list' ? '150px' : '200px',
              width: viewMode === 'list' ? '150px' : '100%',
              objectFit: 'cover'
            }}
          />
          {product.discount && product.discount > 0 && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
              -{product.discount}%
            </span>
          )}
          {product.quantity <= 0 && (
            <span className="badge bg-secondary position-absolute top-0 end-0 m-2">
              Out of Stock
            </span>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <div className="mb-2">
            <small className="text-muted">{product.brand || 'No Brand'}</small>
            {product.category && (
              <small className="text-muted ms-2">• {product.category}</small>
            )}
          </div>
          <h6 className="card-title">{product.name || 'Unnamed Product'}</h6>
          
          {product.rating && (
            <div className="mb-2">
              <span className="text-warning me-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </span>
              <small className="text-muted">({product.rating})</small>
            </div>
          )}
          
          <div className="price-section mb-3">
            <span className="h6 text-primary">
              {product.price 
                ? `${parseFloat(product.price).toLocaleString('vi-VN')} VND`
                : 'Price not available'
              }
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through ms-2">
                {parseFloat(product.originalPrice).toLocaleString('vi-VN')} VND
              </span>
            )}
          </div>

          {product.capacity && (
            <div className="mb-2">
              <small className="text-muted">Capacity: {product.capacity} kg</small>
            </div>
          )}
          
          <div className="mt-auto">
            <button 
              className={`btn btn-sm w-100 ${product.quantity > 0 ? 'btn-outline-primary' : 'btn-secondary'}`}
              disabled={product.quantity <= 0}
            >
              {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <HelmetProvider>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
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
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div style={{ overflowX: 'hidden', paddingLeft: '10px', paddingRight: '10px' }}>
        <Helmet>
          <title>Browse Products - Vinsaky Shop</title>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
            <div className="modal-backdrop show"></div>
            <FilterSidebar isMobile={true} />
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
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <button 
                    className="btn btn-outline-secondary d-md-none"
                    onClick={() => setShowMobileFilters(true)}
                  >
                    <Filter size={16} className="me-1" />
                    Filters
                  </button>
                  <span className="text-muted">
                    Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                  </span>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <select 
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                  
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 || selectedBrands.length > 0 || rating > 0 || inStock || minPrice || maxPrice) && (
                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <span className="small text-muted">Active filters:</span>
                    {selectedCategories.map(category => (
                      <span key={category} className="badge bg-secondary">
                        {category}
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => handleCategoryChange(category)}
                        ></button>
                      </span>
                    ))}
                    {selectedBrands.map(brand => (
                      <span key={brand} className="badge bg-secondary">
                        {brand}
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => handleBrandChange(brand)}
                        ></button>
                      </span>
                    ))}
                    {rating > 0 && (
                      <span className="badge bg-secondary">
                        {rating}+ Stars
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => setRating(0)}
                        ></button>
                      </span>
                    )}
                    {(minPrice || maxPrice) && (
                      <span className="badge bg-secondary">
                        Price: {minPrice || '0'} - {maxPrice || '∞'} VND
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                        ></button>
                      </span>
                    )}
                    {inStock && (
                      <span className="badge bg-secondary">
                        In Stock
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
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
                  <p className="text-muted">Try adjusting your filters or search term</p>
                  {(selectedCategories.length > 0 || selectedBrands.length > 0 || rating > 0 || inStock || minPrice || maxPrice || searchTerm) && (
                    <button className="btn btn-primary" onClick={clearFilters}>
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className={`row ${viewMode === 'list' ? 'row-cols-1' : 'row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4'}`}>
                    {currentProducts.map(product => (
                      <div key={product.id} className="col">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav aria-label="Page navigation" className="mt-4">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
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
                          if (pageNumber === 1 || pageNumber === totalPages || 
                              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                            return (
                              <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => handlePageChange(pageNumber)}
                                >
                                  {pageNumber}
                                </button>
                              </li>
                            );
                          } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                            return <li key={pageNumber} className="page-item disabled"><span className="page-link">...</span></li>;
                          }
                          return null;
                        })}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
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