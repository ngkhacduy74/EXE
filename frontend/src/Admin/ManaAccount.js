import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";
import "./styles/AdminModal.css";

function ManaAccount() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * pageSize;
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/allUser`,
          { params: { skip, limit: pageSize } }
        );
        let userData = [];
        if (response.data.success && Array.isArray(response.data.data)) {
          userData = response.data.data;
        } else if (response.data.success && response.data.data) {
          userData = [response.data.data];
        }
        setUsers(userData);
        setFilteredUsers(userData);
        setTotalUsers(response.data.total || 0);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch users. Please try again.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, pageSize]);

  // Apply filters
  useEffect(() => {
    let result = users;

    if (searchTerm) {
      result = result.filter((user) =>
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      const isActive = statusFilter === "Active" ? "true" : "false";
      result = result.filter((user) => user.is_active === isActive);
    }

    setFilteredUsers(result);
  }, [searchTerm, statusFilter, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const handleViewDetails = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleToggleActive = async (userId, currentStatus) => {
    // Placeholder logic
    console.log("Toggle active:", userId, "Current:", currentStatus);
  };

  // Pagination UI
  const totalPages = Math.ceil(totalUsers / pageSize);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return <Container fluid>Loading users...</Container>;
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <Container fluid className="bg-light admin-page" style={{ minHeight: "100vh" }}>
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

            <Row className="mb-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Col>
              <Col md={3}>
                <Form.Select value={statusFilter} onChange={handleStatusChange}>
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear Filters
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
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        {user.is_active === "true" ? "Active" : "Inactive"}
                      </td>
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
                          variant={
                            user.is_active === "true" ? "danger" : "success"
                          }
                          size="sm"
                          onClick={() =>
                            handleToggleActive(user.id, user.is_active)
                          }
                        >
                          {user.is_active === "true"
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center my-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="me-2"
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="ms-2"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ManaAccount;
