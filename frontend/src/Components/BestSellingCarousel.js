import React, { useEffect, useState } from 'react';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductItem = ({ image, title, discount }) => {
  const [quantity, setQuantity] = useState(1);

  const handlePlus = () => setQuantity(q => q + 1);
  const handleMinus = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <div className="swiper-slide product-item">
      {discount && (
        <span className="badge bg-success position-absolute m-3">
          {discount}
        </span>
      )}
      <a href="#" className="btn-wishlist">
        <svg width="24" height="24">
          <use href="#heart" />
        </svg>
      </a>
      <figure>
        <a href="/" title={title}>
          <img src={image} className="tab-image" alt={title} />
        </a>
      </figure>
      <h3>{title}</h3>
      <span className="qty">1 Unit</span>
      <span className="rating">
        <svg width="24" height="24" className="text-primary">
          <use href="#star-solid" />
        </svg>{' '}
        4.5
      </span>
      <span className="price">$18.00</span>
       <div className="d-flex align-items-center justify-content-between">
       <div className="input-group product-qty" >
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
                                id="quantity"
                                name="quantity"
                                className="form-control input-number"
                                value={quantity}
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
        <a href="#" className="nav-link">
          Add to Cart <iconify-icon icon="uil:shopping-cart" />
        </a>
      </div>
    </div>
  );
};

const BestSellingCarousel = () => {
  useEffect(() => {
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
  }, []);

  const products = [
    { image: '/images/thumb-tomatoes.png', title: 'Fresh Tomatoes', discount: '-15%' },
    { image: '/images/thumb-tomatoketchup.png', title: 'Tomato Ketchup', discount: '-15%' },
    { image: '/images/thumb-orange-juice.png', title: 'Orange Juice', discount: '-15%' },
    { image: '/images/thumb-cucumber.png', title: 'Cucumber', discount: '-15%' },
    { image: '/images/thumb-broccoli.png', title: 'Broccoli', discount: '-15%' },
    { image: '/images/thumb-vegetable.png', title: 'Vegetable', discount: '-15%' },
    { image: '/images/thumb-vegetable-juice.png', title: 'Vegetable Juice', discount: '-15%' },
    { image: '/images/thumb-vegetables.png', title: 'Vegetables', discount: '-15%' },
    { image: '/images/thumb-potato.png', title: 'Potato', discount: '-15%' },
    { image: '/images/thumb-cabbage.png', title: 'Cabbage', discount: '-15%' },
  ];

  return (
    <section className="py-5 overflow-hidden">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="section-header d-flex flex-wrap justify-content-between my-5">
              <h2 className="section-title">Best Selling Products</h2>
              <div className="d-flex align-items-center">
                <a href="#" className="btn-link text-decoration-none">
                  View All Categories →
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
                {products.map((product, index) => (
                  <ProductItem key={index} {...product} />
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
