import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "terms" or "policy"
  const [canClose, setCanClose] = useState(false);
  const navigate = useNavigate();
  const modalContentRef = useRef(null);

  // Terms of Service content
  const termsContent = `
    ĐIỀU KHOẢN DỊCH VỤ VINSAKY
    ...
  `; // Keeping it as provided for brevity

  // Customer Policy content
  const policyContent = `
    CHÍNH SÁCH KHÁCH HÀNG VINSAKY
    ...
  `; // Keeping it as provided for brevity

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:4000/auth/login`,
        {
          email,
          password,
        }
      );
      console.log("Full login response:", response);
      console.log("Response data:", response.data);

      if (response.data.success) {
        const { token, user } = response.data;
        console.log("Token received:", token);
        console.log("User data:", user);

        localStorage.setItem("token", token); // Save token
        navigate("/otp", { state: { email } });
      } else {
        throw new Error(response.data.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      alert(
        error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại."
      );
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
                      <h1> </h1>
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
                  {modalType === "terms"
                    ? "Điều khoản dịch vụ"
                    : "Chính sách khách hàng"}
                </h5>
              </div>
              <div
                className="modal-body"
                ref={modalContentRef}
                onScroll={handleScroll}
                style={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                  padding: "20px",
                }}
              >
                <div style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                  {modalType === "terms" ? termsContent : policyContent}
                </div>
                {!canClose && (
                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <i className="fas fa-arrow-down"></i> Vui lòng lướt xuống
                      cuối để tiếp tục
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
                    cursor: canClose ? "pointer" : "not-allowed",
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
