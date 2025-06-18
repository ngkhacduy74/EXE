import { useState } from "react";
import { Camera, Upload, Link as LinkIcon } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ChatWidget from "../Components/WidgetChat";
import axios from "axios";

export default function NewPostForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "A",
    status: "New",
    address: "",
    description: "",
    condition: "Pending",
    user_position: "Newbie",
    image: [],
    video: [],
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("file"); // 'file' or 'url'
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviewUrl(files[0] ? URL.createObjectURL(files[0]) : null);
    setFormData({
      ...formData,
      image: files,
    });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setPreviewUrl(url || null);
    setFormData({
      ...formData,
      image: url ? [url] : [],
    });
  };

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      video: url ? [url] : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để tạo bài viết!");
      setLoading(false);
      return;
    }

    let submissionData;
    let headers = { token };
    if (formData.image.length > 0 && formData.image[0] instanceof File) {
      submissionData = new FormData();
      formData.image.forEach((img) => submissionData.append("image[]", img));
      formData.video.forEach((vid) => submissionData.append("video[]", vid));
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image" && key !== "video")
          submissionData.append(key, value);
      });
      headers["Content-Type"] = "multipart/form-data";
    } else {
      submissionData = {
        ...formData,
        image: formData.image,
        video: formData.video,
      };
    }

    try {
      const response = await axios.post(
        `${"http://localhost:4000"}/post/createPost`,
        submissionData,
        { headers }
      );
      alert("Tạo bài viết thành công!");
      setSubmitted(true);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Tạo bài viết thất bại! " + (error.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "A",
      status: "New",
      address: "",
      description: "",
      condition: "Pending",
      user_position: "Newbie",
      image: [],
      video: [],
    });
    setPreviewUrl(null);
    setSubmitted(false);
    setUploadMethod("file");
  };

  if (submitted) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-success mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  Post Submitted Successfully!
                </h2>
                <p className="card-text mb-3">
                  Your product has been posted and is pending review.
                </p>
                <div className="bg-light p-3 rounded">
                  <pre
                    className="mb-0"
                    style={{
                      fontSize: "0.875rem",
                      maxHeight: "300px",
                      overflow: "auto",
                    }}
                  >
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
                <button className="btn btn-primary mt-3" onClick={resetForm}>
                  Create Another Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h1 className="card-title h4 mb-0">Create New Product Post</h1>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Upload file ảnh */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Product Images
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="form-control"
                      onChange={handleImageChange}
                    />
                  </div>
                  {/* Hoặc nhập URL ảnh */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/image.jpg"
                      onChange={handleImageUrlChange}
                    />
                  </div>
                  {/* Nhập URL video (nếu có) */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Video URL (optional)
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/video.mp4"
                      onChange={handleVideoUrlChange}
                    />
                  </div>
                  {/* Các trường còn lại */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="New">New</option>
                      <option value="SecondHand">SecondHand</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      User Position
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="user_position"
                      value={formData.user_position}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Condition</label>
                    <input
                      type="text"
                      className="form-control"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? "Đang gửi..." : "Submit Post"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>

      <ChatWidget />
      <Footer />
    </div>
  );
}
