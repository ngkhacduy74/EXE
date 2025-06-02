import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Container, Spinner } from 'react-bootstrap';

const ProductsCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch products from API
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
        
        if (productData.length === 0) {
          throw new Error('No products found.');
        }

        setProducts(productData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize Swiper for each tab pane after products are loaded
  useEffect(() => {
    if (!loading && products.length > 0) {
      const carousels = document.querySelectorAll('.products-carousel');
      carousels.forEach((carousel) => {
        new Swiper(carousel, {
          modules: [Navigation],
          slidesPerView: 10,
          spaceBetween: 30,
          speed: 500,
          navigation: {
            nextEl: carousel.querySelector('.products-carousel-next'),
            prevEl: carousel.querySelector('.products-carousel-prev'),
          },
          breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
            991: { slidesPerView: 4 },
            1500: { slidesPerView: 6 },
          },
        });
      });
    }
  }, [loading, products]);

  // Handle navigation to product details
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle Add to Cart (placeholder - implement your cart logic)
  const handleAddToCart = (productId) => {
    console.log(`Add to cart: ${productId}`);
    // Implement your cart logic here (e.g., dispatch to a Redux store or API call)
  };

  // Filter products by category for tabs
  const allProducts = products;
  const fruitsVegesProducts = products.filter(
    (product) => product.category === 'Fruits & Veges'
  );
  const juicesProducts = products.filter(
    (product) => product.category === 'Juices'
  );

  // Hide component on error or if no products
  if (error || products.length === 0) {
    return null;
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
        <span className="ms-2">Loading products...</span>
      </Container>
    );
  }

  // Render product item
  const renderProductItem = (product) => (
    <div className="product-item">
      {product.discount && (
        <span className="badge bg-success position-absolute m-3">
          -{product.discount}%
        </span>
      )}
      <a href="#" className="btn-wishlist">
        <svg width="24" height="24">
          <use href="#heart" />
        </svg>
      </a>
      <figure>
        <a
          onClick={() => handleProductClick(product.id)}
          title={product.name}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={product.image || '/images/thumb-default.png'}
            className="tab-image"
            alt={product.name || 'Product'}
          />
        </a>
      </figure>
      <h3>{product.name || 'N/A'}</h3>
      <span className="qty">{product.quantity || 1} Unit</span>
      <span className="rating">
        <svg width="24" height="24" className="text-primary">
          <use href="#star-solid" />
        </svg>{' '}
        {product.rating || 'N/A'}
      </span>
      <span className="price">
        {product.price
          ? `${parseFloat(product.price).toLocaleString('vi-VN')} VND`
          : 'N/A'}
      </span>
      <div className="d-flex align-items-center justify-content-between">
        <div className="input-group product-qty">
          <span className="input-group-btn">
            <button
              type="button"
              className="quantity-left-minus btn btn-danger btn-number"
              data-type="minus"
            >
              <svg width="16" height="16">
                <use href="#minus" />
              </svg>
            </button>
          </span>
          <input
            type="text"
            id={`quantity-${product.id}`}
            name="quantity"
            className="form-control input-number"
            value="1"
            readOnly
          />
          <span className="input-group-btn">
            <button
              type="button"
              className="quantity-right-plus btn btn-success btn-number"
              data-type="plus"
            >
              <svg width="16" height="16">
                <use href="#plus" />
              </svg>
            </button>
          </span>
        </div>
        <a
          onClick={() => handleAddToCart(product.id)}
          className="nav-link"
          style={{ cursor: 'pointer' }}
        >
          Add to Cart <iconify-icon icon="uil:shopping-cart" />
        </a>
      </div>
    </div>
  );

  return (
    <section className="py-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="bootstrap-tabs product-tabs">
              <div className="tabs-header d-flex justify-content-between border-bottom my-5">
                <h3>Trending Products</h3>
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <a
                      href="#"
                      className="nav-link text-uppercase fs-6 active"
                      id="nav-all-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-all"
                    >
                      All
                    </a>
                    <a
                      href="#"
                      className="nav-link text-uppercase fs-6"
                      id="nav-fruits-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-fruits"
                    >
                      Fruits & Veges
                    </a>
                    <a
                      href="#"
                      className="nav-link text-uppercase fs-6"
                      id="nav-juices-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-juices"
                    >
                      Juices
                    </a>
                  </div>
                </nav>
              </div>
              <div className="tab-content" id="nav-tabContent">
                {/* Tab Pane: All */}
                <div
                  className="tab-pane fade show active"
                  id="nav-all"
                  role="tabpanel"
                  aria-labelledby="nav-all-tab"
                >
                  <div className="products-carousel swiper">
                    <div className="swiper-wrapper">
                      {allProducts.map((product) => (
                        <div className="swiper-slide" key={product.id}>
                          {renderProductItem(product)}
                        </div>
                      ))}
                    </div>
                    <div className="swiper-buttons">
                      <button className="swiper-prev products-carousel-prev btn btn-yellow">
                        ❮
                      </button>
                      <button className="swiper-next products-carousel-next btn btn-yellow">
                        ❯
                      </button>
                    </div>
                  </div>
                </div>
                {/* Tab Pane: Fruits & Veges */}
                <div
                  className="tab-pane fade"
                  id="nav-fruits"
                  role="tabpanel"
                  aria-labelledby="nav-fruits-tab"
                >
                  <div className="products-carousel swiper">
                    <div className="swiper-wrapper">
                      {fruitsVegesProducts.length > 0 ? (
                        fruitsVegesProducts.map((product) => (
                          <div className="swiper-slide" key={product.id}>
                            {renderProductItem(product)}
                          </div>
                        ))
                      ) : (
                        <div className="swiper-slide">
                          <div className="product-item text-center">
                            <p>No Fruits & Veges products available.</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="swiper-buttons">
                      <button className="swiper-prev products-carousel-prev btn btn-yellow">
                        ❮
                      </button>
                      <button className="swiper-next products-carousel-next btn btn-yellow">
                        ❯
                      </button>
                    </div>
                  </div>
                </div>
                {/* Tab Pane: Juices */}
                <div
                  className="tab-pane fade"
                  id="nav-juices"
                  role="tabpanel"
                  aria-labelledby="nav-juices-tab"
                >
                  <div className="products-carousel swiper">
                    <div className="swiper-wrapper">
                      {juicesProducts.length > 0 ? (
                        juicesProducts.map((product) => (
                          <div className="swiper-slide" key={product.id}>
                            {renderProductItem(product)}
                          </div>
                        ))
                      ) : (
                        <div className="swiper-slide">
                          <div className="product-item text-center">
                            <p>No Juices products available.</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="swiper-buttons">
                      <button className="swiper-prev products-carousel-prev btn btn-yellow">
                        ❮
                      </button>
                      <button className="swiper-next products-carousel-next btn btn-yellow">
                        ❯
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsCarousel;