import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Plus, Eye, FileText } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 5000,
});

const ManagePost = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Token state management - similar to ManageProduct
  const [tokens, setTokens] = useState(() => {
    // First try to get from location state
    const locationToken = location.state?.token;
    const locationRefreshToken = location.state?.refresh_token;

    if (locationToken && locationRefreshToken) {
      return {
        accessToken: locationToken,
        refreshToken: locationRefreshToken,
      };
    }

    // Fallback to localStorage
    try {
      const accessToken = localStorage.getItem("token");
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        localStorage.getItem("refresh_token");
      return {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
      };
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return { accessToken: null, refreshToken: null };
    }
  });

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toggleLoading, setToggleLoading] = useState({}); // Track loading state for individual posts

  console.log("Access token found:", tokens.accessToken ? "Yes" : "No");
  console.log("Refresh token found:", tokens.refreshToken ? "Yes" : "No");

  // Effect to update tokens when location state changes
  useEffect(() => {
    const locationToken = location.state?.token;
    const locationRefreshToken = location.state?.refresh_token;

    if (locationToken && locationRefreshToken) {
      console.log(
        "✅ Token from location:",
        locationToken.substring(0, 15) + "..."
      );
      console.log(
        "🔄 Refresh Token from location:",
        locationRefreshToken.substring(0, 15) + "..."
      );

      setTokens({
        accessToken: locationToken,
        refreshToken: locationRefreshToken,
      });

      // Optionally save to localStorage for persistence
      try {
        localStorage.setItem("token", locationToken);
        localStorage.setItem("refreshToken", locationRefreshToken);
      } catch (error) {
        console.error("Error saving tokens to localStorage:", error);
      }
    } else if (!tokens.accessToken || !tokens.refreshToken) {
      console.warn("⚠️ No token data passed via location state");
    }
  }, [location.state]);

  // Token refresh function
  const refreshAccessToken = async () => {
    if (!tokens.refreshToken) {
      console.error("No refresh token available");
      throw new Error("No refresh token available");
    }

    try {
      console.log("Attempting to refresh token...");

      const response = await api.post("/auth/refresh-token", {
        refresh_token: tokens.refreshToken,
      });

      const { token, refresh_token } = response.data;
      if (!token || !refresh_token) {
        throw new Error("Invalid refresh token response");
      }

      const newTokens = {
        accessToken: token,
        refreshToken: refresh_token,
      };

      // Update localStorage
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refresh_token);
      } catch (error) {
        console.error("Error saving refreshed tokens:", error);
      }

      setTokens(newTokens);
      console.log("✅ Tokens refreshed successfully");
      return token;
    } catch (err) {
      console.error("Error refreshing token:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("refresh_token"); // Clean up old key too
      window.location.href = "/login";
      throw err;
    }
  };

  // API call with token refresh logic
  const makeAuthenticatedRequest = async (config, retryCount = 0) => {
    try {
      if (!tokens.accessToken) {
        throw new Error("No access token available");
      }

      const requestConfig = {
        ...config,
        headers: {
          ...config.headers,
          token: tokens.accessToken,
        },
      };

      const response = await api.request(requestConfig);
      return response;
    } catch (err) {
      if (
        err.response?.status === 401 &&
        retryCount === 0 &&
        tokens.refreshToken
      ) {
        console.warn("Access token expired. Attempting to refresh...");
        try {
          await refreshAccessToken();
          return makeAuthenticatedRequest(config, 1); // Retry once
        } catch (refreshErr) {
          throw new Error("Session expired. Please log in again.");
        }
      } else if (err.response?.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      } else if (!err.response) {
        throw new Error(
          "Server connection error. Please check your connection."
        );
      }
      throw err;
    }
  };

  // Fetch post data and extract unique conditions and categories
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch posts without authentication since the endpoint doesn't require it
        const response = await api.get("/post/");

        console.log("API Response:", response.data);

        const postData = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];

        setPosts(postData);
        setFilteredPosts(postData);

        // Extract unique conditions and categories
        const uniqueConditions = [
          ...new Set(postData.map((p) => p.condition).filter(Boolean)),
        ];
        const uniqueCategories = [
          ...new Set(postData.map((p) => p.category).filter(Boolean)),
        ];
        setConditions(uniqueConditions);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(
          err.message || "Failed to fetch posts. Please try again later."
        );
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch posts immediately without waiting for tokens
    fetchPosts();
  }, []); // Remove tokens.accessToken dependency

  // Apply filters whenever searchTerm, statusFilter, conditionFilter, or selectedCategories change
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

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((post) =>
        selectedCategories.includes(post.category)
      );
    }

    setFilteredPosts(result);
  }, [searchTerm, statusFilter, conditionFilter, selectedCategories, posts]);

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

  // Handle category checkbox change
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setConditionFilter("All");
    setSelectedCategories([]);
  };

  // Handle view details
  const handleViewDetails = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Handle create post
  const handleCreatePost = () => {
    navigate("/create-post");
  };

  // Handle toggle condition status with checkbox
  const handleToggleCondition = async (postId, currentCondition) => {
    setToggleLoading((prev) => ({ ...prev, [postId]: true }));

    const newCondition = currentCondition === "Active" ? "Inactive" : "Active";
    console.log("Attempting to change condition:", {
      postId,
      currentCondition,
      newCondition,
    });

    try {
      const response = await makeAuthenticatedRequest({
        method: "PUT",
        url: `/post/change-condition/${newCondition}/${postId}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Server response:", response.data);

      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, condition: newCondition } : post
          )
        );
        setFilteredPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, condition: newCondition } : post
          )
        );
        console.log("Post condition updated successfully");
      } else {
        throw new Error(response.data.message || "Failed to update condition");
      }
    } catch (err) {
      console.error("Error updating post condition:", err);
      console.error("Full error details:", {
        postId,
        currentCondition,
        newCondition,
        error: err.response?.data || err.message,
      });
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update post condition."
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setToggleLoading((prev) => {
        const newState = { ...prev };
        delete newState[postId];
        return newState;
      });
    }
  };

  if (error && error.includes("Session expired")) {
    return <ErrorPage message={error} />;
  }

  if (loading) {
    return (
      <Container fluid className="bg-light admin-page" style={{ minHeight: "100vh" }}>
        <HeaderAdmin />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading posts...</p>
          </div>
        </div>
      </Container>
    );
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
          {/* Token Status Display */}
          {/* <div className="mb-3">
            <div className={`alert alert-${tokens.accessToken && tokens.refreshToken ? 'success' : 'warning'} py-2`}>
              <Row>
                <Col md={6}>
                  <small className={`text-${tokens.accessToken ? 'success' : 'danger'}`}>
                    {tokens.accessToken ? '✅' : '❌'} Access Token: {tokens.accessToken ? `${tokens.accessToken.substring(0, 15)}...` : 'Not found'}
                  </small>
                </Col>
                <Col md={6}>
                  <small className={`text-${tokens.refreshToken ? 'success' : 'danger'}`}>
                    {tokens.refreshToken ? '✅' : '❌'} Refresh Token: {tokens.refreshToken ? `${tokens.refreshToken.substring(0, 15)}...` : 'Not found'}
                  </small>
                </Col>
              </Row>
              {tokens.accessToken && tokens.refreshToken && (
                <div className="mt-2">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={refreshAccessToken}
                  >
                    Refresh Access Token
                  </button>
                </div>
              )}
              {location.state?.token && (
                <div className="mt-2">
                  <small className="text-info">
                    📍 Tokens loaded from navigation state
                  </small>
                </div>
              )}
            </div>
          </div> */}

          <div id="manage-posts" className="mb-5">
            {/* Error Alert */}
            {error && !error.includes("Session expired") && (
              <div className="alert alert-warning mb-3" role="alert">
                <strong>Warning:</strong> {error}
                <button
                  className="btn btn-link btn-sm ms-2"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Header with title and Create button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Quản lý bài viết</h2>
              <Button variant="primary" onClick={handleCreatePost}>
                <Plus className="me-2" /> Tạo bài viết mới
              </Button>
            </div>

            {/* Filter Controls */}
            <Row className="mb-4">
              <Col md={3}>
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
              <Col md={2}>
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
              <Col md={2}>
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
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter by Category</Form.Label>
                  <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Form.Check
                          key={category}
                          type="checkbox"
                          label={category}
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                      ))
                    ) : (
                      <p className="text-muted small">
                        No categories available.
                      </p>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear
                </Button>
              </Col>
            </Row>

            {/* Posts Summary */}
            <div className="mb-3">
              <small className="text-muted">
                Showing {filteredPosts.length} of {posts.length} posts
              </small>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-5">
                <FileText size={48} className="text-muted mb-3" />
                <p className="text-muted">No posts found.</p>
                {posts.length === 0 && !error && (
                  <Button
                    variant="primary"
                    onClick={handleCreatePost}
                    className="mt-2"
                  >
                    Create your first post
                  </Button>
                )}
              </div>
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
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post, index) => (
                    <tr key={post._id}>
                      <td>{index + 1}</td>
                      <td>{post.title || "N/A"}</td>
                      <td>{post.category || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${
                            post.status === "New" ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {post.status || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            post.condition === "Active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {post.condition || "N/A"}
                        </span>
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={post.condition === "Active"}
                          onChange={() =>
                            handleToggleCondition(post._id, post.condition)
                          }
                          disabled={toggleLoading[post._id]}
                          title={`Toggle to ${
                            post.condition === "Active" ? "Inactive" : "Active"
                          }`}
                        />
                        {toggleLoading[post._id] && (
                          <div
                            className="spinner-border spinner-border-sm ms-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleViewDetails(post._id)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
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
