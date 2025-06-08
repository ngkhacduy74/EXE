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
  
  // Fixed image URLs for testing - using real image URLs that pass validation
  const fixedImageUrls = [
    "https://fushimavina.com/data/data/files/test/may-lam-da-30kg.jpg",
      "https://example.com/vacuum2.jpg"
  ];
  
  const [imagePreviews] = useState(fixedImageUrls);
  const [videoPreviews] = useState([]);
  
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
    warranty_period: 12,
    quantity: 1,
    features: [{ title: "", description: "" }],
    images: fixedImageUrls, // Use fixed URLs instead of empty array
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

  // Dummy handlers for image/video (since we're using fixed images)
  const handleImageChange = (e) => {
    // Do nothing - images are fixed
    setError("");
  };

  const handleVideoChange = (e) => {
    // Do nothing - no video for testing
    setError("");
  };

  const removeImage = (index) => {
    // Do nothing - images are fixed
  };

  const removeVideo = (index) => {
    // Do nothing - no video
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";
    if (!formData.brand.trim()) newErrors.brand = "Thương hiệu là bắt buộc";
    if (!formData.price || parseFloat(formData.price) < 1000) newErrors.price = "Giá phải lớn hơn hoặc bằng 1.000 VND";
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = "Dung tích phải lớn hơn 0";
    if (!formData.description.trim()) newErrors.description = "Mô tả là bắt buộc";
    if (!formData.size.trim()) newErrors.size = "Kích thước là bắt buộc";
    if (!formData.weight || formData.weight <= 0) newErrors.weight = "Trọng lượng phải lớn hơn 0";
    if (!formData.voltage.trim()) newErrors.voltage = "Điện áp là bắt buộc";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0";
    if (formData.features.some((f) => !f.title.trim() || !f.description.trim())) {
      newErrors.features = "Tất cả tính năng phải có tiêu đề và mô tả";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      setError("Vui lòng đăng nhập để tạo sản phẩm");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare JSON payload matching the expected format
      const submitData = {
        image: formData.images, // Use 'image' not 'images'
        video: formData.videos.length > 0 ? formData.videos : [], // Use 'video' not 'videos'
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price), // Convert to number, not string
        description: formData.description,
        size: formData.size,
        weight: parseFloat(formData.weight),
        status: formData.status,
        warranty_period: parseInt(formData.warranty_period),
        capacity: parseFloat(formData.capacity),
        voltage: formData.voltage,
        features: formData.features.map((f, index) => ({
          id: `f${index + 1}`, // Add id field as expected
          title: f.title,
          description: f.description
        })),
        quantity: parseInt(formData.quantity)
        // Remove category field as it's not allowed by backend
      };

      console.log("JSON payload:", JSON.stringify(submitData, null, 2));

      const response = await axios.post("http://localhost:4000/product/createProduct", submitData, {
        headers: {
          "Content-Type": "application/json",
          token: token,
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
            <h3 className="mb-0">Tạo sản phẩm mới (Test Mode)</h3>
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
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Giá (VND) *</Form.Label>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            isInvalid={!!errors.price}
                            placeholder="1000"
                            min="1000"
                          />
                          <Form.Text className="text-muted">Tối thiểu 1.000 VND</Form.Text>
                          <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
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
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số lượng *</Form.Label>
                          <Form.Control
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            isInvalid={!!errors.quantity}
                            placeholder="1"
                            min="1"
                          />
                          <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
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
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Thời gian bảo hành (tháng)</Form.Label>
                          <Form.Control
                            type="number"
                            name="warranty_period"
                            value={formData.warranty_period}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="12"
                          />
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
                    <h5 className="mb-0">Hình ảnh sản phẩm (Fixed for Testing)</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="alert alert-info">
                      <small>🔧 Test Mode: Hình ảnh đã được fix cứng để test dữ liệu</small>
                    </div>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="text-center mb-3">
                        <img
                          src={preview}
                          alt={`Test Image ${index + 1}`}
                          className="img-fluid"
                          style={{ maxHeight: "200px", borderRadius: "8px" }}
                        />
                        <div className="mt-2">
                          <small className="text-muted">Test Image {index + 1}</small>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>

                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Video sản phẩm (Disabled for Testing)</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center">
                      <div className="alert alert-secondary">
                        <small>Video upload disabled in test mode</small>
                      </div>
                    </div>
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
                            Tạo sản phẩm (Test)
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