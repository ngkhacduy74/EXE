import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FaUserCircle, FaBell, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";

function HeaderAdmin() {

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, [])

  return (
    <>
      {
        (user?.roleId === 0) ? (
          <Row
            className="align-items-center shadow-sm px-3"
            style={{
              background: "#2c3e50",
              color: "white",
              height: "70px",
            }}
          >
            <Col
              md={6}
              className="d-flex align-items-center"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              <span className="me-3" style={{ color: "#f39c12" }}>•</span> Admin Dashboard
            </Col>
            <Col md={6} className="text-end">
              <div
                className="d-inline-flex align-items-center me-4"
                style={{
                  cursor: "pointer",
                  background: "#34495e",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                }}
              >
                <FaBell className="me-2" size={18} title="Notifications" />
                <span>3 New</span>
              </div>

              <div
                onClick={() => navigate("/")}
                className="d-inline-flex align-items-center me-4"
                style={{
                  cursor: "pointer",
                  background: "#34495e",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                }}
              >
                <FaHome className="me-2" size={18} title="Home" />
                <span>Home</span>
              </div>

              <div className="d-inline-flex align-items-center">
                <span className="me-2">{user.userName}</span>
                <img
                  src={`../images/${user.avatar}.png`}
                  alt="Profile"
                  style={{ width: "60px", height: "60px", borderRadius: "50%", cursor: "pointer" }}
                  title="Profile"
                />
              </div>
            </Col>
          </Row>
        ) : (
          <>
            <ErrorPage />
          </>
        )
      }
    </>
  );
}

export default HeaderAdmin;
