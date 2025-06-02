import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Container, Spinner, Card } from 'react-bootstrap';

const BrandCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch products with status == 'New'
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/product/`
        );

        // Handle different response structures
        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        
        // Filter for products with status == 'New'
        const newProducts = productData.filter((product) => product.status === 'New');
        
        if (newProducts.length === 0) {
          throw new Error('No newly arrived brands found.');
        }

        setProducts(newProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch newly arrived brands.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize Swiper after products are loaded
  useEffect(() => {
    if (!loading && products.length > 0) {
      new Swiper('.brand-carousel', {
        modules: [Navigation],
        slidesPerView: 4,
        spaceBetween: 30,
        speed: 500,
        navigation: {
          nextEl: '.brand-carousel-next',
          prevEl: '.brand-carousel-prev',
        },
        breakpoints: {
          0: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          991: { slidesPerView: 3 },
          1500: { slidesPerView: 4 },
        },
      });
    }
  }, [loading, products]);

  // Handle card click to navigate to product details
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Hide component if there's an error
  if (error) {
    return null; // or return <></>;
  }

  // Show loading spinner
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '50vh' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Loading newly arrived brands...</span>
      </Container>
    );
  }

  // Render carousel only if there are products
  return (
    <section className="py-5 overflow-hidden">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="section-header d-flex flex-wrap justify-content-between mb-5">
              <h2 className="section-title">Newly Arrived Brands</h2>
              <div className="d-flex align-items-center">
                <a href="/products" className="btn-link text-decoration-none">
                  View All Products →
                </a>
                <div className="swiper-buttons">
                  <button className="swiper-prev brand-carousel-prev btn btn-yellow">
                    ❮
                  </button>
                  <button className="swiper-next brand-carousel-next btn btn-yellow">
                    ❯
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="brand-carousel swiper">
              <div className="swiper-wrapper">
                {products.map((product) => (
                  <div className="swiper-slide" key={product.id}>
                    <div
                      className="card mb-3 p-3 rounded-4 shadow border-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleCardClick(product.id)}
                    >
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img
                            src={product.image || '/images/product-thumb-default.jpg'}
                            className="img-fluid rounded"
                            alt={product.name || 'Product'}
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body py-0">
                            <p className="text-muted mb-0">{product.brand || 'N/A'}</p>
                            <h5 className="card-title">{product.name || 'N/A'}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;