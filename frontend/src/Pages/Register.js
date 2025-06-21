import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [gender, setGender] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [canClose, setCanClose] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const modalContentRef = useRef(null);
  const navigate = useNavigate();
  // Terms of Service content
  const termsContent = `
ĐIỀU KHOẢN DỊCH VỤ VINSAKY

1. GIỚI THIỆU
Chào mừng bạn đến với Vinsaky! Khi bạn đăng ký và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản này.

2. ĐĂNG KÝ TÀI KHOẢN
- Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký
- Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình
- Một địa chỉ email chỉ được đăng ký một tài khoản duy nhất
- Bạn phải từ 18 tuổi trở lên để đăng ký tài khoản

3. SỬ DỤNG DỊCH VỤ
- Không được sử dụng dịch vụ cho mục đích bất hợp pháp
- Không được spam, quấy rối hoặc làm phiền người dùng khác
- Tuân thủ các quy định của pháp luật Việt Nam
- Không được chia sẻ tài khoản cho người khác sử dụng

4. QUYỀN VÀ NGHĨA VỤ
- Chúng tôi có quyền tạm khóa hoặc xóa tài khoản vi phạm
- Chúng tôi có quyền thay đổi điều khoản dịch vụ với thông báo trước
- Người dùng có quyền hủy tài khoản bất cứ lúc nào
- Báo cáo kịp thời nếu phát hiện vi phạm bảo mật

5. CHÍNH SÁCH BẢO MẬT
- Thông tin cá nhân được bảo vệ theo chính sách riêng tư
- Chúng tôi không chia sẻ thông tin với bên thứ ba không có sự đồng ý
- Dữ liệu được mã hóa và lưu trữ an toàn

6. CHÍNH SÁCH HOÀN TIỀN
- Hoàn tiền trong vòng 7 ngày nếu không hài lòng
- Phí dịch vụ có thể được khấu trừ tùy theo trường hợp
- Quy trình hoàn tiền từ 3-5 ngày làm việc

7. LIÊN HỆ HỖ TRỢ
- Email: support@vinsaky.com
- Hotline: 1900-xxxx (24/7)
- Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM

8. ĐIỀU KHOẢN CUỐI
Bằng việc đăng ký tài khoản, bạn xác nhận đã đọc, hiểu và đồng ý với tất cả các điều khoản trên.
  `;

  // Privacy Policy content
  const policyContent = `
CHÍNH SÁCH BẢO MẬT VINSAKY

1. THU THẬP THÔNG TIN
Chúng tôi thu thập các thông tin sau khi bạn đăng ký:
- Thông tin cá nhân: Họ tên, email, số điện thoại
- Thông tin tài khoản: Mật khẩu, ảnh đại diện
- Thông tin sử dụng: Lịch sử hoạt động, thời gian truy cập

2. MỤC ĐÍCH SỬ DỤNG
- Tạo và quản lý tài khoản người dùng
- Cung cấp dịch vụ và hỗ trợ khách hàng
- Gửi thông báo quan trọng về dịch vụ
- Cải thiện chất lượng dịch vụ

3. BẢO VỆ THÔNG TIN
- Sử dụng mã hóa SSL để bảo vệ dữ liệu truyền tải
- Lưu trữ mật khẩu dưới dạng đã mã hóa
- Kiểm soát truy cập nghiêm ngặt đối với dữ liệu người dùng
- Sao lưu dữ liệu định kỳ để tránh mất mát

4. CHIA SẺ THÔNG TIN
Chúng tôi KHÔNG chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi:
- Có sự đồng ý rõ ràng từ bạn
- Theo yêu cầu của cơ quan pháp luật
- Để bảo vệ quyền lợi của chúng tôi và người dùng khác

5. QUYỀN CỦA NGƯỜI DÙNG
- Yêu cầu xem thông tin cá nhân được lưu trữ
- Yêu cầu sửa đổi hoặc xóa thông tin cá nhân
- Từ chối nhận email marketing
- Hủy tài khoản và xóa dữ liệu

6. COOKIE VÀ CÔNG NGHỆ THEO DÕI
- Sử dụng cookie để cải thiện trải nghiệm người dùng
- Theo dõi hoạt động để phân tích và cải thiện dịch vụ
- Bạn có thể tắt cookie trong trình duyệt

7. THAY ĐỔI CHÍNH SÁCH
- Chúng tôi có thể cập nhật chính sách này
- Thông báo trước ít nhất 30 ngày khi có thay đổi quan trọng
- Phiên bản mới nhất luôn được đăng tại website

8. LIÊN HỆ
Nếu có thắc mắc về chính sách bảo mật, liên hệ:
Email: privacy@vinsaky.com
  `;



  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Vui lòng chọn file ảnh");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Số điện thoại phải đúng 10 chữ số!");
      return;
    }

    if (!termsAccepted) {
      alert("Bạn phải đồng ý với điều khoản sử dụng!");
      return;
    }

    if (password !== repeatPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('password', password);
      formData.append('gender', gender);
      
      // Add image file if selected
      if (imageFile) {
        formData.append('ava_img_url', imageFile);
      }

      // Get API base URL from environment variable
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
      
      console.log('🔄 Đang đăng ký với API:', `${API_BASE_URL}/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: formData, // Use FormData for file upload
        // Don't set Content-Type header, let browser set it with boundary for FormData
      });

      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Đăng ký thành công:', data);
        
        if (data.success) {
          alert('🎉 Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
          navigate('/login');
        } else {
          alert(data.message || 'Đăng ký thất bại, vui lòng thử lại.');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Đăng ký thất bại:', errorData);
        alert(errorData.message || `Đăng ký thất bại (${response.status}). Vui lòng thử lại.`);
      }
    } catch (error) {
      console.error('❌ Lỗi khi đăng ký:', error);
      alert('Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setCanClose(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setCanClose(false);
  };

  const handleScroll = () => {
    if (modalContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = modalContentRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setCanClose(isAtBottom);
    }
  };

  useEffect(() => {
    if (showModal && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
      setCanClose(false);
    }
  }, [showModal]);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .register-container {
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 2rem 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .register-wrapper {
          max-width: 64rem;
          margin: 0 auto;
        }

        .register-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .register-header {
          background: linear-gradient(to right, #eff6ff, #faf5ff);
          padding: 2rem;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .register-icon {
          width: 4rem;
          height: 4rem;
          background-color: #dbeafe;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .register-icon svg {
          width: 2rem;
          height: 2rem;
          color: #2563eb;
        }

        .register-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem;
        }

        .register-subtitle {
          color: #6b7280;
          margin: 0;
        }

        .register-form {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-grid-full {
          grid-column: 1 / -1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          background-color: white;
          transition: all 0.2s;
        }

        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
        }

        .password-toggle svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .avatar-section {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .avatar-preview {
          flex-shrink: 0;
          width: 6rem;
          height: 6rem;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #e5e7eb;
        }

        .avatar-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 6rem;
          height: 6rem;
          background-color: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-placeholder svg {
          width: 2rem;
          height: 2rem;
          color: #9ca3af;
        }

        .avatar-upload {
          flex: 1;
        }

        .avatar-help {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .terms-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .terms-checkbox input {
          margin-top: 0.25rem;
          width: 1rem;
          height: 1rem;
          accent-color: #3b82f6;
        }

        .terms-text {
          font-size: 0.875rem;
          color: #374151;
        }

        .terms-link {
          color: #3b82f6;
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
          font-size: inherit;
          padding: 0;
        }

        .terms-link:hover {
          color: #1d4ed8;
        }

        .submit-button {
          width: 100%;
          background-color: #3b82f6;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s;
          margin-top: 1.5rem;
        }

        .submit-button:hover {
          background-color: #2563eb;
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-link {
          text-align: center;
          margin-top: 1.5rem;
        }

        .login-link span {
          color: #6b7280;
        }

        .login-link button {
          color: #3b82f6;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-size: inherit;
          text-decoration: none;
        }

        .login-link button:hover {
          color: #1d4ed8;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 0.75rem;
          max-width: 42rem;
          width: 100%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .modal-text {
          white-space: pre-line;
          color: #374151;
          line-height: 1.6;
        }

        .scroll-notice {
          text-align: center;
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: #eff6ff;
          border-radius: 0.5rem;
        }

        .scroll-notice-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #3b82f6;
        }

        .scroll-notice svg {
          width: 1rem;
          height: 1rem;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-10px);
          }
          70% {
            transform: translateY(-5px);
          }
          90% {
            transform: translateY(-2px);
          }
        }

        .scroll-notice-text {
          font-size: 0.875rem;
        }

        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .modal-button {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .modal-button-enabled {
          background-color: #3b82f6;
          color: white;
        }

        .modal-button-enabled:hover {
          background-color: #2563eb;
        }

        .modal-button-disabled {
          background-color: #d1d5db;
          color: #6b7280;
          cursor: not-allowed;
        }
      `}</style>

      <div className="register-container">
        <div className="register-wrapper">
          <div className="register-card">
            {/* Header */}
            <div className="register-header">
              <div className="register-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="register-title">Tạo tài khoản mới</h1>
              <p className="register-subtitle">Gia nhập cộng đồng Vinsaky ngay hôm nay!</p>
            </div>

            {/* Form */}
            <div className="register-form">
              <div>
                {/* Personal Information */}
                <div className="form-section">
                  <h3 className="section-title">Thông tin cá nhân</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Nhập họ và tên"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="0123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Giới tính *
                      </label>
                      <select
                        className="form-select"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Nhập địa chỉ của bạn"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="form-section">
                  <h3 className="section-title">Bảo mật</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Mật khẩu *
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-input"
                          placeholder="Ít nhất 6 ký tự"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Nhập lại mật khẩu *
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          type={showRepeatPassword ? "text" : "password"}
                          className="form-input"
                          placeholder="Nhập lại mật khẩu"
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        >
                          {showRepeatPassword ? (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div className="form-section">
                  <h3 className="section-title">Ảnh đại diện</h3>
                  <div className="avatar-section">
                    <div>
                      {imagePreview ? (
                        <div className="avatar-preview">
                          <img
                            src={imagePreview}
                            alt="Preview"
                          />
                        </div>
                      ) : (
                        <div className="avatar-placeholder">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="avatar-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleChangeFile}
                        className="form-input"
                      />
                      <p className="avatar-help">
                        Chọn ảnh JPG, PNG. Kích thước tối đa 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="form-section terms-section">
                  <div className="terms-checkbox">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                    />
                    <label htmlFor="terms" className="terms-text">
                      Tôi đồng ý với{" "}
                      <button
                        type="button"
                        className="terms-link"
                        onClick={() => openModal("terms")}
                      >
                        Điều khoản dịch vụ
                      </button>
                      {" "}và{" "}
                      <button
                        type="button"
                        className="terms-link"
                        onClick={() => openModal("policy")}
                      >
                        Chính sách bảo mật
                      </button>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </button>

                {/* Login Link */}
                <div className="login-link">
                  <span>Đã có tài khoản? </span>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">
                  {modalType === "terms" ? "Điều khoản dịch vụ" : "Chính sách bảo mật"}
                </h3>
              </div>
              
              <div
                ref={modalContentRef}
                onScroll={handleScroll}
                className="modal-body"
              >
                <div className="modal-text">
                  {modalType === "terms" ? termsContent : policyContent}
                </div>
                
                {!canClose && (
                  <div className="scroll-notice">
                    <div className="scroll-notice-content">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="scroll-notice-text">Vui lòng lướt xuống cuối để tiếp tục</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                <button
                  onClick={closeModal}
                  disabled={!canClose}
                  className={`modal-button ${
                    canClose ? "modal-button-enabled" : "modal-button-disabled"
                  }`}
                >
                  Tôi đã hiểu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Register;