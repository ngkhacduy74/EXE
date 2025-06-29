# Tính năng Sản phẩm Yêu thích

## Tổng quan

Tính năng sản phẩm yêu thích cho phép người dùng lưu trữ và quản lý các sản phẩm mà họ quan tâm. Người dùng có thể thêm/xóa sản phẩm khỏi danh sách yêu thích bằng cách nhấn vào icon trái tim.

## Backend

### Model

- **File**: `backend/Model/favorite.model.js`
- **Schema**: Lưu trữ userId, productId, thời gian thêm
- **Index**: Đảm bảo mỗi user chỉ có thể lưu một sản phẩm một lần

### Controller

- **File**: `backend/Controller/favorite.controller.js`
- **Các chức năng**:
  - `addToFavorites`: Thêm sản phẩm vào danh sách yêu thích
  - `removeFromFavorites`: Xóa sản phẩm khỏi danh sách yêu thích
  - `getFavorites`: Lấy danh sách sản phẩm yêu thích (có phân trang)
  - `checkFavorite`: Kiểm tra sản phẩm có trong danh sách yêu thích không
  - `clearAllFavorites`: Xóa tất cả sản phẩm yêu thích

### Routes

- **File**: `backend/Router/favorite.route.js`
- **Endpoints**:
  - `POST /favorite/add` - Thêm sản phẩm yêu thích
  - `DELETE /favorite/remove/:productId` - Xóa sản phẩm yêu thích
  - `GET /favorite/list` - Lấy danh sách yêu thích
  - `GET /favorite/check/:productId` - Kiểm tra trạng thái yêu thích
  - `DELETE /favorite/clear` - Xóa tất cả

## Frontend

### Service

- **File**: `frontend/src/Services/favorite.service.js`
- **Chức năng**: Gọi API để tương tác với backend

### Hook

- **File**: `frontend/src/hooks/useFavorite.js`
- **Chức năng**: Quản lý trạng thái yêu thích cho từng sản phẩm

### Component

- **File**: `frontend/src/Components/FavoriteButton.js`
- **Chức năng**: Hiển thị nút trái tim với animation
- **Props**:
  - `productId`: ID của sản phẩm
  - `className`: CSS class tùy chỉnh

### CSS

- **File**: `frontend/src/Components/FavoriteButton.css`
- **Tính năng**:
  - Animation trái tim đập
  - Responsive design
  - Các variant kích thước khác nhau

### Trang Favorites

- **File**: `frontend/src/Pages/Favorites.js`
- **Chức năng**: Hiển thị danh sách sản phẩm yêu thích
- **Tính năng**:
  - Phân trang
  - Xóa từng sản phẩm
  - Xóa tất cả
  - Điều hướng đến trang chi tiết sản phẩm

## Cách sử dụng

### 1. Thêm FavoriteButton vào component hiển thị sản phẩm

```jsx
import FavoriteButton from "../Components/FavoriteButton";

// Trong component render
<FavoriteButton
  productId={product.id}
  className="position-absolute top-0 end-0 m-2 z-index-1"
/>;
```

### 2. Sử dụng hook useFavorite

```jsx
import { useFavorite } from "../hooks/useFavorite";

const { isFavorite, loading, toggleFavorite } = useFavorite(productId);
```

### 3. Truy cập trang Favorites

- URL: `/favorites`
- Menu: Header > User dropdown > "Sản phẩm yêu thích"

## Tính năng đã tích hợp

### 1. ProductCarousel

- Icon trái tim ở góc trên bên phải của mỗi sản phẩm

### 2. BestSellingCarousel

- Icon trái tim ở góc trên bên phải của mỗi sản phẩm

### 3. BrandCarousel

- Icon trái tim ở góc trên bên phải của mỗi sản phẩm

### 4. ProductBrowser

- Icon trái tim ở góc trên bên phải của mỗi sản phẩm

### 5. ProductView

- Nút yêu thích bên cạnh nút "Liên hệ"

### 6. Header

- Link đến trang Favorites trong dropdown menu

## Bảo mật

- Tất cả API đều yêu cầu authentication
- Chỉ user đã đăng nhập mới có thể sử dụng tính năng
- Mỗi user chỉ có thể thao tác với dữ liệu của mình

## Responsive

- Tự động điều chỉnh kích thước trên mobile
- Animation mượt mà trên tất cả thiết bị
- UI thân thiện với touch screen
