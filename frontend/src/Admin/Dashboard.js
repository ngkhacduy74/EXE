import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const location = useLocation();
  
  // Get tokens from location state, fallback to localStorage if needed
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
      const refreshToken = localStorage.getItem("refreshToken");
      return {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null
      };
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return { accessToken: null, refreshToken: null };
    }
  });

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalPosts: 0,
    totalComments: 0,
  });
  const [postsByMonth, setPostsByMonth] = useState(Array(12).fill(0));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for demo
  const sampleData = {
    summary: { totalUsers: 1200, totalCategories: 15, totalPosts: 450, totalComments: 2300 },
    postsByYear: {
      2023: [30, 25, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75],
      2024: [40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85],
      2025: [50, 45, 60, 55, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  };

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
      console.error("No refresh token available");
      return false;
    }

    try {
      // Replace with your actual refresh endpoint
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newTokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || tokens.refreshToken
        };
        
        // Update localStorage
        try {
          localStorage.setItem("token", newTokens.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", newTokens.refreshToken);
          }
        } catch (error) {
          console.error("Error saving refreshed tokens:", error);
        }
        
        setTokens(newTokens);
        console.log("✅ Token refreshed successfully");
        return true;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
    return false;
  };

  // API call function with automatic token refresh
  const apiCall = async (url, options = {}) => {
    if (!tokens.accessToken) {
      console.error("No access token available");
      return null;
    }

    const makeRequest = async (token) => {
      return fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    };

    try {
      let response = await makeRequest(tokens.accessToken);
      
      // If token expired, try to refresh
      if (response.status === 401 && tokens.refreshToken) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          response = await makeRequest(tokens.accessToken);
        }
      }
      
      return response;
    } catch (error) {
      console.error("API call error:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Check if we have tokens
        if (!tokens.accessToken) {
          console.log("No access token available");
          setIsLoading(false);
          return;
        }

        // In a real app, you would make API calls here
        // const response = await apiCall('/api/dashboard/summary');
        // if (response && response.ok) {
        //   const data = await response.json();
        //   setDashboardData(data.summary || {});
        // }

        // For demo purposes, using sample data
        setDashboardData(sampleData.summary || {});
        const years = Object.keys(sampleData.postsByYear).map(Number);
        setAvailableYears(years);
        setPostsByMonth(sampleData.postsByYear[selectedYear] || Array(12).fill(0));
      } catch (error) {
        console.error("Error processing dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedYear, tokens.accessToken]);

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: `Number of Posts in ${selectedYear}`,
        data: postsByMonth,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Monthly Posts Statistics for ${selectedYear}` },
    },
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Row>
        <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
          <Sidebar />
        </Col>
        <Col style={{ marginLeft: "10px" }} className="p-4">
          {/* Token Status Display */}
          <div className="mb-3">
            <Card className={`border-${tokens.accessToken ? 'success' : 'warning'}`}>
              <Card.Body className="py-2">
                <Row>
                  <Col md={6}>
                    <small className={`text-${tokens.accessToken ? 'success' : 'warning'}`}>
                      {tokens.accessToken ? '✅' : '⚠️'} Access Token: {tokens.accessToken ? `${tokens.accessToken.substring(0, 15)}...` : 'Not found'}
                    </small>
                  </Col>
                  <Col md={6}>
                    <small className={`text-${tokens.refreshToken ? 'success' : 'warning'}`}>
                      {tokens.refreshToken ? '✅' : '⚠️'} Refresh Token: {tokens.refreshToken ? `${tokens.refreshToken.substring(0, 15)}...` : 'Not found'}
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
              </Card.Body>
            </Card>
          </div>

          <div id="dashboard" className="mb-5">
            <h3 className="mb-4">Dashboard</h3>
            <Row className="g-4">
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-primary">{dashboardData.totalUsers}</div>
                    <div className="text-muted">Total Users</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-success">{dashboardData.totalCategories}</div>
                    <div className="text-muted">Categories</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-warning">{dashboardData.totalPosts}</div>
                    <div className="text-muted">Total Posts</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-info">{dashboardData.totalComments}</div>
                    <div className="text-muted">Comments</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          <div id="chart" className="mt-5">
            <h3 className="mb-4">Posts Statistics</h3>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                aria-label="Select year for posts statistics"
                style={{ 
                  width: "150px", 
                  height: "35px", 
                  fontSize: "14px", 
                  padding: "5px", 
                  borderRadius: "5px", 
                  border: "1px solid #ccc" 
                }}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
              <Card.Body>
                <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;