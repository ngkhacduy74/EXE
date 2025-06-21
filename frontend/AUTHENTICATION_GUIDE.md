# Hướng dẫn sử dụng hệ thống Authentication

## Tổng quan

Hệ thống authentication mới đã được cập nhật để xử lý token hết hạn một cách tự động và nhất quán trên tất cả các trang User. Khi token hết hạn, hệ thống sẽ tự động:

1. Thử refresh token
2. Nếu refresh thành công, tiếp tục thực hiện request
3. Nếu refresh thất bại, tự động logout và chuyển về trang login

## Các file đã được cập nhật

### 1. `src/Services/auth.service.js`
- Tạo axios instance với interceptors để xử lý token tự động
- Tự động thêm token vào header của mọi request
- Tự động xử lý token refresh khi nhận được lỗi 401
- Tự động logout và redirect khi token không thể refresh

### 2. `src/hooks/useAuth.js`
- Custom hook để quản lý authentication state
- Tự động kiểm tra và validate token khi component mount
- Cung cấp các utility functions cho authentication

### 3. Các trang User đã được cập nhật:
- `src/Pages/Profile.js`
- `src/Pages/NewPost.js`
- `src/Pages/ProductView.js`
- `src/Pages/ProductBrowser.js`
- `src/Pages/CompareProduct.js`
- `src/Pages/Login.js`
- `src/Pages/OTP.js`
- `src/Components/Header.js`

## Cách sử dụng

### 1. Sử dụng hook useAuth trong component

```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, loading, handleLogout, refreshUser } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### 2. Sử dụng authApiClient cho API calls

```javascript
import { authApiClient } from '../Services/auth.service';

// Thay vì sử dụng axios trực tiếp
const response = await authApiClient.get('/api/endpoint');

// authApiClient sẽ tự động:
// - Thêm token vào header
// - Xử lý token refresh nếu cần
// - Tự động logout nếu token không thể refresh
```

### 3. Các utility functions có sẵn

```javascript
import { 
  isAuthenticated, 
  getCurrentUser, 
  logout, 
  validateToken 
} from '../Services/auth.service';

// Kiểm tra user đã đăng nhập chưa
if (isAuthenticated()) {
  // User đã đăng nhập
}

// Lấy thông tin user hiện tại
const user = getCurrentUser();

// Logout thủ công
logout();

// Validate token với server
const { isValid, user } = await validateToken();
```

## Luồng xử lý token hết hạn

1. **User thực hiện action** (ví dụ: load trang, gọi API)
2. **authApiClient gửi request** với token hiện tại
3. **Server trả về lỗi 401** (token hết hạn)
4. **authApiClient tự động thử refresh token**
5. **Nếu refresh thành công:**
   - Lưu token mới vào localStorage
   - Retry request ban đầu với token mới
6. **Nếu refresh thất bại:**
   - Xóa tất cả token và user data
   - Hiển thị thông báo "Phiên đăng nhập hết hạn"
   - Redirect về trang login

## Lợi ích

1. **Tự động xử lý**: Không cần xử lý token hết hạn thủ công trong từng component
2. **Trải nghiệm người dùng tốt hơn**: User không bị gián đoạn khi token hết hạn
3. **Bảo mật**: Tự động logout khi token không thể refresh
4. **Nhất quán**: Tất cả các trang User đều sử dụng cùng một cơ chế
5. **Dễ bảo trì**: Logic authentication tập trung tại một nơi

## Lưu ý

- Hệ thống chỉ áp dụng cho các trang User, các trang Admin vẫn sử dụng logic cũ
- Token access có thời hạn 30 phút, refresh token có thời hạn 30 ngày
- Khi logout, tất cả token và user data sẽ được xóa khỏi localStorage
- Hệ thống sẽ hiển thị thông báo cho user khi token hết hạn

## Troubleshooting

### Nếu gặp lỗi "Token không hợp lệ"
1. Kiểm tra xem token có tồn tại trong localStorage không
2. Kiểm tra xem refresh token có tồn tại không
3. Thử logout và login lại

### Nếu gặp lỗi "Phiên đăng nhập hết hạn"
1. Đây là hành vi bình thường khi token không thể refresh
2. User cần login lại để tiếp tục sử dụng

### Nếu gặp lỗi network
1. Kiểm tra kết nối internet
2. Kiểm tra xem backend có hoạt động không
3. Thử refresh trang 