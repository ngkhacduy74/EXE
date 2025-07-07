import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Tab,
  Button,
  Form,
} from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { authApiClient } from "../Services/auth.service";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ChatWidget from "../Components/WidgetChat";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, loading, handleLogout } = useAuth();
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setError(null);
        
        // Fetch latest user data from server
        const response = await authApiClient.get(`/user/${user.id}`);
        
        const updatedUserData =
          response.data?.user?.[0] || response.data?.user || response.data;
        setProfileUser(updatedUserData);
        
        // Update localStorage with latest data
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      } catch (err) {
        console.error("Lỗi khi tải thông tin người dùng:", err);
        
        // If there's an error, use the user data from auth hook
        setProfileUser(user);
        setError("Không thể tải thông tin mới nhất, hiển thị dữ liệu đã lưu");
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Tệp được chọn:", file);
      // Xử lý upload ảnh đại diện ở đây
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      if (!profileUser) {
        setError("Không có thông tin người dùng để lưu");
        return;
      }

      // Gửi API cập nhật thông tin user
      const response = await authApiClient.put(
        `/user/${profileUser.id}`,
        profileUser
      );

      // Cập nhật localStorage với thông tin mới
      localStorage.setItem("user", JSON.stringify(profileUser));
      setProfileUser(profileUser);

      setIsEditing(false);
      console.log("Đã lưu hồ sơ thành công");

      // Hiển thị thông báo thành công
      alert("Cập nhật hồ sơ thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu hồ sơ:", err);
      setError("Không thể lưu thông tin hồ sơ");
    }
  };

  // Use profileUser for display, fallback to user from auth hook
  const displayUser = profileUser || user;

  if (loading) {
    return (
      <HelmetProvider>
        <div>
          <Helmet>
            <title>Hồ Sơ Cá Nhân - Vinsaky</title>
          </Helmet>
          <Header />
          <div className="content-wrapper">
            <Container
              fluid
              className="bg-light d-flex justify-content-center align-items-center"
              style={{ minHeight: "80vh" }}
            >
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-2">Đang tải thông tin hồ sơ...</p>
              </div>
            </Container>
          </div>
          <ChatWidget />
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  if (error) {
    return (
      <HelmetProvider>
        <div>
          <Helmet>
            <title>Lỗi - Vinsaky</title>
          </Helmet>
          <Header />
          <div className="content-wrapper">
            <Container
              fluid
              className="bg-light d-flex justify-content-center align-items-center"
              style={{ minHeight: "80vh" }}
            >
              <Card className="text-center shadow">
                <Card.Body>
                  <Card.Title className="text-danger">Có lỗi xảy ra</Card.Title>
                  <Card.Text>{error}</Card.Text>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="primary"
                      onClick={() => window.location.reload()}
                    >
                      Thử lại
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/login")}
                    >
                      Đăng nhập
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Container>
          </div>
          <ChatWidget />
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  if (!displayUser) {
    return (
      <HelmetProvider>
        <div>
          <Helmet>
            <title>Không tìm thấy - Vinsaky</title>
          </Helmet>
          <Header />
          <div className="content-wrapper">
            <Container
              fluid
              className="bg-light d-flex justify-content-center align-items-center"
              style={{ minHeight: "80vh" }}
            >
              <Card className="text-center shadow">
                <Card.Body>
                  <Card.Title>Không tìm thấy thông tin người dùng</Card.Title>
                  <Card.Text>Vui lòng đăng nhập lại để xem hồ sơ.</Card.Text>
                  <Button variant="primary" onClick={() => navigate("/login")}>
                    Đăng nhập
                  </Button>
                </Card.Body>
              </Card>
            </Container>
          </div>
          <ChatWidget />
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>Hồ Sơ - {displayUser.fullname || displayUser.name} - Vinsaky</title>
          <meta
            name="description"
            content={`Hồ sơ của ${displayUser.fullname || displayUser.name} - ${
              displayUser.profession || "Freelancer"
            }`}
          />
        </Helmet>

        <Header />

        <div className="content-wrapper">
          <Container
            fluid
            className="bg-light py-5"
            style={{ minHeight: "80vh" }}
          >
            <Container>
              <div className="profile-container">
                <Card className="shadow-lg border-0">
                  <Card.Body className="p-4">
                    <Row className="mb-4">
                      {/* Ảnh đại diện */}
                      <Col md={4} className="text-center">
                        <div className="profile-img-container mb-3">
                          <img
                            src={
                              displayUser.ava_img_url ||
                              displayUser.profileImage ||
                              "https://res.cloudinary.com/dtdwjplew/image/upload/v1737903159/9_gnxlmk.jpg"
                            }
                            alt="Ảnh đại diện"
                            className="profile-img rounded-circle shadow"
                            style={{
                              width: "180px",
                              height: "180px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        {isEditing && (
                          <Form.Group>
                            <Form.Label className="btn btn-outline-primary btn-sm">
                              Thay đổi ảnh
                              <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                              />
                            </Form.Label>
                          </Form.Group>
                        )}
                      </Col>

                      {/* Thông tin chính */}
                      <Col md={6}>
                        <div className="profile-header">
                          <h2 className="mb-2 text-primary">
                            {displayUser.fullname || displayUser.name || "Tên người dùng"}
                          </h2>
                          <p className="text-muted h5 mb-3">
                            {displayUser.profession || "Freelancer"}
                          </p>
                          <div className="mb-3">
                            <span className="badge bg-success me-2">
                              {displayUser.rating || "5.0"} ({displayUser.reviews || "15"} đánh
                              giá)
                            </span>
                            <span className="badge bg-info">
                              {displayUser.location || "Hà Nội, Việt Nam"}
                            </span>
                          </div>
                        </div>
                      </Col>

                      {/* Nút chỉnh sửa */}
                      <Col md={2} className="text-end">
                        {isEditing ? (
                          <div>
                            <Button
                              variant="success"
                              size="sm"
                              className="mb-2 w-100"
                              onClick={handleSaveProfile}
                            >
                              Lưu
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-100"
                              onClick={handleEditToggle}
                            >
                              Hủy
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleEditToggle}
                          >
                            Chỉnh sửa hồ sơ
                          </Button>
                        )}
                      </Col>
                    </Row>

                    {/* Tab Navigation */}
                    <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                      <Row>
                        <Col md={4}></Col>

                        <Col md={8}>
                          <Tab.Content>
                            <Tab.Pane eventKey="about">
                              <Card className="border-0 shadow-sm">
                                <Card.Body>
                                  <Row className="mb-3">
                                    <Col md={4}>
                                      <strong> Họ và tên:</strong>
                                    </Col>
                                    <Col md={8}>
                                      <p className="mb-0">
                                        {displayUser.fullname ||
                                          displayUser.name ||
                                          "Chưa cập nhật"}
                                      </p>
                                    </Col>
                                  </Row>

                                  <Row className="mb-3">
                                    <Col md={4}>
                                      <strong> Email:</strong>
                                    </Col>
                                    <Col md={8}>
                                      <p className="mb-0">
                                        {displayUser.email || "Chưa cập nhật"}
                                      </p>
                                    </Col>
                                  </Row>

                                  <Row className="mb-3">
                                    <Col md={4}>
                                      <strong> Số điện thoại:</strong>
                                    </Col>
                                    <Col md={8}>
                                      <p className="mb-0">
                                        {displayUser.phone || "Chưa cập nhật"}
                                      </p>
                                    </Col>
                                  </Row>

                                  <Row className="mb-3">
                                    <Col md={4}>
                                      <strong> Địa chỉ:</strong>
                                    </Col>
                                    <Col md={8}>
                                      <p className="mb-0">
                                        {displayUser.address || "Chưa cập nhật"}
                                      </p>
                                    </Col>
                                  </Row>

                                  <Row className="mb-3">
                                    <Col md={4}>
                                      <strong> Nghề nghiệp:</strong>
                                    </Col>
                                    <Col md={8}>
                                      <p className="mb-0">
                                        {displayUser.profession || "Freelancer"}
                                      </p>
                                    </Col>
                                  </Row>

                                  <Row className="mb-3">
                                    <Col md={4}>
                                      <strong> Giới thiệu bản thân:</strong>
                                    </Col>
                                    <Col md={8}>
                                      <p className="mb-0">
                                        {displayUser.bio ||
                                          "Chưa có thông tin giới thiệu"}
                                      </p>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>
                            </Tab.Pane>
                          </Tab.Content>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </Card.Body>
                </Card>
              </div>
            </Container>
          </Container>
        </div>
        <ChatWidget />
        <Footer />
      </div>
    </HelmetProvider>
  );
}
