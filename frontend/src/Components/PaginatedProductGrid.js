import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Pagination, Spinner, Form, Button } from 'react-bootstrap';
import { useProductContext } from '../context/ProductContext';
import FavoriteButton from './FavoriteButton';
import { formatVND, calculateDiscountedPrice } from '../utils/currencyFormatter';

const backUpImg = "/images/frigde.png";

const PaginatedProductGrid = ({ 
  title = "Sản phẩm", 
  filterCriteria = {}, 
  itemsPerPage = 12,
  showFilters = true,
  showPagination = true
}) => {
  const navigate = useNavigate();
  const { loading, error, getFilteredProducts, getUniqueBrands, getUniqueCategories } = useProductContext();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [localFilters, setLocalFilters] = useState(filterCriteria);

  // Get filtered products
  const filteredProducts = useMemo(() => {
    return getFilteredProducts(localFilters);
  }, [getFilteredProducts, localFilters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return sorted;
  }, [filteredProducts, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Giữ nguyên vị trí scroll
  };

  // Handle product click
  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/productView/${productId}`);
  };

  // Get product image
  const getProductImage = (product) => {
    if (Array.isArray(product.image) && product.image.length > 0) {
      return product.image[0];
    } else if (typeof product.image === 'string') {
      return product.image;
    }
    return backUpImg;
  };

  // Handle image load error
  const handleImageError = (e) => {
    e.target.src = backUpImg;
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Clear filters
  const clearFilters = () => {
    setLocalFilters({});
    setCurrentPage(1);
  };

  // Render product item
  const renderProductItem = (product) => (
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
          <FavoriteButton
            productId={product._id}
            className="position-absolute top-0 end-0 m-2 z-index-2"
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
  );

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <Pagination.Item
          key={1}
          onClick={() => handlePageChange(1)}
        >
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pages.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      pages.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    pages.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>{pages}</Pagination>
      </div>
    );
  };

  // Render filters
  const renderFilters = () => {
    if (!showFilters) return null;

    const brands = getUniqueBrands();
    const categories = getUniqueCategories();

    return (
      <div className="mb-4 p-3 bg-light rounded">
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Thương hiệu</Form.Label>
              <Form.Select
                value={localFilters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value || null)}
              >
                <option value="">Tất cả</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Danh mục</Form.Label>
              <Form.Select
                value={localFilters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || null)}
              >
                <option value="">Tất cả</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Sắp xếp theo</Form.Label>
              <Form.Select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button variant="outline-secondary" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </div>
    );
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

  if (filteredProducts.length === 0) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-info">
          <h5>Không tìm thấy sản phẩm</h5>
          <p>Không có sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
          <Button variant="primary" onClick={clearFilters}>
            Xóa bộ lọc
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">{title}</h2>
          <span className="text-muted">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} trong tổng số {sortedProducts.length} sản phẩm
          </span>
        </div>

        {renderFilters()}

        <Row>
          {currentProducts.map(renderProductItem)}
        </Row>

        {showPagination && renderPagination()}
      </Container>
    </section>
  );
};

export default PaginatedProductGrid; 