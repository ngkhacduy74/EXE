import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [gender, setGender] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ava_img_url, setAvaImgUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("img", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/file/upload-file`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = res.data.path || res.data.secure_url || res.data.url;
      return imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Upload ảnh thất bại");
    }
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await handleUploadImage(imageFile);
      }

      const user = {
        fullname,
        email,
        phone,
        address,
        password,
        gender,
        ava_img_url: imageUrl,
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/auth/register`,
        user
      );

      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi đăng ký.");
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#f4f5f7" }}>
      <div className="container h-100 py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-10">
            <div className="card shadow" style={{ borderRadius: "15px" }}>
              <div className="card-body p-md-5">
                <h3 className="mb-4 text-center fw-bold">Tạo tài khoản mới</h3>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Họ và tên</label>
                      <input
                        type="text"
                        className="form-control"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Địa chỉ</label>
                      <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Mật khẩu</label>
                      <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nhập lại mật khẩu</label>
                      <Input.Password
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Giới tính</label>
                      <select
                        className="form-select"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      >
                        <option value="">Chọn...</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ảnh đại diện</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleChangeFile}
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mt-2"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: "10px",
                          }}
                        />
                      )}
                    </div>

                    <div className="form-check mb-3 ms-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                      />
                      <label className="form-check-label">
                        Tôi đồng ý với <a href="#">Điều khoản dịch vụ</a>
                      </label>
                    </div>

                    <div className="d-grid mt-3">
                      <button type="submit" className="btn btn-primary btn-lg">
                        Đăng ký
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
