import React from 'react';

const PhoneFixed = () => {
  const styles = {
    phoneFixed: {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#ffffff',
      color: '#333',
      padding: '12px 24px',
      borderRadius: '30px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      border: '1px solid #ddd',
      zIndex: 1000,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      // Mobile styles
      '@media (max-width: 768px)': {
        bottom: '15px',
        padding: '10px 20px',
        fontSize: '14px',
        borderRadius: '25px',
        gap: '8px'
      },
      '@media (max-width: 480px)': {
        bottom: '10px',
        padding: '8px 16px',
        fontSize: '12px',
        borderRadius: '20px',
        gap: '6px',
        left: '20px',
        right: '20px',
        transform: 'none',
        justifyContent: 'center'
      }
    },
    phoneIcon: {
      fontSize: '18px',
      '@media (max-width: 768px)': {
        fontSize: '16px'
      },
      '@media (max-width: 480px)': {
        fontSize: '14px'
      }
    }
  };

  const handleMouseEnter = (e) => {
    const isMobile = window.innerWidth <= 480;
    if (isMobile) {
      e.currentTarget.style.transform = 'scale(1.05)';
    } else {
      e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
    }
    e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.25)';
  };

  const handleMouseLeave = (e) => {
    const isMobile = window.innerWidth <= 480;
    if (isMobile) {
      e.currentTarget.style.transform = 'scale(1)';
    } else {
      e.currentTarget.style.transform = 'translateX(-50%)';
    }
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  };

  // CSS for responsive styles
  const responsiveCSS = `
    @media (max-width: 768px) {
      .phone-fixed {
        bottom: 15px !important;
        padding: 10px 20px !important;
        font-size: 14px !important;
        border-radius: 25px !important;
        gap: 8px !important;
      }
      .phone-icon {
        font-size: 16px !important;
      }
    }
    @media (max-width: 480px) {
      .phone-fixed {
        bottom: 10px !important;
        padding: 8px 16px !important;
        font-size: 12px !important;
        border-radius: 20px !important;
        gap: 6px !important;
        left: 20px !important;
        right: 20px !important;
        transform: none !important;
        justify-content: center !important;
      }
      .phone-icon {
        font-size: 14px !important;
      }
    }
  `;

  return (
    <>
      <style>{responsiveCSS}</style>
      <div
        className="phone-fixed"
        style={styles.phoneFixed}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => window.open('tel:0909123456')}
      >
        <span className="phone-icon" style={styles.phoneIcon}>📞</span>
        <span>Hotline: 0903 242 748</span>
      </div>
    </>
  );
};

export default PhoneFixed;
