import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './styles/style.css';
import './styles/vendor.css';
import Footer from '../Components/Footer';
import Canvas from '../Components/Canvas';
import ChatWidget from '../Components/WidgetChat';
import Header from '../Components/Header';
import { Filter, Grid, List, ChevronDown, ChevronUp, X } from 'lucide-react';

const ProductBrowser = () => {
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: false
  });
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    brand: true,
    price: true,
    rating: true
  });

  // Sample data - replace with your actual data
  const categories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Bakery',
    'Meat & Seafood',
    'Beverages',
    'Snacks',
    'Frozen Foods',
    'Health & Beauty'
  ];

  const brands = [
    'Organic Valley',
    'Fresh Market',
    'Nature\'s Best',
    'Green Choice',
    'Pure Harvest',
    'Farm Fresh',
    'Golden Gate',
    'Healthy Living'
  ];

  const sampleProducts = [
    {
      id: 1,
      name: 'Fresh Organic Apples',
      price: 4.99,
      originalPrice: 6.99,
      image: './styles/images/product-thumb-1.png',
      rating: 4.5,
      reviews: 128,
      category: 'Fruits & Vegetables',
      brand: 'Organic Valley',
      inStock: true,
      discount: 29
    },
    {
      id: 2,
      name: 'Premium Tomato Ketchup',
      price: 3.49,
      originalPrice: null,
      image: './styles/images/product-thumb-2.png',
      rating: 4.2,
      reviews: 89,
      category: 'Snacks',
      brand: 'Fresh Market',
      inStock: true,
      discount: 0
    },
    // Add more sample products as needed
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleBrandChange = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: false
    });
  };

  const toggleFilterExpand = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'position-fixed top-0 start-0 w-100 h-100 bg-white' : ''} ${isMobile ? 'z-index-1050' : ''}`}>
      {isMobile && (
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
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
        {/* Clear Filters */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Filters</h6>
          <button className="btn btn-link btn-sm text-decoration-none" onClick={clearFilters}>
            Clear All
          </button>
        </div>

        {/* Categories Filter */}
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
                    checked={filters.categories.includes(category)}
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

        {/* Brands Filter */}
        <div className="filter-group mb-4">
          <div 
            className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
            onClick={() => toggleFilterExpand('brand')}
          >
            <h6 className="mb-0">Brands</h6>
            {expandedFilters.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expandedFilters.brand && (
            <div className="filter-content mt-2">
              {brands.map(brand => (
                <div key={brand} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
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

        {/* Price Range Filter */}
        <div className="filter-group mb-4">
          <div 
            className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
            onClick={() => toggleFilterExpand('price')}
          >
            <h6 className="mb-0">Price Range</h6>
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
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000])}
                  />
                </div>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div className="filter-group mb-4">
          <div 
            className="filter-header d-flex justify-content-between align-items-center cursor-pointer"
            onClick={() => toggleFilterExpand('rating')}
          >
            <h6 className="mb-0">Rating</h6>
            {expandedFilters.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expandedFilters.rating && (
            <div className="filter-content mt-2">
              {[4, 3, 2, 1].map(rating => (
                <div key={rating} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="rating"
                    id={`rating-${rating}`}
                    checked={filters.rating === rating}
                    onChange={() => handleFilterChange('rating', rating)}
                  />
                  <label className="form-check-label d-flex align-items-center" htmlFor={`rating-${rating}`}>
                    <span className="text-warning me-1">
                      {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
                    </span>
                    <span>& Up</span>
                  </label>
                </div>
              ))}
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
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
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
            src={product.image}
            className={`card-img-top ${viewMode === 'list' ? 'card-img-list' : ''}`}
            alt={product.name}
            style={{ 
              height: viewMode === 'list' ? '150px' : '200px',
              width: viewMode === 'list' ? '150px' : '100%',
              objectFit: 'cover'
            }}
          />
          {product.discount > 0 && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
              -{product.discount}%
            </span>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <div className="mb-2">
            <small className="text-muted">{product.brand}</small>
          </div>
          <h6 className="card-title">{product.name}</h6>
          <div className="mb-2">
            <span className="text-warning">
              {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))}
            </span>
            <small className="text-muted ms-1">({product.reviews})</small>
          </div>
          <div className="price-section mb-3">
            <span className="h6 text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through ms-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <div className="mt-auto">
            <button className="btn btn-outline-primary btn-sm w-100">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
                  <span className="text-muted">Showing 1-12 of 150 products</span>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <select 
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="featured">Featured</option>
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
              {(filters.categories.length > 0 || filters.brands.length > 0 || filters.rating > 0 || filters.inStock) && (
                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <span className="small text-muted">Active filters:</span>
                    {filters.categories.map(category => (
                      <span key={category} className="badge bg-secondary">
                        {category}
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => handleCategoryChange(category)}
                        ></button>
                      </span>
                    ))}
                    {filters.brands.map(brand => (
                      <span key={brand} className="badge bg-secondary">
                        {brand}
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => handleBrandChange(brand)}
                        ></button>
                      </span>
                    ))}
                    {filters.rating > 0 && (
                      <span className="badge bg-secondary">
                        {filters.rating}+ Stars
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => handleFilterChange('rating', 0)}
                        ></button>
                      </span>
                    )}
                    {filters.inStock && (
                      <span className="badge bg-secondary">
                        In Stock
                        <button 
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => handleFilterChange('inStock', false)}
                        ></button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Products Grid */}
              <div className={`row ${viewMode === 'list' ? 'row-cols-1' : 'row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4'}`}>
                {sampleProducts.map(product => (
                  <div key={product.id} className="col">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <span className="page-link">Previous</span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">1</span>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <ChatWidget />
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default ProductBrowser;