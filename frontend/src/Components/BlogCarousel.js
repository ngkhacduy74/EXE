
import React, { useEffect } from 'react';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const BlogCarousel = () => {
  useEffect(() => {
    // Initialize Swiper
    new Swiper('.blog-carousel', {
      modules: [Navigation],
      slidesPerView: 3,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: '.blog-carousel-next',
        prevEl: '.blog-carousel-prev',
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        991: { slidesPerView: 3 },
      },
    });
  }, []);

  const BlogPost = ({ image, date, category, title, excerpt }) => (
    <article className="post-item card border-0 shadow-sm p-3">
      <div className="image-holder zoom-effect">
        <a href="#">
          <img src={image} alt="post" className="card-img-top" />
        </a>
      </div>
      <div className="card-body">
        <div className="post-meta d-flex text-uppercase gap-3 my-2 align-items-center">
          <div className="meta-date">
            <svg width="16" height="16">
              <use href="#calendar" />
            </svg>{' '}
            {date}
          </div>
          <div className="meta-categories">
            <svg width="16" height="16">
              <use href="#category" />
            </svg>{' '}
            {category}
          </div>
        </div>
        <div className="post-header">
          <h3 className="post-title">
            <a href="#" className="text-decoration-none">
              {title}
            </a>
          </h3>
          <p>{excerpt}</p>
        </div>
      </div>
    </article>
  );

  return (
    <section id="latest-blog" className="py-5 overflow-hidden">
      <div className="container-fluid">
        <div className="row">
          <div className="section-header d-flex align-items-center justify-content-between my-5">
            <h2 className="section-title">Our Recent Blog</h2>
            <div className="btn-wrap align-right">
              <a href="#" className="d-flex align-items-center nav-link">
                Read All Articles{' '}
                <svg width="24" height="24">
                  <use href="#arrow-right" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="blog-carousel swiper">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <BlogPost
                    image="/images/post-thumb-1.jpg"
                    date="22 Aug 2021"
                    category="tips & tricks"
                    title="Top 10 casual look ideas to dress up your kids"
                    excerpt="Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi..."
                  />
                </div>
                <div className="swiper-slide">
                  <BlogPost
                    image="/images/post-thumb-2.jpg"
                    date="25 Aug 2021"
                    category="trending"
                    title="Latest trends of wearing street wears supremely"
                    excerpt="Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi..."
                  />
                </div>
                <div className="swiper-slide">
                  <BlogPost
                    image="/images/post-thumb-3.jpg"
                    date="28 Aug 2021"
                    category="inspiration"
                    title="10 Different Types of comfortable clothes ideas for women"
                    excerpt="Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi..."
                  />
                </div>
              </div>
              <div className="swiper-buttons d-flex justify-content-center mt-3">
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
    </section>
  );
};

export default BlogCarousel;
