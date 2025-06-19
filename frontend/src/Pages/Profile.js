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
import axios from "axios";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ChatWidget from "../Components/WidgetChat";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        // Lấy thông tin user từ localStorage (giống như trang home)
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
          setError("Bạn cần đăng nhập để xem hồ sơ");
          navigate("/login");
          return;
        }

        const userData = JSON.parse(storedUser);

        // Nếu muốn lấy thông tin mới nhất từ server
        if (userData.id) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/user/${userData.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const updatedUserData =
            response.data?.user?.[0] || response.data?.user || response.data;
          setUser(updatedUserData);
        } else {
          // Sử dụng dữ liệu từ localStorage nếu không có ID
          setUser(userData);
        }

        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải thông tin người dùng:", err);

        // Nếu token hết hạn hoặc không hợp lệ
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        // Nếu có lỗi khác, vẫn hiển thị thông tin từ localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setError("Không thể tải thông tin mới nhất, hiển thị dữ liệu đã lưu");
        } else {
          setError(
            err.response?.data?.message || "Không thể tải thông tin người dùng"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

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
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn cần đăng nhập để lưu thông tin");
        return;
      }

      // Gửi API cập nhật thông tin user
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/${user.id}`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Cập nhật localStorage với thông tin mới
      localStorage.setItem("user", JSON.stringify(user));

      setIsEditing(false);
      console.log("Đã lưu hồ sơ thành công");

      // Hiển thị thông báo thành công (có thể thêm toast notification)
      alert("Cập nhật hồ sơ thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu hồ sơ:", err);
      setError("Không thể lưu thông tin hồ sơ");
    }
  };

  if (loading) {
    return (
      <HelmetProvider>
        <div>
          <Helmet>
            <title>Hồ Sơ Cá Nhân - Vinsaky</title>
          </Helmet>
          <Header />
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
          <ChatWidget />
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  if (!user) {
    return (
      <HelmetProvider>
        <div>
          <Helmet>
            <title>Không tìm thấy - Vinsaky</title>
          </Helmet>
          <Header />
          <Container
            fluid
            className="bg-light d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
          >
            <Card className="text-center shadow">
              <Card.Body>
                <Card.Title>Không tìm thấy người dùng</Card.Title>
                <Card.Text>Người dùng bạn tìm kiếm không tồn tại.</Card.Text>
                <Button variant="primary" href="/">
                  Về trang chủ
                </Button>
              </Card.Body>
            </Card>
          </Container>
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
          <title>Hồ Sơ - {user.fullname || user.name} - Vinsaky</title>
          <meta
            name="description"
            content={`Hồ sơ của ${user.fullname || user.name} - ${
              user.profession || "Freelancer"
            }`}
          />
        </Helmet>

        <Header />

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
                            user.profileImage ||
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
                          {user.fullname || user.name || "Tên người dùng"}
                        </h2>
                        <p className="text-muted h5 mb-3">
                          {user.profession || "Freelancer"}
                        </p>
                        <div className="mb-3">
                          <span className="badge bg-success me-2">
                            {user.rating || "5.0"} ({user.reviews || "15"} đánh
                            giá)
                          </span>
                          <span className="badge bg-info">
                            {user.location || "Hà Nội, Việt Nam"}
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
                                      {user.fullname ||
                                        user.name ||
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
                                      {user.email || "Chưa cập nhật"}
                                    </p>
                                  </Col>
                                </Row>

                                <Row className="mb-3">
                                  <Col md={4}>
                                    <strong> Số điện thoại:</strong>
                                  </Col>
                                  <Col md={8}>
                                    <p className="mb-0">
                                      {user.phone || "Chưa cập nhật"}
                                    </p>
                                  </Col>
                                </Row>

                                <Row className="mb-3">
                                  <Col md={4}>
                                    <strong> Địa chỉ:</strong>
                                  </Col>
                                  <Col md={8}>
                                    <p className="mb-0">
                                      {user.address || "Chưa cập nhật"}
                                    </p>
                                  </Col>
                                </Row>

                                <Row className="mb-3">
                                  <Col md={4}>
                                    <strong> Nghề nghiệp:</strong>
                                  </Col>
                                  <Col md={8}>
                                    <p className="mb-0">
                                      {user.profession || "Freelancer"}
                                    </p>
                                  </Col>
                                </Row>

                                <Row className="mb-3">
                                  <Col md={4}>
                                    <strong> Giới thiệu bản thân:</strong>
                                  </Col>
                                  <Col md={8}>
                                    <p className="mb-0">
                                      {user.bio ||
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
        <ChatWidget />
        <Footer />
      </div>
    </HelmetProvider>
  );
}
