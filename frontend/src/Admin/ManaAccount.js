import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";

function ManaAccount() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
        setFilteredUsers(userData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch users. Please try again.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Apply filters whenever searchTerm or statusFilter changes
  useEffect(() => {
    let result = users;

    // Filter by search term
    if (searchTerm) {
      result = result.filter((user) =>
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      const isActive = statusFilter === "Active" ? "true" : "false";
      result = result.filter((user) => user.is_active === isActive);
    }

    setFilteredUsers(result);
  }, [searchTerm, statusFilter, users]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status dropdown change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  // Handle view details
  const handleViewDetails = (userId) => {
    console.log("Navigating to user:", userId);
    navigate(`/user/${userId}`);
  };

  // Handle activate/deactivate
  const handleToggleActive = async (userId, currentStatus) => {
    const newStatus = currentStatus === "true" ? "false" : "true";
    try {
      await axios.put(`http://localhost:4000/user/${userId}`, {
        is_active: newStatus,
      });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, is_active: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Toggle Status Error:", err);
      setError("Failed to update user status.");
    }
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

            {/* Filter Controls */}
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Search by Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter user name"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter by Status</Form.Label>
                  <Form.Select value={statusFilter} onChange={handleStatusChange}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear
                </Button>
              </Col>
            </Row>

            {filteredUsers.length === 0 ? (
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
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.fullname || "N/A"}</td>
                      <td>{user.email || "N/A"}</td>
                      <td>{user.role || "N/A"}</td>
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