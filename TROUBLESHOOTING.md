# 🔧 Hướng dẫn khắc phục vấn đề kết nối Backend-Frontend

## 🚨 Vấn đề thường gặp

### 1. Backend và Frontend không liên kết được

**Nguyên nhân:**
- CORS configuration sai
- Port mismatch
- Thiếu file .env
- API service không đúng

**Giải pháp:**

#### Bước 1: Tạo file .env

**Backend (.env):**
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/exe_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_BACKEND_API=http://localhost:4000
REACT_APP_ENV=development
```

#### Bước 2: Cài đặt dependencies

```bash
# Cài đặt tất cả dependencies
npm run install-all

# Hoặc cài từng phần
npm install
cd backend && npm install
cd ../frontend && npm install
```

#### Bước 3: Khởi động ứng dụng

```bash
# Cách 1: Sử dụng script tự động
npm run dev

# Cách 2: Khởi động riêng biệt
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

#### Bước 4: Kiểm tra kết nối

```bash
npm run test-connection
```

## 🔍 Kiểm tra lỗi

### 1. Kiểm tra ports
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :4000

# Linux/Mac
lsof -i :3000
lsof -i :4000
```

### 2. Kiểm tra logs
- Backend: Xem console log khi chạy `npm start` trong thư mục backend
- Frontend: Xem console log khi chạy `npm start` trong thư mục frontend

### 3. Kiểm tra Network tab
- Mở Developer Tools (F12)
- Vào tab Network
- Thực hiện một action trên frontend
- Xem có request nào bị lỗi không

## 🛠️ Các thay đổi đã thực hiện

### Backend (index.js)
- ✅ Sửa CORS để cho phép localhost:3000
- ✅ Thêm các HTTP methods cần thiết
- ✅ Cấu hình credentials

### Frontend (package.json)
- ✅ Sửa proxy từ port 8080 sang 4000

### Frontend (setupProxy.js)
- ✅ Cấu hình proxy đúng target
- ✅ Thêm pathRewrite để xử lý /api prefix

### Frontend (api.service.js)
- ✅ Tạo axios instance với base URL đúng
- ✅ Thêm interceptors cho authentication
- ✅ Tạo các API functions hoàn chỉnh

## 🚀 Scripts có sẵn

```bash
npm run start          # Khởi động cả backend và frontend
npm run server         # Chỉ khởi động backend
npm run client         # Chỉ khởi động frontend
npm run dev            # Khởi động với delay
npm run test-connection # Kiểm tra kết nối
npm run install-all    # Cài đặt tất cả dependencies
```

## 📞 Nếu vẫn gặp vấn đề

1. **Xóa node_modules và cài lại:**
```bash
rm -rf node_modules package-lock.json
cd backend && rm -rf node_modules package-lock.json
cd ../frontend && rm -rf node_modules package-lock.json
npm run install-all
```

2. **Kiểm tra firewall:**
- Đảm bảo ports 3000 và 4000 không bị chặn

3. **Kiểm tra antivirus:**
- Một số antivirus có thể chặn localhost connections

4. **Restart terminal/IDE:**
- Đôi khi cần restart để áp dụng thay đổi

## 🎯 Kết quả mong đợi

Sau khi thực hiện các bước trên:
- Backend chạy trên http://localhost:4000
- Frontend chạy trên http://localhost:3000
- Frontend có thể gọi API từ backend
- Không có lỗi CORS trong console 