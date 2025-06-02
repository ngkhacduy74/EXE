import React from 'react';

const bannerContainerStyle = {
  display: 'flex',
  justifyContent: 'center', // Optional: centers the image
  alignItems: 'center', // Optional: vertically centers if needed
};

const BannerSection2 = () => (
  <div style={bannerContainerStyle}>
    <img
      src="../images/Banner.jpg"
      alt="logo"
      style={{ width: '200px', height: 'auto', marginBottom: '16px' }} // Increased width
    />
  </div>
);

export default BannerSection2;