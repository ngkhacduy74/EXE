# Hướng Dẫn Khắc Phục Dashboard

## Vấn đề: "Không Có Dữ Liệu: Không thể lấy dữ liệu từ cơ sở dữ liệu"

### 🔍 Khắc Phục Từng Bước

#### 1. Kiểm Tra Backend Server
```bash
# Đảm bảo backend đang chạy
cd backend
npm start

# Kiểm tra nếu server khởi động không có lỗi
# Nên thấy: "Server running on port 4000"
```

#### 2. Kiểm Tra Kết Nối MongoDB
```bash
# Xác minh MongoDB đang chạy
# Kiểm tra console backend cho thông báo kết nối MongoDB
# Nên thấy: "MongoDB connected successfully" hoặc tương tự
```

#### 3. Kiểm Tra Xác Thực
- Đảm bảo bạn đã đăng nhập với quyền Admin
- Kiểm tra browser console (F12) cho logs xác thực
- Tìm các message như:
  - ❌ Không có access token
  - 🔄 Token hết hạn, đang thử làm mới
  - ❌ Truy cập bị từ chối - người dùng có thể không phải admin

#### 4. Kiểm Tra Dữ Liệu Database
```bash
# Kết nối MongoDB và kiểm tra collections
# Bạn cần ít nhất:
# - 1 user với role "Admin"
# - Tùy chọn: posts, products, banners cho thống kê đầy đủ
```

#### 5. Test API Endpoints
```bash
# Chạy script test
node test-dashboard-api.js

# Script này sẽ test:
# - Kết nối server
# - Yêu cầu xác thực
# - Khả năng truy cập API endpoint
```

### 🚨 Vấn Đề Thường Gặp & Giải Pháp

#### Vấn đề 1: Backend Server Không Chạy
**Triệu chứng**: Lỗi network trong browser console
**Giải pháp**: 
```bash
cd backend
npm install
npm start
```

#### Vấn đề 2: MongoDB Không Kết Nối
**Triệu chứng**: Backend khởi động nhưng hiển thị lỗi kết nối MongoDB
**Giải pháp**:
- Kiểm tra service MongoDB đang chạy
- Xác minh connection string trong file `.env`
- Kiểm tra kết nối mạng đến MongoDB

#### Vấn đề 3: Xác Thực Thất Bại
**Triệu chứng**: Lỗi 401 hoặc 403 trong console
**Giải pháp**:
- Đăng xuất và đăng nhập lại
- Đảm bảo user có role "Admin"
- Kiểm tra token hết hạn

#### Vấn đề 4: Không Có Dữ Liệu Trong Database
**Triệu chứng**: API trả về thành công nhưng tất cả counts là 0
**Giải pháp**:
- Tạo test data trong database
- Đăng ký admin user mới
- Tạo một số posts, products, banners

### 📊 Debug Browser Console

Mở browser console (F12) và tìm các message này:

#### ✅ Messages Thành Công
```
🔍 Đang lấy dữ liệu dashboard từ API...
📡 Trạng thái API Response: 200
✅ Dữ liệu API Response: {success: true, data: {...}}
✅ Đang sử dụng dữ liệu thực từ API
```

#### ❌ Messages Lỗi
```
❌ Không có access token
❌ Token hết hạn, đang thử làm mới
❌ Truy cập bị từ chối - người dùng có thể không phải admin
❌ Lỗi API Response: [chi tiết lỗi]
❌ Lỗi khi lấy dữ liệu dashboard: [chi tiết lỗi]
```

### 🛠️ Sửa Lỗi Nhanh

#### Sửa 1: Khởi Động Lại Tất Cả
```bash
# 1. Dừng tất cả servers
# 2. Khởi động MongoDB
# 3. Khởi động backend
cd backend && npm start
# 4. Khởi động frontend
cd frontend && npm start
# 5. Xóa cache browser và reload
```

#### Sửa 2: Tạo Test Data
```bash
# 1. Đăng ký user mới qua frontend
# 2. Cập nhật user role thành "Admin" trong database
# 3. Tạo một số test posts, products, banners
# 4. Đăng nhập với tài khoản admin
```

#### Sửa 3: Kiểm Tra Environment Variables
```bash
# Backend .env nên có:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
REFRESH_TOKEN=your_refresh_token_secret
```

### 📋 Checklist

- [ ] Backend server chạy trên port 4000
- [ ] MongoDB kết nối và truy cập được
- [ ] User đăng nhập với role Admin
- [ ] Token xác thực hợp lệ
- [ ] Ít nhất 1 user trong database
- [ ] Không có lỗi CORS trong console
- [ ] API endpoints phản hồi đúng

### 🔧 Debug Nâng Cao

#### Kiểm Tra Network Tab
1. Mở browser DevTools
2. Vào tab Network
3. Refresh trang dashboard
4. Tìm request `/api/dashboard/stats`
5. Kiểm tra request headers và response

#### Kiểm Tra Backend Logs
```bash
# Backend console nên hiển thị:
📊 Dashboard stats requested by user: admin@example.com
📈 Counts: { totalUsers: 1, totalPosts: 0, totalProducts: 0, totalBanners: 0 }
👥 User stats: { activeUsers: 1, todayNewUsers: 0 }
✅ Dashboard stats calculated successfully
```

#### Test API Thủ Công
```bash
# Sử dụng curl (thay TOKEN bằng token thực)
curl -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:4000/dashboard/stats
```

### 📞 Vẫn Có Vấn Đề?

Nếu bạn vẫn gặp vấn đề:

1. **Kiểm tra tất cả console logs** (browser + backend)
2. **Xác minh kết nối database** và dữ liệu
3. **Test API endpoints** thủ công
4. **Kiểm tra kết nối mạng**
5. **Xác minh cấu hình environment**

Dashboard được thiết kế để chỉ hiển thị dữ liệu thật, vì vậy hãy đảm bảo bạn có dữ liệu thực trong database để thấy thống kê có ý nghĩa.

### 🆕 Tính Năng Mới

Dashboard đã được cập nhật với:
- **Giao diện tiếng Việt** hoàn toàn
- **Thống kê mới**: User mới hôm nay, Lượt xem hôm nay
- **Layout cải tiến**: 6 cards thống kê chính
- **Debug section**: Hướng dẫn khắc phục chi tiết
- **Real-time updates**: Cập nhật dữ liệu mỗi 30 giây 