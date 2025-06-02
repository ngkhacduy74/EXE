import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Container, Spinner } from 'react-bootstrap';

const ProductItem = ({ id, image, title, price, discount, rating, quantity = 1 }) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const navigate = useNavigate();

  const handlePlus = () => setLocalQuantity((q) => q + 1);
  const handleMinus = () => setLocalQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleProductClick = () => navigate(`/product/${id}`);
  const handleAddToCart = () => {
    console.log(`Add to cart: ${id}, Quantity: ${localQuantity}`);
    // Implement your cart logic here (e.g., dispatch to Redux or API call)
  };

  return (
    <div className="swiper-slide product-item">
      {discount && (
        <span className="badge bg-success position-absolute m-3">{discount}%</span>
      )}
      <a href="#" className="btn-wishlist">
        <svg width="24" height="24">
          <use href="#heart" />
        </svg>
      </a>
      <figure>
        <a
          onClick={handleProductClick}
          title={title}
          style={{ cursor: 'pointer' }}
          aria-label={`View details for ${title}`}
        >
          <img src={image || '/images/thumb-default.png'} className="tab-image" alt={title || 'Product'} />
        </a>
      </figure>
      <h3>{title || 'N/A'}</h3>
      <span className="qty">{localQuantity} Unit</span>
      <span className="rating">
        <svg width="24" height="24" className="text-primary">
          <use href="#star-solid" />
        </svg>{' '}
        {rating || 'N/A'}
      </span>
      <span className="price">
        {price ? `${parseFloat(price).toLocaleString('vi-VN')} VND` : 'N/A'}
      </span>
      <div className="d-flex align-items-center justify-content-between">
        <div className="input-group product-qty">
          <span className="input-group-btn">
            <button
              type="button"
              className="quantity-left-minus btn btn-danger btn-number"
              onClick={handleMinus}
            >
              <svg width="16" height="16">
                <use href="#minus" />
              </svg>
            </button>
          </span>
          <input
            type="text"
            id={`quantity-${id}`}
            name="quantity"
            className="form-control input-number"
            value={localQuantity}
            readOnly
          />
          <span className="input-group-btn">
            <button
              type="button"
              className="quantity-right-plus btn btn-success btn-number"
              onClick={handlePlus}
            >
              <svg width="16" height="16">
                <use href="#plus" />
              </svg>
            </button>
          </span>
        </div>
        <a onClick={handleAddToCart} className="nav-link" style={{ cursor: 'pointer' }}>
          Add to Cart <iconify-icon icon="uil:shopping-cart" />
        </a>
      </div>
    </div>
  );
};

const BestSellingCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Optionally filter or sort for best-selling products
        // Example: const bestSelling = productData.filter(p => p.isBestSelling);
        // or: const bestSelling = productData.sort((a, b) => b.salesCount - a.salesCount);
        setProducts(productData); // Display all products as requested
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

  // Initialize Swiper after products are loaded
  useEffect(() => {
    if (!loading && products.length > 0) {
      new Swiper('.products-carousel', {
        modules: [Navigation],
        slidesPerView: 5,
        spaceBetween: 30,
        speed: 500,
        navigation: {
          nextEl: '.category-carousel-next',
          prevEl: '.category-carousel-prev',
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          768: { slidesPerView: 3 },
          991: { slidesPerView: 4 },
          1500: { slidesPerView: 5 },
        },
      });
    }
  }, [loading, products]);

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
        <span className="ms-2">Loading best-selling products...</span>
      </Container>
    );
  }

  return (
    <section className="py-5 overflow-hidden">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="section-header d-flex flex-wrap justify-content-between my-5">
              <h2 className="section-title">Best Selling Products</h2>
              <div className="d-flex align-items-center">
                <a href="/products" className="btn-link text-decoration-none">
                  View All Products →
                </a>
                <div className="swiper-buttons">
                  <button className="swiper-prev category-carousel-prev btn btn-yellow">
                    ❮
                  </button>
                  <button className="swiper-next category-carousel-next btn btn-yellow">
                    ❯
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="products-carousel swiper">
              <div className="swiper-wrapper">
                {products.map((product) => (
                  <ProductItem
                    key={product.id}
                    id={product.id}
                    image={product.image}
                    title={product.name}
                    price={product.price}
                    discount={product.discount}
                    rating={product.rating}
                    quantity={product.quantity}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellingCarousel;