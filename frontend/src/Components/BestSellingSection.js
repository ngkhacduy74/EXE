import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Pagination, Spinner } from 'react-bootstrap';
import { useProductContext } from '../context/ProductContext';
import FavoriteButton from './FavoriteButton';
import { formatVND, calculateDiscountedPrice } from '../utils/currencyFormatter';

const backUpImg = "/images/frigde.png";

const BestSellingSection = () => {
  const { loading, error, allProducts } = useProductContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Simulate best selling products (you can modify this logic based on your needs)
  const bestSellingProducts = useMemo(() => {
    // For now, we'll show products with discount as "best selling"
    // In a real app, you might want to track sales data
    return allProducts
      .filter(product => product.discount && product.discount > 0)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, 20); // Limit to top 20
  }, [allProducts]);

  // Calculate pagination
  const totalPages = Math.ceil(bestSellingProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = bestSellingProducts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Giữ nguyên vị trí scroll
  };

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    window.location.href = `/productView/${productId}`;
  };

  const getProductImage = (product) => {
    if (Array.isArray(product.image) && product.image.length > 0) {
      return product.image[0];
    } else if (typeof product.image === 'string') {
      return product.image;
    }
    return backUpImg;
  };

  const handleImageError = (e) => {
    e.target.src = backUpImg;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Đang tải sản phẩm bán chạy...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger">
          <h5>Lỗi khi tải sản phẩm bán chạy</h5>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  if (bestSellingProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Sản phẩm bán chạy</h2>
          <span className="text-muted">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, bestSellingProducts.length)} trong tổng số {bestSellingProducts.length} sản phẩm
          </span>
        </div>

        <Row>
          {currentProducts.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
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
                    <span className="badge bg-success position-absolute top-0 start-0 m-2 z-index-1">
                      -{product.discount}%
                    </span>
                  )}
                  <span className="badge bg-danger position-absolute top-0 end-0 m-2 z-index-2">
                    Bán chạy
                  </span>
                  <FavoriteButton
                    productId={product._id}
                    className="position-absolute top-0 end-0 m-2 z-index-3"
                    style={{ top: '2.5rem' }}
                  />
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
                      <span className="text-warning me-1 fs-7">★★★★★</span>
                      <small className="text-muted">(5.0)</small>
                    </div>
                                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                      <div>
                                        {product.price === 0 ? (
                                          <span className="fw-bold text-primary">Liên hệ</span>
                                        ) : product.discount ? (
                                          <div>
                                            <span className="text-decoration-line-through text-muted me-2">
                                              {formatVND(product.price)}
                                            </span>
                                            <span className="fw-bold text-danger">
                                              {formatVND(calculateDiscountedPrice(product.price, product.discount))}
                                            </span>
                                          </div>
                                        ) : (
                                          <span className="fw-bold">{formatVND(product.price)}</span>
                                        )}
                                      </div>
                                      <span className="badge bg-primary">{product.status}</span>
                                    </div>
                  </div>

                  <div className="mt-auto">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleProductClick(product.id)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Pagination.Item>
              ))}
              
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        )}
      </Container>
    </section>
  );
};

export default BestSellingSection; 