import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
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
    specifications: {
      dimensions: "",
      weight: "",
      color: "",
      material: "",
      warranty: ""
    },
    features: [""],
    image: null
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle features array
  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""]
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
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Mỗi ảnh phải nhỏ hơn 5MB");
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = "Valid capacity is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
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
      
      // Add all form fields
      submitData.append('name', formData.name);
      submitData.append('brand', formData.brand);
      submitData.append('price', formData.price);
      submitData.append('capacity', formData.capacity);
      submitData.append('status', formData.status);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('specifications', JSON.stringify(formData.specifications));
      submitData.append('features', JSON.stringify(formData.features.filter(f => f.trim())));
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await axios.post("http://localhost:4000/product/create", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess("Product created successfully!");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/manage-products");
      }, 2000);
    } catch (err) {
      console.error("Create product error:", err);
      setError(err.response?.data?.message || "Failed to create product. Please try again.");
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
                    <h5 className="mb-0">Features</h5>
                    <Button variant="outline-primary" size="sm" onClick={addFeature}>
                      Add Feature
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Form.Control
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                        />
                        {formData.features.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => removeFeature(index)}
                          >
                            <X size={16} />
                          </Button>
                        )}
                      </div>
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
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-fluid mb-3"
                          style={{ maxHeight: "200px", borderRadius: "8px" }}
                        />
                        <div>
                          <Button variant="outline-danger" size="sm" onClick={removeImage}>
                            <X size={16} className="me-1" />
                            Remove
                          </Button>
                        </div>
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
                      
                      <Button
                        variant="outline-info"
                        onClick={handlePreview}
                        disabled={loading}
                      >
                        <Eye size={20} className="me-2" />
                        Xem trước
                      </Button>
                      
                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate("/manage-products")}
                        disabled={loading}
                      >
                        Cancel
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
