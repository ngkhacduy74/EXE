import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Edit, Trash2, FileText, Calendar, User, Tag } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";

const api = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 5000,
});

const PostDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: postId } = useParams();
  
  // Token state management - similar to ManagePost
  const [tokens, setTokens] = useState(() => {
    // First try to get from location state
    const locationToken = location.state?.token;
    const locationRefreshToken = location.state?.refresh_token;
    
    if (locationToken && locationRefreshToken) {
      return {
        accessToken: locationToken,
        refreshToken: locationRefreshToken
      };
    }
    
    // Fallback to localStorage
    try {
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken") || localStorage.getItem("refresh_token");
      return {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null
      };
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return { accessToken: null, refreshToken: null };
    }
  });

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  console.log("Access token found:", tokens.accessToken ? "Yes" : "No");
  console.log("Refresh token found:", tokens.refreshToken ? "Yes" : "No");
  console.log("Post ID:", postId);

  // Effect to update tokens when location state changes
  useEffect(() => {
    const locationToken = location.state?.token;
    const locationRefreshToken = location.state?.refresh_token;
    
    if (locationToken && locationRefreshToken) {
      console.log("✅ Token from location:", locationToken.substring(0, 15) + "...");
      console.log("🔄 Refresh Token from location:", locationRefreshToken.substring(0, 15) + "...");
      
      setTokens({
        accessToken: locationToken,
        refreshToken: locationRefreshToken
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
      console.error('No refresh token available');
      throw new Error('No refresh token available');
    }

    try {
      console.log('Attempting to refresh token...');

      const response = await api.post('/auth/refresh-token', {
        refresh_token: tokens.refreshToken,
      });

      const { token, refresh_token } = response.data;
      if (!token || !refresh_token) {
        throw new Error('Invalid refresh token response');
      }

      const newTokens = {
        accessToken: token,
        refreshToken: refresh_token
      };

      // Update localStorage
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refresh_token);
      } catch (error) {
        console.error("Error saving refreshed tokens:", error);
      }

      setTokens(newTokens);
      console.log('✅ Tokens refreshed successfully');
      return token;
    } catch (err) {
      console.error('Error refreshing token:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw err;
    }
  };

  // API call with token refresh logic
  const makeAuthenticatedRequest = async (config, retryCount = 0) => {
    try {
      if (!tokens.accessToken) {
        throw new Error('No access token available');
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
      if (err.response?.status === 401 && retryCount === 0 && tokens.refreshToken) {
        console.warn('Access token expired. Attempting to refresh...');
        try {
          await refreshAccessToken();
          return makeAuthenticatedRequest(config, 1); // Retry once
        } catch (refreshErr) {
          throw new Error('Session expired. Please log in again.');
        }
      } else if (err.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else if (!err.response) {
        throw new Error('Server connection error. Please check your connection.');
      }
      throw err;
    }
  };

  // Fetch post details
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we have tokens and postId
        if (!tokens.accessToken) {
          console.log("No access token available");
          setError("No access token available. Please log in again.");
          setLoading(false);
          return;
        }

        if (!postId) {
          setError("No post ID provided.");
          setLoading(false);
          return;
        }
        
        const response = await makeAuthenticatedRequest({
          method: 'GET',
          url: `/post/${postId}`,
        });

        console.log("API Response:", response.data);

        if (response.data.success && response.data.data) {
          setPost(response.data.data);
        } else {
          throw new Error("Post not found or invalid response");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to fetch post details. Please try again later.");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if we have access token and postId
    if (tokens.accessToken && postId) {
      fetchPostDetail();
    }
  }, [tokens.accessToken, postId]);

  // Handle back to posts list
  const handleBackToList = () => {
    navigate('/manage-posts', {
      state: {
        token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      }
    });
  };

  // Handle edit post
  const handleEditPost = () => {
    navigate(`/edit-post/${postId}`, {
      state: {
        token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      }
    });
  };

  // Handle delete post
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await makeAuthenticatedRequest({
        method: 'DELETE',
        url: `/post/${postId}`,
      });

      if (response.data.success) {
        alert("Post deleted successfully!");
        navigate('/manage-posts', {
          state: {
            token: tokens.accessToken,
            refresh_token: tokens.refreshToken
          }
        });
      } else {
        throw new Error(response.data.message || 'Failed to delete post');
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err.response?.data?.message || err.message || "Failed to delete post.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle toggle condition
  const handleToggleCondition = async () => {
    if (!post) return;

    const newCondition = post.condition === "Active" ? "Inactive" : "Active";
    setActionLoading(true);
    
    try {
      const response = await makeAuthenticatedRequest({
        method: 'PUT',
        url: `/post/change-condition/${newCondition}/${postId}`,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setPost(prevPost => ({
          ...prevPost,
          condition: newCondition
        }));
        console.log('Post condition updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update condition');
      }
    } catch (err) {
      console.error("Error updating post condition:", err);
      setError(err.response?.data?.message || err.message || "Failed to update post condition.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (error && error.includes("Session expired")) {
    return <ErrorPage message={error} />;
  }

  if (loading) {
    return (
      <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
        <HeaderAdmin />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading post details...</p>
          </div>
        </div>
      </Container>
    );
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
          {/* Error Alert */}
          {error && !error.includes("Session expired") && (
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              <strong>Warning:</strong> {error}
            </Alert>
          )}

          {/* Header with back button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <Button 
                variant="outline-secondary" 
                onClick={handleBackToList}
                className="me-3"
              >
                <ArrowLeft size={16} className="me-1" />
                Back to Posts
              </Button>
              <h2 className="mb-0">Post Details</h2>
            </div>
            {post && (
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleEditPost}
                  disabled={actionLoading}
                >
                  <Edit size={16} className="me-1" />
                  Edit
                </Button>
                <Button
                  variant={post.condition === "Active" ? "warning" : "success"}
                  onClick={handleToggleCondition}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    <>
                      {post.condition === "Active" ? "Deactivate" : "Activate"}
                    </>
                  )}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeletePost}
                  disabled={actionLoading}
                >
                  <Trash2 size={16} className="me-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {!post ? (
            <div className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <p className="text-muted">Post not found.</p>
              <Button variant="primary" onClick={handleBackToList}>
                Back to Posts List
              </Button>
            </div>
          ) : (
            <Row>
              <Col lg={8}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">
                      <FileText size={20} className="me-2" />
                      {post.title || "Untitled Post"}
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Post Content */}
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Content:</h6>
                      <div 
                        className="border rounded p-3 bg-light"
                        style={{ minHeight: "200px", whiteSpace: "pre-wrap" }}
                      >
                        {post.content || "No content available."}
                      </div>
                    </div>

                    {/* Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-muted mb-2">Images:</h6>
                        <Row>
                          {post.images.map((image, index) => (
                            <Col md={4} key={index} className="mb-3">
                              <img
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className="img-fluid rounded shadow-sm"
                                style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}

                    {/* Additional Details */}
                    {post.description && (
                      <div className="mb-3">
                        <h6 className="text-muted mb-2">Description:</h6>
                        <p className="border rounded p-3 bg-light">
                          {post.description}
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                {/* Post Info Card */}
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-info text-white">
                    <h5 className="mb-0">Post Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <Tag size={16} className="me-2 text-muted" />
                        <strong>Category:</strong>
                      </div>
                      <Badge bg="secondary" className="ms-4">
                        {post.category || "N/A"}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Status:</strong>
                      </div>
                      <Badge 
                        bg={post.status === "New" ? "success" : "danger"} 
                        className="ms-4"
                      >
                        {post.status || "N/A"}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Condition:</strong>
                      </div>
                      <Badge 
                        bg={post.condition === "Active" ? "success" : "secondary"} 
                        className="ms-4"
                      >
                        {post.condition || "N/A"}
                      </Badge>
                    </div>

                    {post.author && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <User size={16} className="me-2 text-muted" />
                          <strong>Author:</strong>
                        </div>
                        <p className="ms-4 mb-0">{post.author}</p>
                      </div>
                    )}

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <Calendar size={16} className="me-2 text-muted" />
                        <strong>Created:</strong>
                      </div>
                      <p className="ms-4 mb-0 text-muted">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>

                    {post.updatedAt && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <Calendar size={16} className="me-2 text-muted" />
                          <strong>Updated:</strong>
                        </div>
                        <p className="ms-4 mb-0 text-muted">
                          {formatDate(post.updatedAt)}
                        </p>
                      </div>
                    )}

                    {post._id && (
                      <div className="mb-0">
                        <strong>Post ID:</strong>
                        <p className="text-muted small font-monospace mt-1">
                          {post._id}
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                {/* Quick Actions Card */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-warning text-dark">
                    <h6 className="mb-0">Quick Actions</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button
                        variant="outline-primary"
                        onClick={handleEditPost}
                        disabled={actionLoading}
                      >
                        <Edit size={16} className="me-1" />
                        Edit Post
                      </Button>
                      <Button
                        variant={post.condition === "Active" ? "outline-warning" : "outline-success"}
                        onClick={handleToggleCondition}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          <>
                            {post.condition === "Active" ? "Deactivate" : "Activate"} Post
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={handleDeletePost}
                        disabled={actionLoading}
                      >
                        <Trash2 size={16} className="me-1" />
                        Delete Post
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;