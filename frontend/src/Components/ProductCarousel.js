import React, { useEffect } from 'react';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductsCarousel = () => {
  useEffect(() => {
    // Initialize Swiper for each tab pane
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
  }, []);

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
                      <div className="swiper-slide">
                        <div className="product-item">
                          <span className="badge bg-success position-absolute m-3">
                            -30%
                          </span>
                          <a href="#" className="btn-wishlist">
                            <svg width="24" height="24">
                              <use href="#heart" />
                            </svg>
                          </a>
                          <figure>
                            <a href="/" title="Product Title">
                              <img
                                src="/images/thumb-bananas.png"
                                className="tab-image"
                                alt="Product"
                              />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span>
                          <span className="rating">
                            <svg width="24" height="24" className="text-primary">
                              <use href="#star-solid" />
                            </svg>{' '}
                            4.5
                          </span>
                          <span className="price">$18.00</span>
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
                                id="quantity"
                                name="quantity"
                                className="form-control input-number"
                                value="1"
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
                            <a href="#" className="nav-link">
                              Add to Cart{' '}
                              <iconify-icon icon="uil:shopping-cart" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Repeat for other products */}
                      <div className="swiper-slide">
                        <div className="product-item">
                          <span className="badge bg-success position-absolute m-3">
                            -30%
                          </span>
                          <a href="#" className="btn-wishlist">
                            <svg width="24" height="24">
                              <use href="#heart" />
                            </svg>
                          </a>
                          <figure>
                            <a href="/" title="Product Title">
                              <img
                                src="/images/thumb-biscuits.png"
                                className="tab-image"
                                alt="Product"
                              />
                            </a>
                          </figure>
                          <h3>Sunstar Fresh Melon Juice</h3>
                          <span className="qty">1 Unit</span>
                          <span className="rating">
                            <svg width="24" height="24" className="text-primary">
                              <use href="#star-solid" />
                            </svg>{' '}
                            4.5
                          </span>
                          <span className="price">$18.00</span>
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
                                id="quantity"
                                name="quantity"
                                className="form-control input-number"
                                value="1"
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
                            <a href="#" className="nav-link">
                              Add to Cart{' '}
                              <iconify-icon icon="uil:shopping-cart" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Add remaining products similarly */}
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
                      {/* Add fruit/vege products as swiper-slide */}
                      <div className="swiper-slide">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist">
                            <svg width="24" height="24">
                              <use href="#heart" />
                            </svg>
                          </a>
                          <figure>
                            <a href="/" title="Product Title">
                              <img
                                src="/images/thumb-cucumber.png"
                                className="tab-image"
                                alt="Product"
                              />
                            </a>
                          </figure>
                          <h3>Fresh Cucumber</h3>
                          <span className="qty">1 Unit</span>
                          <span className="rating">
                            <svg width="24" height="24" className="text-primary">
                              <use href="#star-solid" />
                            </svg>{' '}
                            4.5
                          </span>
                          <span className="price">$18.00</span>
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
                                id="quantity"
                                name="quantity"
                                className="form-control input-number"
                                value="1"
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
                            <a href="#" className="nav-link">
                              Add to Cart{' '}
                              <iconify-icon icon="uil:shopping-cart" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Add more fruit/vege products */}
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
                      {/* Add juice products as swiper-slide */}
                      <div className="swiper-slide">
                        <div className="product-item">
                          <a href="#" className="btn-wishlist">
                            <svg width="24" height="24">
                              <use href="#heart" />
                            </svg>
                          </a>
                          <figure>
                            <a href="/" title="Product Title">
                              <img
                                src="../images/thumb-milk.png"
                                className="tab-image"
                                alt="Product"
                              />
                            </a>
                          </figure>
                          <h3>Fresh Milk</h3>
                          <span className="qty">1 Unit</span>
                          <span className="rating">
                            <svg width="24" height="24" className="text-primary">
                              <use href="#star-solid" />
                            </svg>{' '}
                            4.5
                          </span>
                          <span className="price">$18.00</span>
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
                                id="quantity"
                                name="quantity"
                                className="form-control input-number"
                                value="1"
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
                            <a href="#" className="nav-link">
                              Add to Cart{' '}
                              <iconify-icon icon="uil:shopping-cart" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Add more juice products */}
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