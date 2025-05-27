import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";

const ManagePost = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [conditions, setConditions] = useState([]);
  const navigate = useNavigate();

  // Fetch post data and extract unique conditions
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/post/");
        console.log("API Response:", response.data);

        // Extract the post array
        const postData = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];

        setPosts(postData);
        setFilteredPosts(postData);

        // Extract unique conditions
        const uniqueConditions = [
          ...new Set(postData.map((p) => p.condition).filter(Boolean)),
        ];
        setConditions(uniqueConditions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Apply filters whenever searchTerm, statusFilter, or conditionFilter changes
  useEffect(() => {
    let result = posts;

    // Filter by search term
    if (searchTerm) {
      result = result.filter((post) =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      result = result.filter((post) => post.status === statusFilter);
    }

    // Filter by condition
    if (conditionFilter !== "All") {
      result = result.filter((post) => post.condition === conditionFilter);
    }

    setFilteredPosts(result);
  }, [searchTerm, statusFilter, conditionFilter, posts]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status dropdown change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle condition dropdown change
  const handleConditionChange = (e) => {
    setConditionFilter(e.target.value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setConditionFilter("All");
  };

  // Handle view details
  const handleViewDetails = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Handle toggle status
  const handleToggleStatus = async (postId, currentStatus) => {
    try {
      const newStatus = currentStatus === "New" ? "Discontinued" : "New";
      await axios.patch(`http://localhost:4000/post/${postId}`, {
        status: newStatus,
      });
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, status: newStatus } : post
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update post status.");
    }
  };

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (loading) {
    return <p>Loading posts...</p>;
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
          <div id="manage-posts" className="mb-5">
            <h3 className="mb-4">Manage Posts</h3>

            {/* Filter Controls */}
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Search by Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter post title"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter by Status</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    <option value="All">All</option>
                    <option value="New">New</option>
                    <option value="Denied">Denied</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter by Condition</Form.Label>
                  <Form.Select
                    value={conditionFilter}
                    onChange={handleConditionChange}
                  >
                    <option value="All">All</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear
                </Button>
              </Col>
            </Row>

            {filteredPosts.length === 0 ? (
              <p>No posts found.</p>
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
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Condition</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post, index) => (
                    <tr key={post._id}>
                      <td>{index + 1}</td>
                      <td>{post.title || "N/A"}</td>
                      <td>{post.category || "N/A"}</td>
                      <td>{post.status || "N/A"}</td>
                      <td>{post.condition || "N/A"}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewDetails(post._id)}
                        >
                          Details
                        </Button>
                        <Button
                          variant={post.status === "New" ? "danger" : "success"}
                          size="sm"
                          onClick={() =>
                            handleToggleStatus(post._id, post.status)
                          }
                        >
                          {post.status === "New" ? "Denied" : "Set New"}
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
};

export default ManagePost;