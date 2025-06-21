import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Container, Spinner } from "react-bootstrap";
const backUpImg = "/images/frigde.png"; // Ảnh từ thư mục public/images/

const BrandCarousel = () => {
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
          `${process.env.REACT_APP_BACKEND_URL}/product/`
        );

        // Handle different response structures
        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // Filter products to only include those with status "New"
        const newProducts = productData.filter(
          (product) => product.status === "New"
        );

        if (newProducts.length === 0) {
          throw new Error("No new products found.");
        }

        setProducts(newProducts);
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
    // Scroll to top before navigating
    window.scrollTo(0, 0);
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
    if (product.image) {
      if (Array.isArray(product.image) && product.image.length > 0) {
        const firstImage = product.image[0];
        if (firstImage && firstImage.trim() !== "") {
          // If it's a relative URL, make it absolute
          if (firstImage.startsWith("/") || firstImage.startsWith("./")) {
            const baseUrl = `${process.env.REACT_APP_BACKEND_URL}`;
            const fullUrl = firstImage.startsWith("/")
              ? `${baseUrl}${firstImage}`
              : `${baseUrl}/${firstImage.replace("./", "")}`;
            return fullUrl;
          }
          return firstImage;
        }
      } else if (typeof product.image === "string") {
        if (product.image.trim() !== "") {
          // If it's a relative URL, make it absolute
          if (product.image.startsWith("/") || product.image.startsWith("./")) {
            const baseUrl = `${process.env.REACT_APP_BACKEND_URL}`;
            const fullUrl = product.image.startsWith("/")
              ? `${baseUrl}${product.image}`
              : `${baseUrl}/${product.image.replace("./", "")}`;
            return fullUrl;
          }
          return product.image;
        }
      }
    }
    return backUpImg;
  };

  // Handle image load error
  const handleImageError = (e) => {
    e.target.src = backUpImg;
  };

  // Filter products by category/brand for tabs
  const allProducts = products;
  const fushimavinaProducts = products.filter(
    (product) => product.brand === "Fushimavina" && product.status === "New"
  );
  const ababaProducts = products.filter(
    (product) => product.brand === "ABABA" && product.status === "New"
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
        style={{ minHeight: "50vh" }}
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
        {/* Add "NEW" badge for new products */}
        <span className="badge bg-danger position-absolute top-0 end-0 m-2 z-index-1 fs-7">
          NEW
        </span>
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
            alt={product.name || "Product"}
            onError={handleImageError}
            loading="lazy"
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
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(product.id, -1)}
                disabled={quantities[product.id] <= 1}
              >
                -
              </button>
              <span className="mx-2 fw-bold">{quantities[product.id] || 1}</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(product.id, 1)}
              >
                +
              </button>
            </div>
          </div>
          <button
            className="btn btn-primary w-100"
            onClick={() => handleAddToCart(product.id)}
          >
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
              <div className="text-muted mb-3" style={{ fontSize: "3rem" }}>
                📦
              </div>
              <h5 className="text-muted">Không có sản phẩm</h5>
              <p className="text-muted">Vui lòng thử lại sau</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );

  return (
    <section className="py-5">
      <style>
        {`
          /* CSS cho đồng nhất kích thước hình ảnh */
          .product-item .card-img-top {
            width: 100%;
            height: 240px;
            object-fit: cover;
            object-position: center;
            transition: transform 0.3s ease;
          }

          .product-item:hover .card-img-top {
            transform: scale(1.05);
          }

          .product-item .card {
            height: 100%;
            transition: box-shadow 0.3s ease;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .product-item:hover .card {
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border-color: #007bff;
          }

          .product-item {
            transition: transform 0.2s ease-in-out;
          }

          .product-item:hover {
            transform: translateY(-2px);
          }

          /* Loading skeleton */
          .product-item .card-img-top[alt="product placeholder"] {
            background-color: #f8f9fa;
            border: 2px dashed #dee2e6;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }

          .product-item .card-img-top[alt="product placeholder"]::before {
            content: "📦";
            font-size: 3rem;
            color: #6c757d;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}
      </style>

      <Container>
        <div className="row">
          <div className="col-12">
            <div className="section-title text-center mb-5">
              <h2 className="fw-bold mb-3">Sản phẩm mới</h2>
              <p className="text-muted">
                Khám phá những sản phẩm mới nhất từ các thương hiệu uy tín
              </p>
            </div>

            <div className="product-tabs">
              <div className="row">
                <div className="col-12">
                  <nav>
                    <div className="nav nav-tabs justify-content-center" id="nav-tab-new" role="tablist">
                      <button
                        className="nav-link active"
                        id="nav-all-new-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-all-new"
                        type="button"
                        role="tab"
                      >
                        Tất cả
                      </button>
                      <button
                        className="nav-link"
                        id="nav-fushima-new-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-fushima-new"
                        type="button"
                        role="tab"
                      >
                        Fushimavina
                      </button>
                      <button
                        className="nav-link"
                        id="nav-ababa-new-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-ababa-new"
                        type="button"
                        role="tab"
                      >
                        ABABA
                      </button>
                    </div>
                  </nav>
                </div>
              </div>

              <div className="tab-content" id="nav-tabContent-new">
                {/* Tab Pane: All */}
                <div
                  className="tab-pane fade show active"
                  id="nav-all-new"
                  role="tabpanel"
                  aria-labelledby="nav-all-new-tab"
                >
                  {renderSwiper(allProducts)}
                </div>

                {/* Tab Pane: Fushimavina */}
                <div
                  className="tab-pane fade"
                  id="nav-fushima-new"
                  role="tabpanel"
                  aria-labelledby="nav-fushima-new-tab"
                >
                  {renderSwiper(fushimavinaProducts)}
                </div>

                {/* Tab Pane: ABABA */}
                <div
                  className="tab-pane fade"
                  id="nav-ababa-new"
                  role="tabpanel"
                  aria-labelledby="nav-ababa-new-tab"
                >
                  {renderSwiper(ababaProducts)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BrandCarousel;
