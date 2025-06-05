import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './styles/style.css';
import './styles/vendor.css';
import Footer from '../Components/Footer';
import Canvas from '../Components/Canvas';
import ChatWidget from '../Components/WidgetChat';
import Header from '../Components/Header';
import { 
  Plus, 
  X, 
  Search, 
  Star, 
  ShoppingCart, 
  Package, 
  Scale,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const CompareProduct = () => {
  const [products, setProducts] = useState([]);
  const [compareProducts, setCompareProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const MAX_COMPARE_PRODUCTS = 4;

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
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Search products
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const timer = setTimeout(() => {
      const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      ).filter(product => 
        !compareProducts.some(cp => cp.id === product.id)
      );
      
      setSearchResults(filteredProducts.slice(0, 10)); // Limit to 10 results
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, products, compareProducts]);

  // Add product to comparison
  const addToCompare = (product) => {
    if (compareProducts.length >= MAX_COMPARE_PRODUCTS) {
      alert(`You can only compare up to ${MAX_COMPARE_PRODUCTS} products at once.`);
      return;
    }

    if (!compareProducts.some(cp => cp.id === product.id)) {
      setCompareProducts([...compareProducts, product]);
      setSearchTerm('');
      setShowProductSearch(false);
    }
  };

  // Remove product from comparison
  const removeFromCompare = (productId) => {
    setCompareProducts(compareProducts.filter(product => product.id !== productId));
  };

  // Clear all comparisons
  const clearAllComparisons = () => {
    setCompareProducts([]);
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `${parseFloat(price).toLocaleString('vi-VN')} VND`;
  };

  // Render star rating
  const renderStars = (rating) => {
    if (!rating) return <span className="text-muted">No rating</span>;
    
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
            className="text-warning"
          />
        ))}
        <span className="ms-1 small text-muted">({rating})</span>
      </div>
    );
  };

  // Get comparison features
  const getComparisonFeatures = () => {
    if (compareProducts.length === 0) return [];
    
    const features = [
      { key: 'image', label: 'Product Image', type: 'image' },
      { key: 'name', label: 'Product Name', type: 'text' },
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'price', label: 'Price', type: 'price' },
      { key: 'rating', label: 'Rating', type: 'rating' },
      { key: 'quantity', label: 'Stock Status', type: 'stock' },
      { key: 'capacity', label: 'Capacity', type: 'capacity' },
      { key: 'description', label: 'Description', type: 'text' },
    ];

    return features.filter(feature => 
      compareProducts.some(product => product[feature.key])
    );
  };

  // Render feature value
  const renderFeatureValue = (product, feature) => {
    const value = product[feature.key];
    
    switch (feature.type) {
      case 'image':
        return (
          <img
            src={value || './styles/images/product-thumb-1.png'}
            alt={product.name}
            className="img-fluid rounded"
            style={{ height: '100px', width: '100px', objectFit: 'cover' }}
          />
        );
      case 'price':
        return <span className="fw-bold text-primary">{formatPrice(value)}</span>;
      case 'rating':
        return renderStars(value);
      case 'stock':
        return (
          <span className={`badge ${value > 0 ? 'bg-success' : 'bg-danger'}`}>
            {value > 0 ? `In Stock (${value})` : 'Out of Stock'}
          </span>
        );
      case 'capacity':
        return value ? `${value} kg` : 'N/A';
      default:
        return value || 'N/A';
    }
  };

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
          <title>Compare Products - Vinsaky Shop</title>
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

        {/* Main Content */}
        <div className="container-fluid py-4">
          {/* Page Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="mb-1">
                    <Scale className="me-2" size={28} />
                    Compare Products
                  </h2>
                  <p className="text-muted mb-0">
                    Compare up to {MAX_COMPARE_PRODUCTS} products side by side to make the best choice
                  </p>
                </div>
                {compareProducts.length > 0 && (
                  <button 
                    className="btn btn-outline-danger"
                    onClick={clearAllComparisons}
                  >
                    <Trash2 size={16} className="me-1" />
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add Product Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Add Products to Compare</h5>
                    <span className="badge bg-primary">
                      {compareProducts.length}/{MAX_COMPARE_PRODUCTS} Products
                    </span>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="position-relative">
                    <div className="input-group">
                      <span className="input-group-text">
                        <Search size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search products by name, brand, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowProductSearch(true)}
                      />
                    </div>
                    
                    {/* Search Results Dropdown */}
                    {showProductSearch && (searchTerm || searchResults.length > 0) && (
                      <div className="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-lg" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                        {searchLoading ? (
                          <div className="p-3 text-center">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                              <span className="visually-hidden">Searching...</span>
                            </div>
                          </div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map(product => (
                            <div
                              key={product.id}
                              className="p-3 border-bottom hover-bg-light cursor-pointer d-flex align-items-center"
                              onClick={() => addToCompare(product)}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={(e) => e.target.closest('.p-3').style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.closest('.p-3').style.backgroundColor = 'transparent'}
                            >
                              <img
                                src={product.image || './styles/images/product-thumb-1.png'}
                                alt={product.name}
                                className="me-3 rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <div className="flex-grow-1">
                                <h6 className="mb-1">{product.name}</h6>
                                <small className="text-muted">
                                  {product.brand} • {product.category} • {formatPrice(product.price)}
                                </small>
                              </div>
                              <Plus size={16} className="text-primary" />
                            </div>
                          ))
                        ) : searchTerm && (
                          <div className="p-3 text-center text-muted">
                            No products found matching "{searchTerm}"
                          </div>
                        )}
                        
                        {searchResults.length > 0 && (
                          <div className="p-2 border-top bg-light">
                            <button
                              className="btn btn-sm btn-link text-decoration-none w-100"
                              onClick={() => setShowProductSearch(false)}
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          {compareProducts.length > 0 ? (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" className="border-end" style={{ width: '200px' }}>
                              Features
                            </th>
                            {compareProducts.map(product => (
                              <th key={product.id} scope="col" className="text-center position-relative">
                                <button
                                  className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                                  onClick={() => removeFromCompare(product.id)}
                                  style={{ zIndex: 10 }}
                                >
                                  <X size={14} />
                                </button>
                                <div className="pt-4">
                                  Product {compareProducts.indexOf(product) + 1}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {getComparisonFeatures().map(feature => (
                            <tr key={feature.key}>
                              <td className="fw-semibold border-end bg-light">
                                {feature.label}
                              </td>
                              {compareProducts.map(product => (
                                <td key={product.id} className="text-center align-middle">
                                  {renderFeatureValue(product, feature)}
                                </td>
                              ))}
                            </tr>
                          ))}
                          
                          {/* Action Row */}
                          <tr className="table-light">
                            <td className="fw-semibold border-end">
                              Actions
                            </td>
                            {compareProducts.map(product => (
                              <td key={product.id} className="text-center">
                                <div className="d-flex flex-column gap-2">

                                  <button className="btn btn-sm btn-outline-primary">
                                    <Eye size={14} className="me-1" />
                                    View Details
                                  </button>
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="row">
              <div className="col-12">
                <div className="text-center py-5">
                  <Package size={64} className="text-muted mb-3" />
                  <h4 className="text-muted mb-3">No Products to Compare</h4>
                  <p className="text-muted mb-4">
                    Start by searching and adding products to compare their features side by side.
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">
                            <CheckCircle size={20} className="text-success me-2" />
                            How to Compare Products
                          </h6>
                          <ol className="text-start mb-0">
                            <li>Use the search bar above to find products</li>
                            <li>Click on products from the dropdown to add them</li>
                            <li>Compare up to {MAX_COMPARE_PRODUCTS} products at once</li>
                            <li>View detailed comparisons in the table below</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ChatWidget />
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default CompareProduct;