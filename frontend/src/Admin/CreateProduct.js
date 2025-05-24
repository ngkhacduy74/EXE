import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload, X, Save, Eye } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    capacity: "",
    status: "New",
    description: "",
    category: "",
    size: "",
    weight: "",
    voltage: "",
    features: [{ title: "", description: "" }],
    images: [],
    videos: [],
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle features array
  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData((prev) => ({ ...prev, features: newFeatures }));
    if (errors.features) {
      setErrors((prev) => ({ ...prev, features: "" }));
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }],
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, features: newFeatures }));
    }
  };

  // Handle multiple image upload (max 3)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 3) {
      setError("Chỉ được tải lên tối đa 3 ảnh");
      return;
    }
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    if (validImages.length !== files.length) {
      setError("Một số file không phải ảnh hợp lệ");
      return;
    }
    validImages.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError("Mỗi ảnh phải nhỏ hơn 5MB");
        return;
      }
    });
    const newPreviews = validImages.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...validImages] }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setError("");
  };

  // Handle single video upload (max 1)
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.videos.length + files.length > 1) {
      setError("Chỉ được tải lên tối đa 1 video");
      return;
    }
    const validVideos = files.filter((file) => file.type.startsWith("video/"));
    if (validVideos.length !== files.length) {
      setError("File không phải video hợp lệ");
      return;
    }
    validVideos.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setError("Video phải nhỏ hơn 10MB");
        return;
      }
    });
    const newPreviews = validVideos.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, videos: [...prev.videos, ...validVideos] }));
    setVideoPreviews((prev) => [...prev, ...newPreviews]);
    setError("");
  };

  // Remove image
  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove video
  const removeVideo = (index) => {
    URL.revokeObjectURL(videoPreviews[index]);
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";
    if (!formData.brand.trim()) newErrors.brand = "Thương hiệu là bắt buộc";
    if (!formData.price || formData.price <= 0) newErrors.price = "Giá phải lớn hơn 0";
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = "Dung tích phải lớn hơn 0";
    if (!formData.category.trim()) newErrors.category = "Danh mục là bắt buộc";
    if (!formData.description.trim()) newErrors.description = "Mô tả là bắt buộc";
    if (!formData.size.trim()) newErrors.size = "Kích thước là bắt buộc";
    if (!formData.weight || formData.weight <= 0) newErrors.weight = "Trọng lượng phải lớn hơn 0";
    if (!formData.voltage.trim()) newErrors.voltage = "Điện áp là bắt buộc";
    if (formData.features.some((f) => !f.title.trim() || !f.description.trim())) {
      newErrors.features = "Tất cả tính năng phải có tiêu đề và mô tả";
    }
    if (formData.images.length === 0) newErrors.images = "Phải tải lên ít nhất 1 ảnh";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc và tải lên ít nhất 1 ảnh");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập để tạo sản phẩm");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("brand", formData.brand);
      submitData.append("price", formData.price);
      submitData.append("capacity", formData.capacity);
      submitData.append("status", formData.status);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("size", formData.size);
      submitData.append("weight", formData.weight);
      submitData.append("voltage", formData.voltage);
      submitData.append("features", JSON.stringify(formData.features.map((f) => ({ title: f.title, description: f.description }))));

      formData.images.forEach((image) => submitData.append("images", image));
      formData.videos.forEach((video) => submitData.append("videos", video));

      const response = await axios.post("http://localhost:4000/product/create", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Tạo sản phẩm thành công!");
      setTimeout(() => {
        navigate("/manage-products");
      }, 2000);
    } catch (err) {
      console.error("Lỗi khi tạo sản phẩm:", err);
      let errorMessage = "Không thể tạo sản phẩm. Vui lòng thử lại.";
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = "Không được phép: Token không hợp lệ hoặc hết hạn";
            break;
          case 400:
            errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường";
            break;
          case 413:
            errorMessage = "File tải lên quá lớn";
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    console.log("Xem trước sản phẩm:", formData);
  };

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Row>
        <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
          <Sidebar />
        </Col>
        <Col style={{ marginLeft: "10px" }} className="p-4">
          <div className="d-flex align-items-center mb-4">
            <Button variant="outline-secondary" onClick={() => navigate("/manaProduct")} className="me-3">
              <ArrowLeft size={20} />
            </Button>
            <h3 className="mb-0">Tạo sản phẩm mới</h3>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Thông tin cơ bản</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tên sản phẩm *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            isInvalid={!!errors.name}
                            placeholder="Nhập tên sản phẩm"
                          />
                          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Thương hiệu *</Form.Label>
                          <Form.Control
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            isInvalid={!!errors.brand}
                            placeholder="Nhập thương hiệu"
                          />
                          <Form.Control.Feedback type="invalid">{errors.brand}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Giá (VND) *</Form.Label>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            isInvalid={!!errors.price}
                            placeholder="0"
                            min="0"
                          />
                          <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Dung tích (lít) *</Form.Label>
                          <Form.Control
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            isInvalid={!!errors.capacity}
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                          <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tình trạng</Form.Label>
                          <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="New">Mới</option>
                            <option value="Second Hand">Đã qua sử dụng</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Danh mục *</Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        isInvalid={!!errors.category}
                        placeholder="VD: Máy hút bụi, Tủ lạnh"
                      />
                      <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Mô tả *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        isInvalid={!!errors.description}
                        placeholder="Nhập mô tả chi tiết sản phẩm"
                      />
                      <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Thông số kỹ thuật</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Kích thước (cm) *</Form.Label>
                          <Form.Control
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            isInvalid={!!errors.size}
                            placeholder="VD: 60 x 55 x 85"
                          />
                          <Form.Text className="text-muted">Sử dụng dấu "x" giữa các số (VD: 60 x 55 x 85)</Form.Text>
                          <Form.Control.Feedback type="invalid">{errors.size}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Trọng lượng *</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleInputChange}
                              isInvalid={!!errors.weight}
                              placeholder="VD: 65"
                              min="0"
                              step="0.1"
                            />
                            <span className="ms-2">kg</span>
                          </div>
                          <Form.Control.Feedback type="invalid">{errors.weight}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Điện áp *</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              type="text"
                              name="voltage"
                              value={formData.voltage}
                              onChange={handleInputChange}
                              isInvalid={!!errors.voltage}
                              placeholder="VD: 220"
                            />
                            <span className="ms-2">volt</span>
                          </div>
                          <Form.Control.Feedback type="invalid">{errors.voltage}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Tính năng</h5>
                    <Button variant="outline-primary" size="sm" onClick={addFeature}>
                      Thêm tính năng
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {formData.features.map((feature, index) => (
                      <Row key={index} className="mb-2">
                        <Col md={4}>
                          <Form.Control
                            type="text"
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                            placeholder={`Tiêu đề tính năng ${index + 1}`}
                            isInvalid={!!errors.features}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Control
                            type="text"
                            value={feature.description}
                            onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                            placeholder={`Mô tả tính năng ${index + 1}`}
                            isInvalid={!!errors.features}
                          />
                        </Col>
                        <Col md={2}>
                          {formData.features.length > 1 && (
                            <Button variant="outline-danger" size="sm" onClick={() => removeFeature(index)}>
                              <X size={16} />
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
                    {errors.features && <Form.Text className="text-danger">{errors.features}</Form.Text>}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Hình ảnh sản phẩm (tối đa 3) *</h5>
                  </Card.Header>
                  <Card.Body>
                    {imagePreviews.length > 0 ? (
                      <div>
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="text-center mb-3">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="img-fluid"
                              style={{ maxHeight: "200px", borderRadius: "8px" }}
                            />
                            <Button variant="outline-danger" size="sm" onClick={() => removeImage(index)}>
                              <X size={16} className="me-1" />
                              Xóa
                            </Button>
                          </div>
                        ))}
                        {imagePreviews.length < 3 && (
                          <Form.Control type="file" accept="image/*" multiple onChange={handleImageChange} />
                        )}
                        <small className="text-muted">Kích thước tối đa: 5MB. Hỗ trợ: JPG, PNG, GIF</small>
                        {errors.images && <Form.Text className="text-danger">{errors.images}</Form.Text>}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={48} className="text-muted mb-3" />
                        <p className="text-muted">Tải lên ít nhất 1 ảnh sản phẩm</p>
                        <Form.Control type="file" accept="image/*" multiple onChange={handleImageChange} />
                        <small className="text-muted">Kích thước tối đa: 5MB. Hỗ trợ: JPG, PNG, GIF</small>
                        {errors.images && <Form.Text className="text-danger">{errors.images}</Form.Text>}
                      </div>
                    )}
                  </Card.Body>
                </Card>

                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Video sản phẩm (tối đa 1)</h5>
                  </Card.Header>
                  <Card.Body>
                    {videoPreviews.length > 0 ? (
                      <div>
                        {videoPreviews.map((preview, index) => (
                          <div key={index} className="text-center mb-3">
                            <video
                              src={preview}
                              controls
                              className="img-fluid"
                              style={{ maxHeight: "200px", borderRadius: "8px" }}
                            />
                            <Button variant="outline-danger" size="sm" onClick={() => removeVideo(index)}>
                              <X size={16} className="me-1" />
                              Xóa
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={48} className="text-muted mb-3" />
                        <p className="text-muted">Tải lên video sản phẩm (tùy chọn)</p>
                        <Form.Control type="file" accept="video/*" onChange={handleVideoChange} />
                        <small className="text-muted">Kích thước tối đa: 10MB. Hỗ trợ: MP4, AVI</small>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button variant="success" type="submit" disabled={loading} size="lg">
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <Save size={20} className="me-2" />
                            Tạo sản phẩm
                          </>
                        )}
                      </Button>
                      <Button variant="outline-info" onClick={handlePreview} disabled={loading}>
                        <Eye size={20} className="me-2" />
                        Xem trước
                      </Button>
                      <Button variant="outline-secondary" onClick={() => navigate("/manaProduct")} disabled={loading}>
                        Hủy
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProduct;