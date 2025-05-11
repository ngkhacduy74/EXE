import React, { useEffect } from 'react';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const BrandCarousel = () => {
  useEffect(() => {
    // Initialize Swiper
    new Swiper('.brand-carousel', {
      modules: [Navigation],
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: '.brand-carousel-next',
        prevEl: '.brand-carousel-prev',
      },
      breakpoints: {
        0: { slidesPerView: 2 },
        768: { slidesPerView: 2 },
        991: { slidesPerView: 3 },
        1500: { slidesPerView: 4 },
      },
    });
  }, []);

  return (
    <section className="py-5 overflow-hidden">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="section-header d-flex flex-wrap justify-content-between mb-5">
              <h2 className="section-title">Newly Arrived Brands</h2>
              <div className="d-flex align-items-center">
                <a href="#" className="btn-link text-decoration-none">
                  View All Categories →
                </a>
                <div className="swiper-buttons">
                  <button className="swiper-prev brand-carousel-prev btn btn-yellow">
                    ❮
                  </button>
                  <button className="swiper-next brand-carousel-next btn btn-yellow">
                    ❯
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="brand-carousel swiper">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="card mb-3 p-3 rounded-4 shadow border-0">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src="/images/product-thumb-11.jpg"
                          className="img-fluid rounded"
                          alt="Card title"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body py-0">
                          <p className="text-muted mb-0">Oh my Brand granny</p>
                          <h5 className="card-title">
                            Granny eassy to see
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card mb-3 p-3 rounded-4 shadow border-0">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src="/images/product-thumb-12.jpg"
                          className="img-fluid rounded"
                          alt="Card title"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body py-0">
                          <p className="text-muted mb-0">Them uong nuoc giai khat</p>
                          <h5 className="card-title">
                            Ma thieu vinsaky
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card mb-3 p-3 rounded-4 shadow border-0">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src="/images/product-thumb-13.jpg"
                          className="img-fluid rounded"
                          alt="Card title"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body py-0">
                          <p className="text-muted mb-0">Skibidi toliet</p>
                          <h5 className="card-title">
                            Hinh anh mang tinh chat minh hoa
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card mb-3 p-3 rounded-4 shadow border-0">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src="/images/product-thumb-14.jpg"
                          className="img-fluid rounded"
                          alt="Card title"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body py-0">
                          <p className="text-muted mb-0">Amber Jar</p>
                          <h5 className="card-title">
                            Honey best nectar you wish to get
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card mb-3 p-3 rounded-4 shadow border-0">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src="/images/product-thumb-11.jpg"
                          className="img-fluid rounded"
                          alt="Card title"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body py-0">
                          <p className="text-muted mb-0">Amber Jar</p>
                          <h5 className="card-title">
                            Honey best nectar you wish to get
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card mb-3 p-3 rounded-4 shadow border-0">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src="/images/product-thumb-12.jpg"
                          className="img-fluid rounded"
                          alt="Card title"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body py-0">
                          <p className="text-muted mb-0">Amber Jar</p>
                          <h5 className="card-title">
                            Honey best nectar you wish to get
                          </h5>
                        </div>
                      </div>
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

export default BrandCarousel;