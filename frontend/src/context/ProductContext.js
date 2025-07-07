import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts } from '../Services/api.service';

const ProductContext = createContext();

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Fetch all products once
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProducts();
        const productData = Array.isArray(response.data.data) ? response.data.data : [];
        setAllProducts(productData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products.');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Filter products based on criteria
  const getFilteredProducts = (filterCriteria = {}) => {
    let filtered = [...allProducts];

    // Filter by status
    if (filterCriteria.status) {
      filtered = filtered.filter(product => product.status === filterCriteria.status);
    }

    // Filter by brand
    if (filterCriteria.brand) {
      filtered = filtered.filter(product => product.brand === filterCriteria.brand);
    }

    // Filter by category
    if (filterCriteria.category) {
      filtered = filtered.filter(product => product.category === filterCriteria.category);
    }

    // Filter by price range
    if (filterCriteria.minPrice) {
      filtered = filtered.filter(product => product.price >= filterCriteria.minPrice);
    }
    if (filterCriteria.maxPrice) {
      filtered = filtered.filter(product => product.price <= filterCriteria.maxPrice);
    }

    // Filter by search term
    if (filterCriteria.search) {
      const searchTerm = filterCriteria.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  };

  // Get products by status
  const getProductsByStatus = (status) => {
    return allProducts.filter(product => product.status === status);
  };

  // Get products by brand
  const getProductsByBrand = (brand) => {
    return allProducts.filter(product => product.brand === brand);
  };

  // Get unique brands
  const getUniqueBrands = () => {
    return Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean)));
  };

  // Get unique categories
  const getUniqueCategories = () => {
    return Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)));
  };

  const value = {
    allProducts,
    loading,
    error,
    filters,
    setFilters,
    getFilteredProducts,
    getProductsByStatus,
    getProductsByBrand,
    getUniqueBrands,
    getUniqueCategories,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 