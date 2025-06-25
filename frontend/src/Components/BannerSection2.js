import React, { useState, useEffect } from 'react';

const BannerSection2 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Banner data - replace with your actual image paths
  const banners = [
    {
      id: 1,
      src: "../images/Banner.png",
      alt: "Banner 1"
    },
    {
      id: 2,
      src: "../images/Banner.png", 
      alt: "Banner 2"
    },
    {
      id: 3,
      src: "../images/Banner.png",
      alt: "Banner 3"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(slideInterval);
  }, [banners.length]);

  // Manual navigation functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  // Responsive CSS
  const responsiveCSS = `
    @media (max-width: 1024px) {
      .banner-container {
        max-width: 95% !important;
        border-radius: 12px !important;
        padding: 3px !important;
      }
      .banner-wrapper {
        height: 350px !important;
        border-radius: 10px !important;
      }
      .nav-button {
        width: 45px !important;
        height: 45px !important;
      }
      .nav-arrow {
        width: 18px !important;
        height: 18px !important;
      }
    }
    @media (max-width: 768px) {
      .banner-container {
        max-width: 98% !important;
        border-radius: 10px !important;
        padding: 2px !important;
      }
      .banner-wrapper {
        height: 300px !important;
        border-radius: 8px !important;
      }
      .nav-button {
        width: 40px !important;
        height: 40px !important;
        left: 10px !important;
        right: 10px !important;
      }
      .nav-arrow {
        width: 16px !important;
        height: 16px !important;
      }
      .dots-container {
        bottom: 15px !important;
        gap: 8px !important;
      }
      .dot {
        width: 10px !important;
        height: 10px !important;
        border-radius: 5px !important;
      }
      .dot.active {
        width: 20px !important;
      }
    }
    @media (max-width: 480px) {
      .banner-container {
        max-width: 100% !important;
        border-radius: 8px !important;
        padding: 1px !important;
        margin: 0 10px !important;
      }
      .banner-wrapper {
        height: 250px !important;
        border-radius: 6px !important;
      }
      .nav-button {
        width: 35px !important;
        height: 35px !important;
        left: 8px !important;
        right: 8px !important;
      }
      .nav-arrow {
        width: 14px !important;
        height: 14px !important;
      }
      .dots-container {
        bottom: 10px !important;
        gap: 6px !important;
      }
      .dot {
        width: 8px !important;
        height: 8px !important;
        border-radius: 4px !important;
      }
      .dot.active {
        width: 16px !important;
      }
    }
    @media (max-width: 320px) {
      .banner-wrapper {
        height: 200px !important;
      }
      .nav-button {
        width: 30px !important;
        height: 30px !important;
        left: 5px !important;
        right: 5px !important;
      }
      .nav-arrow {
        width: 12px !important;
        height: 12px !important;
      }
    }
  `;

  // Custom styles
  const bannerContainerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto',
    overflow: 'hidden',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
    background: 'linear-gradient(45deg, #f0f0f0, #ffffff)',
    padding: '4px',
  };

  const bannerWrapperStyle = {
    position: 'relative',
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#000',
  };

  const slidesContainerStyle = {
    display: 'flex',
    width: `${banners.length * 100}%`,
    height: '100%',
    transform: `translateX(-${(currentSlide * 100) / banners.length}%)`,
    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  const slideStyle = {
    width: `${100 / banners.length}%`,
    height: '100%',
    position: 'relative',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  };

  const navButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  };

  const prevButtonStyle = {
    ...navButtonStyle,
    left: '20px',
  };

  const nextButtonStyle = {
    ...navButtonStyle,
    right: '20px',
  };

  const dotsContainerStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    zIndex: 10,
  };

  const dotStyle = (isActive) => ({
    width: isActive ? '24px' : '12px',
    height: '12px',
    borderRadius: '6px',
    backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
  });

  const arrowStyle = {
    width: '20px',
    height: '20px',
    fill: '#333',
  };

  return (
    <>
      <style>{responsiveCSS}</style>
      <div style={bannerContainerStyle} className="banner-container">
        <div style={bannerWrapperStyle} className="banner-wrapper">
          {/* Slides Container */}
          <div style={slidesContainerStyle}>
            {banners.map((banner, index) => (
              <div key={banner.id} style={slideStyle}>
                <img
                  src={banner.src}
                  alt={banner.alt}
                  style={imageStyle}
                />
                <div 
                  style={overlayStyle}
                  onMouseEnter={(e) => e.target.style.opacity = '1'}
                  onMouseLeave={(e) => e.target.style.opacity = '0'}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            style={prevButtonStyle}
            className="nav-button"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
            aria-label="Previous banner"
          >
            <svg style={arrowStyle} className="nav-arrow" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>

          <button
            onClick={goToNext}
            style={nextButtonStyle}
            className="nav-button"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
            aria-label="Next banner"
          >
            <svg style={arrowStyle} className="nav-arrow" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>

          {/* Dot Indicators */}
          <div style={dotsContainerStyle} className="dots-container">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={dotStyle(index === currentSlide)}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onMouseEnter={(e) => {
                  if (index !== currentSlide) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentSlide) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                  }
                }}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerSection2;