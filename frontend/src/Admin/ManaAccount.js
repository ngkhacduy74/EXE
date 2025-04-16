import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Nav, Table, Button, Form, FormControl } from "react-bootstrap";
import { FaUserCircle, FaBell, FaCog, FaChartBar, FaUser, FaUsersCog, FaHome } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";
import UpdateRole from "./UpdateRole";

function ManaAccount() {
  // Sample data embedded in the component
  const sampleData = {
    users: [
      { id: 1, userName: "John Doe", email: "john.doe@example.com", roleId: 0 },
      { id: 2, userName: "Jane Smith", email: "jane.smith@example.com", roleId: 1 },
      { id: 3, userName: "Bob Johnson", email: "bob.johnson@example.com", roleId: 2 },
      { id: 4, userName: "Alice Brown", email: "alice.brown@example.com", roleId: 1 },
    ],
    roles: [
      { id: 0, roleName: "Admin" },
      { id: 1, roleName: "Editor" },
      { id: 2, roleName: "Viewer" },
    ],
  };

  const [users, setUsers] = useState([]);
  const [role, setRole] = useState([]);
  const [authentication, setAuthentication] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateRole, setShowUpdateRole] = useState(false);
  const handleShowUpdateRole = (uid) => {
    setSelectedUser(uid);
    setShowUpdateRole(true);
  };
  const handleHideUpdateRole = () => setShowUpdateRole(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for user authentication
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setAuthentication(userData);
    }

    // Set sample data
    setUsers(sampleData.users);
    setRole(sampleData.roles);
  }, []);

  const handleDelete = (uid) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (confirm) {
      // Update state to remove the user
      setUsers(users.filter((user) => user.id !== uid));
      alert("User deleted successfully");
    }
  };

  return (
    <>
      {authentication?.roleId === 0 ? (
        <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
          {/* Header */}
          <HeaderAdmin />

          <Row>
            {/* Sidebar */}
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

            {/* Main Content */}
            <Col style={{ marginLeft: "10px" }} className="p-4">
              {/* Manage Users Section */}
              <div id="manage-users" className="mb-5">
                <h3 className="mb-4">Manage Users</h3>
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
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{role.find((r) => r.id === user.roleId)?.roleName || "Unknown"}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleShowUpdateRole(user.id)}
                          >
                            Update
                          </Button>
                          {user.roleId === 0 ? null : (
                            <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                              Delete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <UpdateRole show={showUpdateRole} handleClose={handleHideUpdateRole} userId={selectedUser} />
        </Container>
      ) : (
        <ErrorPage />
      )}
    </>
  );
}

export default ManaAccount;