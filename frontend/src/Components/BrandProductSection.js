import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Tabs, Tab, Pagination, Spinner } from 'react-bootstrap';
import { useProductContext } from '../context/ProductContext';
import PaginatedProductGrid from './PaginatedProductGrid';
import { formatVND, calculateDiscountedPrice } from '../utils/currencyFormatter';

const BrandProductSection = () => {
  const { loading, error, getUniqueBrands, getProductsByBrand } = useProductContext();
  const [activeBrand, setActiveBrand] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const brands = useMemo(() => {
    const uniqueBrands = getUniqueBrands();
    return ['All', ...uniqueBrands];
  }, [getUniqueBrands]);

  // Get products for current brand
  const currentProducts = useMemo(() => {
    if (activeBrand === 'All') {
      return []; // Will be handled by PaginatedProductGrid
    }
    return getProductsByBrand(activeBrand);
  }, [activeBrand, getProductsByBrand]);

  // Calculate pagination for current brand
  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = currentProducts.slice(startIndex, endIndex);

  const handleBrandChange = (brand) => {
    setActiveBrand(brand);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Giữ nguyên vị trí scroll
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Đang tải sản phẩm...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger">
          <h5>Lỗi khi tải sản phẩm</h5>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  if (brands.length <= 1) {
    return null; // No brands to display
  }

  return (
    <section className="py-5">
      <Container>
        <h2 className="fw-bold text-center mb-4">Sản phẩm theo thương hiệu</h2>
        
        <Tabs
          activeKey={activeBrand}
          onSelect={(k) => handleBrandChange(k)}
          className="mb-4 justify-content-center"
          variant="pills"
        >
          {brands.map((brand) => (
            <Tab key={brand} eventKey={brand} title={brand}>
              <div className="mt-4">
                {activeBrand === 'All' ? (
                  <PaginatedProductGrid
                    title="Tất cả sản phẩm"
                    filterCriteria={{}}
                    itemsPerPage={itemsPerPage}
                    showFilters={false}
                    showPagination={true}
                  />
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="fw-bold">{brand}</h3>
                      <span className="text-muted">
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, currentProducts.length)} trong tổng số {currentProducts.length} sản phẩm
                      </span>
                    </div>
                    
                    {currentProducts.length === 0 ? (
                      <div className="text-center py-5">
                        <div className="alert alert-info">
                          <h5>Không có sản phẩm</h5>
                          <p>Không có sản phẩm nào cho thương hiệu {brand}.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Row>
                          {paginatedProducts.map((product) => (
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
                                  <div
                                    className="card-img-top"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      window.scrollTo(0, 0);
                                      window.location.href = `/productView/${product.id}`;
                                    }}
                                  >
                                    <img
                                      src={Array.isArray(product.image) && product.image.length > 0 ? product.image[0] : "/images/frigde.png"}
                                      className="img-fluid rounded-top"
                                      alt={product.name}
                                      onError={(e) => { e.target.src = "/images/frigde.png"; }}
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
                                      onClick={() => {
                                        window.scrollTo(0, 0);
                                        window.location.href = `/productView/${product.id}`;
                                      }}
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
                      </>
                    )}
                  </div>
                )}
              </div>
            </Tab>
          ))}
        </Tabs>
      </Container>
    </section>
  );
};

export default BrandProductSection; 