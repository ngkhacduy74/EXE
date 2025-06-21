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

## 🚨 Lỗi Thường Gặp và Cách Khắc Phục

### **1. Chart.js Filler Plugin Error**
```
Tried to use the 'fill' option without the 'Filler' plugin enabled
```

**Nguyên nhân:** Chart.js cần Filler plugin để sử dụng fill option trong Line charts.

**Cách khắc phục:**
```javascript
import { Filler } from "chart.js";
ChartJS.register(Filler);
```

### **2. API Response Error - HTML thay vì JSON**
```
SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

**Nguyên nhân:** Backend trả về HTML error page thay vì JSON response.

**Cách khắc phục:**
1. Kiểm tra backend có đang chạy không: `cd backend && npm start`
2. Kiểm tra port backend (mặc định 4000)
3. Cập nhật API URL trong frontend: `http://localhost:4000/api/dashboard/...`
4. Thêm error handling middleware trong backend

### **3. Google Analytics 4 Không Hoạt Động**

**Kiểm tra:**
1. Console logs có hiển thị GA4 messages không
2. Network tab có requests đến googletagmanager.com không
3. GA4 script có được load trong index.html không

**Cách khắc phục:**
```bash
# Chạy test script
node test-ga4-integration.js

# Kiểm tra manual
# 1. Open browser console
# 2. Look for: "✅ GA4 đã được khởi tạo toàn cục"
# 3. Check Network tab for GA4 requests
```

### **4. Backend API Connection Issues**

**Test backend API:**
```bash
node test-backend-api.js
```

**Kiểm tra:**
1. MongoDB connection
2. Backend server port (4000)
3. CORS configuration
4. Route configuration

### **5. Authentication Issues**

**Lỗi 401/403:**
1. Kiểm tra token có hợp lệ không
2. Token có expired không
3. User có quyền admin không

**Cách khắc phục:**
```javascript
// Refresh token
const refreshAccessToken = async () => {
  // Implementation
};
```

## 🧪 Testing Scripts

### **Test GA4 Integration:**
```bash
node test-ga4-integration.js
```

### **Test Backend API:**
```bash
node test-backend-api.js
```

### **Test Database Connection:**
```bash
node test-connection.js
```

## 📋 Checklist Troubleshooting

### **Frontend Issues:**
- [ ] React app đang chạy trên port 3000
- [ ] Console không có JavaScript errors
- [ ] Network requests thành công
- [ ] GA4 script được load

### **Backend Issues:**
- [ ] Backend server đang chạy trên port 4000
- [ ] MongoDB connected
- [ ] API routes được configure đúng
- [ ] CORS enabled
- [ ] Authentication middleware working

### **Database Issues:**
- [ ] MongoDB service running
- [ ] Connection string đúng
- [ ] Collections tồn tại
- [ ] Data có trong database

## 🔍 Debug Steps

### **1. Check Console Logs**
```javascript
// Frontend console
console.log("🔍 Debug info:", data);

// Backend console
console.log("📡 API request:", req.url);
```

### **2. Check Network Tab**
- Look for failed requests
- Check response status codes
- Verify request headers

### **3. Check Database**
```javascript
// MongoDB queries
db.users.find().count()
db.posts.find().count()
db.products.find().count()
```

### **4. Test API Endpoints**
```bash
# Test with curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:4000/api/dashboard/stats
```

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề:
1. Chạy tất cả test scripts
2. Kiểm tra console logs
3. Verify network requests
4. Check database connection
5. Contact support với logs và error messages 