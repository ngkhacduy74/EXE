import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Container, Spinner } from "react-bootstrap";
const backUpImg = "/images/frigde.png"; // Ảnh từ thư mục public/images/
const BestSellingCarousel = () => {
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

        console.log("=== API RESPONSE ===");
        console.log("Full response:", response);
        console.log("Response data:", response.data);
        console.log("Response data.data:", response.data.data);

        // Handle different response structures
        const productData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        console.log("Product data after processing:", productData);

        // Filter products to only include those with status "New"
        const newProducts = productData.filter(
          (product) => product.status === "New"
        );

        console.log("New products after filtering:", newProducts);
        console.log("Sample product structure:", newProducts[0]);

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

  // Test if image URL is accessible
  const testImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Get product image (handle array format)
  const getProductImage = (product) => {
    console.log("=== DEBUG getProductImage ===");
    console.log("Product name:", product.name);
    console.log("Product image data:", product.image);
    console.log("Product image type:", typeof product.image);
    console.log("Is array:", Array.isArray(product.image));

    if (product.image) {
      if (Array.isArray(product.image) && product.image.length > 0) {
        const firstImage = product.image[0];
        console.log("First image from array:", firstImage);

        // Check if URL is valid
        if (firstImage && firstImage.trim() !== "") {
          // If it's a relative URL, make it absolute
          if (firstImage.startsWith("/") || firstImage.startsWith("./")) {
            const baseUrl = "http://localhost:4000";
            const fullUrl = firstImage.startsWith("/")
              ? `${baseUrl}${firstImage}`
              : `${baseUrl}/${firstImage.replace("./", "")}`;
            console.log("Converted relative URL to:", fullUrl);
            return fullUrl;
          }

          // If it's already a full URL (http/https), use it directly
          if (
            firstImage.startsWith("http://") ||
            firstImage.startsWith("https://")
          ) {
            console.log("Returning absolute URL:", firstImage);
            return firstImage;
          }

          // If it's a Cloudinary URL or other image service, use it directly
          if (
            firstImage.includes("cloudinary.com") ||
            firstImage.includes("res.cloudinary.com") ||
            firstImage.includes("imgur.com") ||
            firstImage.includes("unsplash.com")
          ) {
            console.log("Returning image service URL:", firstImage);
            return firstImage;
          }

          console.log("Returning image URL:", firstImage);
          return firstImage;
        }
      } else if (typeof product.image === "string") {
        console.log("Using image as string:", product.image);

        if (product.image.trim() !== "") {
          // If it's a relative URL, make it absolute
          if (product.image.startsWith("/") || product.image.startsWith("./")) {
            const baseUrl = "http://localhost:4000";
            const fullUrl = product.image.startsWith("/")
              ? `${baseUrl}${product.image}`
              : `${baseUrl}/${product.image.replace("./", "")}`;
            console.log("Converted relative URL to:", fullUrl);
            return fullUrl;
          }

          // If it's already a full URL (http/https), use it directly
          if (
            product.image.startsWith("http://") ||
            product.image.startsWith("https://")
          ) {
            console.log("Returning absolute URL:", product.image);
            return product.image;
          }

          // If it's a Cloudinary URL or other image service, use it directly
          if (
            product.image.includes("cloudinary.com") ||
            product.image.includes("res.cloudinary.com") ||
            product.image.includes("imgur.com") ||
            product.image.includes("unsplash.com")
          ) {
            console.log("Returning image service URL:", product.image);
            return product.image;
          }

          console.log("Returning image URL:", product.image);
          return product.image;
        }
      }
    }
    // Fallback image
    console.log("Using fallback image:", backUpImg);
    return backUpImg;
  };

  // Handle image load error
  const handleImageError = (e) => {
    console.log("=== IMAGE ERROR ===");
    console.log("Failed to load image:", e.target.src);
    console.log("Product name:", e.target.alt);
    console.log("Setting fallback to:", backUpImg);

    // Prevent infinite loop
    if (e.target.src === backUpImg) {
      console.log("Already using fallback image, not changing");
      return;
    }

    e.target.src = backUpImg;
    e.target.alt = "product placeholder";
    e.target.onerror = null; // Prevent infinite loop
  };

  // Filter products by category/brand for tabs (only from new products)
  const allProducts = products;
  const fushimavinaProducts = products.filter(
    (product) => product.brand === "Fushimavina"
  );
  const ababaProducts = products.filter((product) => product.brand === "ABABA");

  // Hide component on error or if no products
  if (error || products.length === 0) {
    return (
      <section className="py-5">
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-md-12">
              <div className="text-center">
                <h3 className="fw-bold mb-3">Các sản phẩm mới</h3>
                {error ? (
                  <div className="alert alert-warning" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div
                      className="text-muted mb-3"
                      style={{ fontSize: "3rem" }}
                    >
                      📦
                    </div>
                    <h5 className="text-muted">Chưa có sản phẩm mới</h5>
                    <p className="text-muted">Vui lòng quay lại sau</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
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
            onLoad={() =>
              console.log(
                "Image loaded successfully:",
                product.name,
                "URL:",
                getProductImage(product)
              )
            }
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
            onClick={() => handleAddToCart(product.id)}
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
      <div className="container-fluid px-4">
        <div className="row">
          <div className="col-md-12">
            <div className="bootstrap-tabs product-tabs">
              <div className="tabs-header d-flex justify-content-between border-bottom mb-4 pb-3">
                <h3 className="fw-bold mb-0">Các sản phẩm mới</h3>
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

export default BestSellingCarousel;
