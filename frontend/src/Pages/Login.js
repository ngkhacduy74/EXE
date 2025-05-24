import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "terms" hoặc "policy"
  const [canClose, setCanClose] = useState(false);
  const navigate = useNavigate();
  const modalContentRef = useRef(null);

  // Nội dung điều khoản dịch vụ
  const termsContent = `
    ĐIỀU KHOẢN DỊCH VỤ VINSAKY

    1. GIỚI THIỆU
    Chào mừng bạn đến với Vinsaky. Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.

    2. ĐỊNH NGHĨA
    - "Dịch vụ" có nghĩa là tất cả các sản phẩm, dịch vụ và tính năng được cung cấp bởi Vinsaky
    - "Người dùng" là bất kỳ cá nhân hoặc tổ chức nào sử dụng dịch vụ của chúng tôi
    - "Tài khoản" là tài khoản được tạo để truy cập vào dịch vụ

    3. ĐĂNG KÝ TÀI KHOẢN
    - Người dùng phải cung cấp thông tin chính xác và đầy đủ khi đăng ký
    - Người dùng chịu trách nhiệm bảo mật thông tin đăng nhập
    - Một người chỉ được tạo một tài khoản duy nhất

    4. SỬ DỤNG DỊCH VỤ
    - Người dùng cam kết sử dụng dịch vụ một cách hợp pháp
    - Không được sử dụng dịch vụ cho mục đích bất hợp pháp
    - Không được can thiệp vào hoạt động bình thường của hệ thống

    5. QUYỀN VÀ TRÁCH NHIỆM
    Quyền của người dùng:
    - Được sử dụng đầy đủ các tính năng của dịch vụ
    - Được hỗ trợ kỹ thuật khi gặp vấn đề
    - Được bảo mật thông tin cá nhân

    Trách nhiệm của người dùng:
    - Tuân thủ các quy định của dịch vụ
    - Cập nhật thông tin tài khoản khi có thay đổi
    - Thông báo kịp thời khi phát hiện lỗi bảo mật

    6. CHÍNH SÁCH THANH TOÁN
    - Tất cả giao dịch thanh toán phải được thực hiện qua các phương thức được chấp nhận
    - Phí dịch vụ có thể thay đổi theo thông báo trước
    - Không hoàn trả trong các trường hợp đặc biệt được nêu rõ

    7. BẢO MẬT THÔNG TIN
    - Chúng tôi cam kết bảo mật thông tin cá nhân của người dùng
    - Thông tin chỉ được sử dụng cho mục đích cung cấp dịch vụ
    - Không chia sẻ thông tin với bên thứ ba không được phép

    8. GIỚI HẠN TRÁCH NHIỆM
    - Vinsaky không chịu trách nhiệm cho các thiệt hại gián tiếp
    - Trách nhiệm bồi thường tối đa bằng giá trị dịch vụ đã thanh toán
    - Không bảo đảm dịch vụ hoạt động liên tục 100%

    9. CHẤM DỨT DỊCH VỤ
    - Người dùng có thể hủy tài khoản bất kỳ lúc nào
    - Vinsaky có quyền tạm ngưng/chấm dứt tài khoản vi phạm
    - Dữ liệu có thể được xóa sau khi chấm dứt dịch vụ

    10. THAY ĐỔI ĐIỀU KHOẢN
    - Điều khoản có thể được cập nhật định kỳ
    - Người dùng sẽ được thông báo trước khi có thay đổi quan trọng
    - Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận điều khoản mới

    11. LUẬT ÁP DỤNG
    - Điều khoản này được điều chỉnh bởi pháp luật Việt Nam
    - Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền

    12. LIÊN HỆ
    Nếu có bất kỳ câu hỏi nào về điều khoản này, vui lòng liên hệ:
    - Email: support@vinsaky.com
    - Điện thoại: 1900-xxxx
    - Địa chỉ: [Địa chỉ công ty]

    Điều khoản này có hiệu lực từ ngày [Ngày] và được cập nhật lần cuối vào [Ngày cập nhật].
  `;

  // Nội dung chính sách khách hàng
  const policyContent = `
    CHÍNH SÁCH KHÁCH HÀNG VINSAKY

    1. CAM KẾT CỦA CHÚNG TÔI
    Vinsaky cam kết mang đến trải nghiệm tốt nhất cho khách hàng thông qua dịch vụ chất lượng cao và hỗ trợ tận tình.

    2. QUYỀN LỢI KHÁCH HÀNG
    - Được tư vấn miễn phí về sản phẩm/dịch vụ
    - Được hỗ trợ kỹ thuật 24/7
    - Được bảo hành sản phẩm theo quy định
    - Được hoàn tiền trong trường hợp không hài lòng (áp dụng điều kiện)
    - Được bảo mật thông tin cá nhân tuyệt đối

    3. CHÍNH SÁCH HỖ TRỢ KHÁCH HÀNG
    Thời gian hỗ trợ:
    - Trực tuyến: 24/7
    - Điện thoại: 8:00 - 22:00 hàng ngày
    - Email: Phản hồi trong vòng 24h

    Kênh hỗ trợ:
    - Chat trực tuyến trên website
    - Hotline: 1900-xxxx
    - Email: support@vinsaky.com
    - Fanpage Facebook

    4. CHÍNH SÁCH KHIẾU NẠI
    Quy trình xử lý khiếu nại:
    - Tiếp nhận khiếu nại trong vòng 24h
    - Phản hồi sơ bộ trong vòng 48h
    - Giải quyết hoàn tất trong vòng 7 ngày làm việc
    - Thông báo kết quả xử lý cho khách hàng

    Cách thức khiếu nại:
    - Gọi hotline trực tiếp
    - Gửi email chi tiết vấn đề
    - Gửi form khiếu nại trên website
    - Tin nhắn qua fanpage

    5. CHÍNH SÁCH BẢO HÀNH
    Thời gian bảo hành:
    - Sản phẩm phần mềm: 12 tháng
    - Dịch vụ tư vấn: 6 tháng
    - Dịch vụ kỹ thuật: 3 tháng

    Điều kiện bảo hành:
    - Sản phẩm còn trong thời hạn bảo hành
    - Lỗi do nhà sản xuất, không do người dùng
    - Còn hóa đơn/chứng từ mua hàng

    6. CHÍNH SÁCH HOÀN TIỀN
    Điều kiện hoàn tiền:
    - Yêu cầu trong vòng 30 ngày sau khi mua
    - Sản phẩm chưa được sử dụng quá 70%
    - Có lý do chính đáng và bằng chứng rõ ràng

    Quy trình hoàn tiền:
    - Gửi yêu cầu qua email hoặc hotline
    - Cung cấp thông tin tài khoản ngân hàng
    - Xử lý hoàn tiền trong 7-14 ngày làm việc

    7. CHÍNH SÁCH BẢO MẬT
    Thông tin được bảo mật:
    - Thông tin cá nhân (họ tên, địa chỉ, số điện thoại)
    - Thông tin tài khoản ngân hàng
    - Lịch sử giao dịch
    - Dữ liệu sử dụng dịch vụ

    Cam kết bảo mật:
    - Không chia sẻ thông tin với bên thứ ba
    - Sử dụng công nghệ mã hóa hiện đại
    - Thường xuyên cập nhật hệ thống bảo mật
    - Đào tạo nhân viên về bảo mật thông tin

    8. CHÍNH SÁCH TÍCH ĐIỂM VÀ ƯU ĐÃI
    Chương trình tích điểm:
    - Tích 1 điểm cho mỗi 10,000 VNĐ chi tiêu
    - Điểm tích lũy có thể đổi quà hoặc giảm giá
    - Điểm có hiệu lực trong 12 tháng

    Ưu đãi thành viên:
    - Thành viên mới: Giảm 10% đơn hàng đầu tiên
    - Thành viên VIP: Giảm 15% tất cả dịch vụ
    - Sinh nhật: Voucher giảm giá 20%

    9. CHÍNH SÁCH CẬP NHẬT
    - Chính sách có thể được cập nhật để phù hợp với quy định pháp luật
    - Khách hàng sẽ được thông báo trước 30 ngày khi có thay đổi
    - Thay đổi có hiệu lực sau khi đăng tải công khai

    10. PHẢN HỒI VÀ ĐÁNH GIÁ
    Chúng tôi luôn lắng nghe ý kiến khách hàng:
    - Khảo sát định kỳ về chất lượng dịch vụ
    - Tiếp nhận góp ý qua nhiều kênh
    - Cải thiện liên tục dựa trên phản hồi
    - Tri ân khách hàng có đóng góp tích cực

    Liên hệ để được hỗ trợ tốt nhất:
    Email: customercare@vinsaky.com
    Hotline: 1900-xxxx
    Website: www.vinsaky.com
    Địa chỉ: [Địa chỉ trụ sở chính]

    Chúng tôi cam kết luôn đặt lợi ích khách hàng lên hàng đầu!
  `;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });
      console.log("Full login response:", response);
      console.log("Response data:", response.data);

      if (response.data.success) {
        const { token, user } = response.data;
        console.log("Token received:", token);
        console.log("User data:", user);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/otp", { state: { email, token, user } });
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      alert(error.response?.data?.message || "Login failed, please try again");
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
    <section className="vh-100" style={{ backgroundColor: "#508BFC" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="../images/Community.jpg"
                    alt="login form"
                    className="img-fluid"
                    style={{
                      borderRadius: "1rem 0 0 1rem",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleLogin}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{ color: "#ff6219" }}
                        ></i>
                        <span className="h1 fw-bold mb-0">Vinsaky</span>
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example17">
                          Điền email của bạn
                        </label>
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example27">
                          Điền mật khẩu của bạn:
                        </label>
                        <input
                          type="password"
                          id="form2Example27"
                          className="form-control form-control-lg"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Login"}
                        </button>
                      </div>

                      <a
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/forgotPassword")}
                      >
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        Không có tài khoản?
                        <a
                          onClick={() => navigate("/register")}
                          style={{ color: "#393f81", cursor: "pointer" }}
                        >
                          <span className="text-primary"> Đăng kí tại đây</span>
                        </a>
                      </p>
                      <a 
                        className="text-primary" 
                        style={{ cursor: "pointer" }}
                        onClick={() => openModal("policy")}
                      >
                        Chính sách khách hàng
                      </a>
                      <h1>      </h1>
                      <a 
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => openModal("terms")}
                      >
                        Điều khoản dịch vụ
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "terms" ? "Điều khoản dịch vụ" : "Chính sách khách hàng"}
                </h5>
              </div>
              <div
                className="modal-body"
                ref={modalContentRef}
                onScroll={handleScroll}
                style={{ 
                  maxHeight: "60vh", 
                  overflowY: "auto",
                  padding: "20px"
                }}
              >
                <div style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                  {modalType === "terms" ? termsContent : policyContent}
                </div>
                {!canClose && (
                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <i className="fas fa-arrow-down"></i> Vui lòng lướt xuống cuối để tiếp tục
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closeModal}
                  disabled={!canClose}
                  style={{
                    opacity: canClose ? 1 : 0.5,
                    cursor: canClose ? "pointer" : "not-allowed"
                  }}
                >
                  Tôi đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Login;