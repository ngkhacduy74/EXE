// Format tiền Việt Nam
export const formatVND = (amount) => {
  if (!amount && amount !== 0) return 'Liên hệ';
  if (amount === 0) return 'Liên hệ';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format tiền Việt Nam với dấu phẩy ngăn cách
export const formatVNDSimple = (amount) => {
  if (!amount && amount !== 0) return 'Liên hệ';
  if (amount === 0) return 'Liên hệ';
  
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
};

// Tính giá sau khi giảm giá
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return originalPrice;
  return originalPrice * (1 - discountPercent / 100);
}; 