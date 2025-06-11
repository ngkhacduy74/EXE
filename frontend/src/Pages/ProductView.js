import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  timeout: 5000,
});

const ProductView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        // Kiểm tra productId
        console.log('Product ID:', productId);
        if (!productId || productId.trim() === '') {
          setError('No product ID in URL.');
          return;
        }
        if (isNaN(productId)) { // Nếu productId phải là số
          setError('Invalid product ID format.');
          return;
        }

        // Kiểm tra token
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
          setError('No token found. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const response = await api.get(`/product/${productId}`, {
          headers: {
            token, // Sử dụng định dạng chuẩn
            'Content-Type': 'application/json',
          },
        });

        setProduct(response.data.data || response.data.product || response.data);
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 403:
              setError('Access denied: You don’t have permission to view this product.');
              break;
            case 404:
              setError(`Product with ID ${productId} not found.`);
              break;
            case 401:
              setError('Session expired. Redirecting to login...');
              setTimeout(() => navigate('/login'), 2000);
              break;
            default:
              setError(`Error ${err.response.status}: ${err.response.data?.message || 'Failed to fetch product.'}`);
          }
        } else {
          setError('Network error or server is down.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!product) return <div style={{ padding: 20 }}>No product data available.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Product Details</h2>
      <p><strong>ID:</strong> {product.id || productId}</p>
      <p><strong>Name:</strong> {product.name || 'N/A'}</p>
      <p><strong>Price:</strong> {product.price ? `${product.price} VND` : 'N/A'}</p>
    </div>
  );
};

export default ProductView;