import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Container, Spinner } from "react-bootstrap";
const backUpImg = "/images/frigde.png";
const Product2Carousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // Initialize quantities for each product
  useEffect(() => {
    if (products.length > 0) {
      const initialQuantities = {};
      products.forEach((product) => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [products]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:4000/product/`
        );

        // Handle different response structures
        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // Filter products to only show "Second Hand" status
        const secondHandProducts = productData.filter(
          (product) => product.status === "SecondHand"
        );

        setProducts(secondHandProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle navigation to product details
  const handleProductClick = (productId) => {
    navigate(`/productView/${productId}`);
  };

  // Handle quantity change
  const handleQuantityChange = (productId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }));
  };

  // Handle Add to Cart
  const handleAddToCart = (productId) => {
    const quantity = quantities[productId] || 1;
    const product = products.find((p) => p.id === productId);
    console.log(`Xem chi tiết: ${product?.name} - Quantity: ${quantity}`);
    // Implement your cart logic here
  };

  // Get product image (handle array format)
  const getProductImage = (product) => {
    if (Array.isArray(product.image) && product.image.length > 0) {
      return product.image[0];
    } else if (typeof product.image === "string") {
      return product.image;
    }
    return backUpImg;
  };

  // Handle image load error
  const handleImageError = (e) => {
    e.target.src = backUpImg;
  };

  // Filter products by category/brand for tabs (only Second Hand products)
  const allProducts = products;
  const fushimavinaProducts = products.filter(
    (product) => product.brand === "Fushimavina"
  );
  const ababaProducts = products.filter((product) => product.brand === "ABABA");

  // Hide component if no Second Hand products exist
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Loading products...</span>
      </Container>
    );
  }

  // Hide component on error or if no Second Hand products
  if (error || products.length === 0) {
    return null;
  }

  // Render product item
  const renderProductItem = (product) => (
    <div
      className="product-item card h-100 border-0 shadow-sm"
      style={{
        minHeight: "420px",
        maxWidth: "100%",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div className="position-relative">
        {product.discount && (
          <span className="badge bg-success position-absolute top-0 start-0 m-2 z-index-1 fs-7">
            -{product.discount}%
          </span>
        )}
        <div
          className="card-img-top"
          style={{ cursor: "pointer" }}
          onClick={() => handleProductClick(product.id)}
        >
          <img
            src={getProductImage(product)}
            className="img-fluid rounded-top"
            alt={product.name}
            onError={handleImageError}
            style={{
              height: "240px",
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="mb-auto">
          <h6
            className="card-title fw-bold mb-2 fs-6"
            style={{
              lineHeight: "1.3",
              height: "2.6em",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name || "N/A"}
          </h6>
          <p className="text-muted mb-2 small fw-medium">
            {product.brand || "N/A"}
          </p>
          <div className="d-flex align-items-center mb-2">
            <span className="text-warning me-1 fs-7">★★★★☆</span>
            <small className="text-muted">(4.0)</small>
          </div>
          <div className="h6 text-success fw-bold mb-3">
            {product.price
              ? new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)
              : "Liên hệ"}
          </div>
        </div>

        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <div className="input-group" style={{ width: "130px" }}>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-2"
                onClick={() => handleQuantityChange(product.id, -1)}
                style={{ fontSize: "14px" }}
              >
                −
              </button>
              <input
                type="text"
                className="form-control form-control-sm text-center fw-medium"
                value={quantities[product.id] || 1}
                readOnly
                style={{ maxWidth: "60px" }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-2"
                onClick={() => handleQuantityChange(product.id, 1)}
                style={{ fontSize: "14px" }}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => handleProductClick(product.id)}
            className="btn btn-primary btn-sm w-100 py-2 fw-medium"
            style={{
              transition: "all 0.2s ease-in-out",
              fontSize: "14px",
            }}
          >
            <i className="fas fa-shopping-cart me-1"></i>
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );

  // Swiper configuration
  const swiperConfig = {
    modules: [Navigation],
    slidesPerView: 5,
    spaceBetween: 25,
    speed: 500,
    navigation: true,
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 15 },
      576: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 3, spaceBetween: 25 },
      1200: { slidesPerView: 4, spaceBetween: 25 },
      1400: { slidesPerView: 5, spaceBetween: 25 },
    },
  };

  // Render Swiper component
  const renderSwiper = (productsList) => (
    <div className="position-relative">
      <Swiper {...swiperConfig}>
        {productsList.length > 0 ? (
          productsList.map((product) => (
            <SwiperSlide key={product.id}>
              {renderProductItem(product)}
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="text-center p-5">
              <p className="text-muted">No products available.</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );

  return (
    <section className="py-5">
      <div className="container-fluid px-4">
        <div className="row">
          <div className="col-md-12">
            <div className="bootstrap-tabs product-tabs">
              <div className="tabs-header d-flex justify-content-between border-bottom mb-4 pb-3">
                <h3 className="fw-bold mb-0">Đồ cũ</h3>
                <nav>
                  <div
                    className="nav nav-tabs border-0"
                    id="nav-tab"
                    role="tablist"
                  >
                    <button
                      className="nav-link text-uppercase fs-6 active fw-medium px-4"
                      id="nav-all-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-all"
                      type="button"
                      role="tab"
                    >
                      All
                    </button>
                    <button
                      className="nav-link text-uppercase fs-6 fw-medium px-4"
                      id="nav-fushima-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-fushima"
                      type="button"
                      role="tab"
                    >
                      Fushimavina
                    </button>
                    <button
                      className="nav-link text-uppercase fs-6 fw-medium px-4"
                      id="nav-ababa-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-ababa"
                      type="button"
                      role="tab"
                    >
                      ABABA
                    </button>
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
                  {renderSwiper(allProducts)}
                </div>

                {/* Tab Pane: Fushimavina */}
                <div
                  className="tab-pane fade"
                  id="nav-fushima"
                  role="tabpanel"
                  aria-labelledby="nav-fushima-tab"
                >
                  {renderSwiper(fushimavinaProducts)}
                </div>

                {/* Tab Pane: ABABA */}
                <div
                  className="tab-pane fade"
                  id="nav-ababa"
                  role="tabpanel"
                  aria-labelledby="nav-ababa-tab"
                >
                  {renderSwiper(ababaProducts)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product2Carousel;
//Cũ
