import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";

function ManaAccount() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/user/allUser");
        console.log("API Response:", response.data);

        let userData = [];
        if (response.data.success && Array.isArray(response.data.data)) {
          userData = response.data.data;
        } else if (response.data.success && response.data.data) {
          userData = [response.data.data];
        } else {
          console.warn("Unexpected response structure:", response.data);
        }

        setUsers(userData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch users. Please try again.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle view details
  const handleViewDetails = (userId) => {
    console.log("Navigating to user:", userId); // Debug
    navigate(`/user/${userId}`);
  };

  // Handle activate/deactivate (ignored for now)
  const handleToggleActive = async (userId, currentStatus) => {
    // Placeholder: To be fixed later
    console.log("Toggle active for user:", userId, "Status:", currentStatus);
  };

  if (loading) {
    return <Container fluid>Loading users...</Container>;
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

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
          <div id="manage-users" className="mb-5">
            <h3 className="mb-4">Manage Users</h3>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <Table
                striped
                bordered
                hover
                className="shadow-sm"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <thead className="bg-primary text-white">
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.is_active === "true" ? "Active" : "Inactive"}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewDetails(user.id)}
                        >
                          Details
                        </Button>
                        <Button
                          variant={user.is_active === "true" ? "danger" : "success"}
                          size="sm"
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                        >
                          {user.is_active === "true" ? "Deactivate" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ManaAccount;