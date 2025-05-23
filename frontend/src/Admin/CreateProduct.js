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
  const [imagePreview, setImagePreview] = useState(null);
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
      warranty: "",
    },
    features: [""],
    image: null,
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle features array
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, features: newFeatures }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

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
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.capacity || formData.capacity <= 0)
      newErrors.capacity = "Valid capacity is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add all form fields
      submitData.append("name", formData.name);
      submitData.append("brand", formData.brand);
      submitData.append("price", formData.price);
      submitData.append("capacity", formData.capacity);
      submitData.append("status", formData.status);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append(
        "specifications",
        JSON.stringify(formData.specifications)
      );
      submitData.append(
        "features",
        JSON.stringify(formData.features.filter((f) => f.trim()))
      );

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await axios.post(
        `${process.env.BACKEND_API}/product/create`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess("Product created successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/manage-products");
      }, 2000);
    } catch (err) {
      console.error("Create product error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // You can implement a preview modal here
    console.log("Preview product:", formData);
  };

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Row>
        <Col
          md="auto"
          style={{
            width: "250px",
            background: "#2c3e50",
            color: "white",
            padding: 0,
          }}
        >
          <Sidebar />
        </Col>
        <Col style={{ marginLeft: "10px" }} className="p-4">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/manage-products")}
              className="me-3"
            >
              <ArrowLeft size={20} />
            </Button>
            <h3 className="mb-0">Create New Product</h3>
          </div>

          {/* Alerts */}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Left Column - Basic Info */}
              <Col md={8}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Basic Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Product Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            isInvalid={!!errors.name}
                            placeholder="Enter product name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Brand *</Form.Label>
                          <Form.Control
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            isInvalid={!!errors.brand}
                            placeholder="Enter brand name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.brand}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Price (VND) *</Form.Label>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            isInvalid={!!errors.price}
                            placeholder="0"
                            min="0"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.price}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Capacity (kg) *</Form.Label>
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
                          <Form.Control.Feedback type="invalid">
                            {errors.capacity}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                          >
                            <option value="New">New</option>
                            <option value="Second Hand">Second Hand</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        isInvalid={!!errors.category}
                        placeholder="e.g., Washing Machine, Refrigerator"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.category}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        isInvalid={!!errors.description}
                        placeholder="Enter detailed product description"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Card.Body>
                </Card>

                {/* Specifications */}
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Specifications</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Dimensions</Form.Label>
                          <Form.Control
                            type="text"
                            name="specifications.dimensions"
                            value={formData.specifications.dimensions}
                            onChange={handleInputChange}
                            placeholder="e.g., 60 x 55 x 85 cm"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Weight</Form.Label>
                          <Form.Control
                            type="text"
                            name="specifications.weight"
                            value={formData.specifications.weight}
                            onChange={handleInputChange}
                            placeholder="e.g., 65 kg"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Color</Form.Label>
                          <Form.Control
                            type="text"
                            name="specifications.color"
                            value={formData.specifications.color}
                            onChange={handleInputChange}
                            placeholder="e.g., White, Silver"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Material</Form.Label>
                          <Form.Control
                            type="text"
                            name="specifications.material"
                            value={formData.specifications.material}
                            onChange={handleInputChange}
                            placeholder="e.g., Stainless Steel"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Warranty</Form.Label>
                          <Form.Control
                            type="text"
                            name="specifications.warranty"
                            value={formData.specifications.warranty}
                            onChange={handleInputChange}
                            placeholder="e.g., 2 years"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Features */}
                <Card className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Features</h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={addFeature}
                    >
                      Add Feature
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Form.Control
                          type="text"
                          value={feature}
                          onChange={(e) =>
                            handleFeatureChange(index, e.target.value)
                          }
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
                  </Card.Body>
                </Card>
              </Col>

              {/* Right Column - Image Upload */}
              <Col md={4}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Product Image</h5>
                  </Card.Header>
                  <Card.Body>
                    {imagePreview ? (
                      <div className="text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-fluid mb-3"
                          style={{ maxHeight: "200px", borderRadius: "8px" }}
                        />
                        <div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={removeImage}
                          >
                            <X size={16} className="me-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={48} className="text-muted mb-3" />
                        <p className="text-muted">Upload product image</p>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="mb-2"
                        />
                        <small className="text-muted">
                          Max size: 5MB. Supported: JPG, PNG, GIF
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                {/* Action Buttons */}
                <Card>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button
                        variant="success"
                        type="submit"
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save size={20} className="me-2" />
                            Create Product
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline-info"
                        onClick={handlePreview}
                        disabled={loading}
                      >
                        <Eye size={20} className="me-2" />
                        Preview
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
