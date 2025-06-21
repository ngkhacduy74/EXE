# Changelog - Hệ thống Authentication

## [1.0.0] - 2024-01-XX

### Thêm mới
- **Hệ thống authentication tự động**: Tự động xử lý token hết hạn và refresh
- **Custom hook useAuth**: Quản lý authentication state một cách nhất quán
- **authApiClient**: Axios instance với interceptors để xử lý token tự động
- **Token refresh tự động**: Tự động refresh token khi nhận được lỗi 401
- **Auto logout**: Tự động logout và redirect khi token không thể refresh

### Cập nhật
- **Profile.js**: Sử dụng hook useAuth và authApiClient
- **NewPost.js**: Sử dụng hook useAuth và authApiClient
- **ProductView.js**: Sử dụng authApiClient thay vì axios trực tiếp
- **ProductBrowser.js**: Sử dụng authApiClient thay vì axios trực tiếp
- **CompareProduct.js**: Sử dụng authApiClient thay vì axios trực tiếp
- **Login.js**: Sử dụng authApiClient thay vì axios trực tiếp
- **OTP.js**: Sử dụng authApiClient thay vì các API calls riêng lẻ
- **Header.js**: Sử dụng hook useAuth thay vì logic authentication riêng

### Cải thiện
- **Trải nghiệm người dùng**: User không bị gián đoạn khi token hết hạn
- **Bảo mật**: Tự động logout khi token không thể refresh
- **Nhất quán**: Tất cả các trang User đều sử dụng cùng một cơ chế
- **Dễ bảo trì**: Logic authentication tập trung tại một nơi

### Sửa lỗi
- **Token hết hạn**: Không còn lỗi khi token hết hạn
- **Authentication check**: Cải thiện việc kiểm tra authentication
- **Error handling**: Xử lý lỗi tốt hơn khi token không hợp lệ

## Luồng xử lý mới

### Trước đây:
1. User thực hiện action
2. API call với token cũ
3. Server trả về lỗi 401
4. User phải login lại thủ công

### Bây giờ:
1. User thực hiện action
2. authApiClient gửi request với token hiện tại
3. Server trả về lỗi 401 (token hết hạn)
4. authApiClient tự động thử refresh token
5. Nếu refresh thành công: Retry request với token mới
6. Nếu refresh thất bại: Tự động logout và redirect về login

## Cách sử dụng

### Trong component:
```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, loading, handleLogout } = useAuth();
  // ...
}
```

### Cho API calls:
```javascript
import { authApiClient } from '../Services/auth.service';

const response = await authApiClient.get('/api/endpoint');
```

## Lưu ý
- Hệ thống chỉ áp dụng cho các trang User
- Các trang Admin vẫn sử dụng logic cũ
- Token access: 30 phút, Refresh token: 30 ngày 