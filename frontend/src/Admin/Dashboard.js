/* eslint-env browser */
/* global gtag */

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Alert, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

// Google Analytics 4 Integration Helper
class GA4Analytics {
  constructor(measurementId, apiSecret) {
    this.measurementId = measurementId;
    this.apiSecret = apiSecret;
    this.baseUrl = `http://localhost:4000/api/dashboard`;
  }

  // Track custom events using official GA4 gtag
  trackEvent(eventName, parameters = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: parameters.category || 'Admin Dashboard',
        event_label: parameters.label || eventName,
        value: parameters.value || 1,
        custom_parameter_1: parameters.dashboard_section || 'overview',
        custom_parameter_2: parameters.user_role || 'admin',
        ...parameters
      });
      console.log(`📊 GA4 Event tracked: ${eventName}`, parameters);
    } else {
      console.warn('⚠️ GA4 gtag not available for event tracking');
    }
  }

  // Track page views
  trackPageView(pageTitle, pageLocation) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', this.measurementId, {
        page_title: pageTitle,
        page_location: pageLocation
      });
      console.log(`📊 GA4 Page view tracked: ${pageTitle}`);
    }
  }

  // Get real-time users from backend API
  async getRealTimeUsers() {
    try {
      const response = await fetch(`${this.baseUrl}/realtime`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data.onlineUsers || 0;
      }
      throw new Error('Không thể lấy dữ liệu người dùng trực tiếp');
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng trực tiếp:', error);
      return 0;
    }
  }

  // Get page views data from backend API
  async getPageViews(dateRange = '7daysAgo') {
    try {
      const response = await fetch(`${this.baseUrl}/ga4`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data.pageViews || null;
      }
      throw new Error('Không thể lấy dữ liệu lượt xem trang');
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu lượt xem trang:', error);
      return null;
    }
  }

  // Get top pages from backend API
  async getTopPages() {
    try {
      const response = await fetch(`${this.baseUrl}/ga4`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data.topPages || [];
      }
      throw new Error('Không thể lấy dữ liệu trang phổ biến');
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu trang phổ biến:', error);
      return [];
    }
  }

  // Get user demographics from backend API
  async getUserDemographics() {
    try {
      const response = await fetch(`${this.baseUrl}/ga4`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data.demographics || null;
      }
      throw new Error('Không thể lấy dữ liệu nhân khẩu học');
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu nhân khẩu học:', error);
      return null;
    }
  }

  // Helper method to make GA4 API calls (requires backend implementation)
  async makeGA4APICall(endpoint, params = {}) {
    try {
      // This should be implemented on your backend
      // GA4 API requires server-side authentication
      const response = await fetch(`/api/analytics/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          measurementId: this.measurementId,
          ...params
        }),
      });
      
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Không thể lấy dữ liệu thống kê');
    } catch (error) {
      console.error('GA4 API call thất bại:', error);
      return null;
    }
  }
}

function AdminDashboard() {
  const location = useLocation();
  
  // Initialize GA4 (replace with your actual Measurement ID)
  const [ga4] = useState(new GA4Analytics('G-0DRKJH48YN', 'your-api-secret'));
  
  // Existing token state
  const [tokens, setTokens] = useState(() => {
    const locationToken = location.state?.token;
    const locationRefreshToken = location.state?.refresh_token;
    
    if (locationToken && locationRefreshToken) {
      return {
        accessToken: locationToken,
        refreshToken: locationRefreshToken
      };
    }
    
    try {
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      return {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null
      };
    } catch (error) {
      console.error("Lỗi khi truy cập localStorage:", error);
      return { accessToken: null, refreshToken: null };
    }
  });

  // Enhanced dashboard state - cập nhật theo yêu cầu
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,              // Tổng số user
    newUsersToday: 0,          // Số user mới trong ngày
    totalProducts: 0,          // Tổng số sản phẩm
    totalPosts: 0,             // Tổng số bài post
    activeUsers: 0,            // Tổng số User đang truy cập
    todayPageViews: 0,         // Những người hôm nay xem trang web
  });

  // New analytics states
  const [realTimeUsers, setRealTimeUsers] = useState(0);
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: null,
    topPages: [],
    demographics: null
  });
  
  const [postsByMonth, setPostsByMonth] = useState(Array(12).fill(0));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [realData, setRealData] = useState({
    summary: null,
    charts: null,
    recentPosts: [],
    topCategories: []
  });

  // Load Google Analytics script
  useEffect(() => {
    // Check if GA4 is already loaded
    if (window.gtag) {
      console.log("✅ GA4 đã được tải từ index.html");
      
      // Track dashboard load event
      setTimeout(() => {
        window.gtag('event', 'dashboard_loaded', {
          event_category: 'Admin',
          event_label: 'Dashboard Load',
          value: 1,
          custom_parameter_1: 'overview',
          custom_parameter_2: 'admin'
        });
        console.log("📊 Đã gửi event dashboard_loaded đến GA4");
      }, 1000);
      
      return;
    }

    console.log("⚠️ GA4 chưa được tải, đang thử tải lại...");
    
    // Fallback: Load GA4 script if not already loaded
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=G-0DRKJH48YN`;
    script1.onload = () => {
      console.log("✅ GA4 script đã tải thành công (fallback)");
    };
    script1.onerror = () => {
      console.error("❌ Lỗi khi tải GA4 script");
    };
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-0DRKJH48YN', {
        page_title: 'Admin Dashboard',
        page_location: window.location.href,
        custom_map: {
          'custom_parameter_1': 'dashboard_section',
          'custom_parameter_2': 'user_role'
        }
      });
      console.log('✅ GA4 đã được khởi tạo với ID: G-0DRKJH48YN');
    `;
    document.head.appendChild(script2);

    // Track dashboard load event
    setTimeout(() => {
      if (window.gtag) {
        window.gtag('event', 'dashboard_loaded', {
          event_category: 'Admin',
          event_label: 'Dashboard Load',
          value: 1
        });
        console.log("📊 Đã gửi event dashboard_loaded đến GA4");
      }
    }, 1000);

    return () => {
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
    };
  }, []);

  // Token refresh function (existing)
  const refreshAccessToken = async () => {
    if (!tokens.refreshToken) {
      console.error("Không có refresh token");
      return false;
    }

    try {
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
        
        try {
          localStorage.setItem("token", newTokens.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", newTokens.refreshToken);
          }
        } catch (error) {
          console.error("Lỗi khi lưu token đã làm mới:", error);
        }
        
        setTokens(newTokens);
        console.log("✅ Token đã được làm mới thành công");
        return true;
      }
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);
    }
    return false;
  };

  // Fetch real dashboard data from API
  const fetchRealDashboardData = async () => {
    if (!tokens.accessToken) {
      console.log("❌ Không có access token");
      return null;
    }

    try {
      console.log("🔍 Đang lấy dữ liệu dashboard từ API...");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("📡 Trạng thái API Response:", response.status);

      if (response.status === 401) {
        console.log("🔄 Token hết hạn, đang thử làm mới...");
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          console.log("✅ Token đã làm mới, thử lại API call...");
          return await fetchRealDashboardData();
        }
        console.log("❌ Làm mới token thất bại");
        return null;
      }

      if (response.status === 403) {
        console.log("❌ Truy cập bị từ chối - người dùng có thể không phải admin");
        return null;
      }

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("❌ Response không phải JSON:", contentType);
          return null;
        }
        
        const data = await response.json();
        console.log("✅ Dữ liệu API Response:", data);
        return data.data;
      }

      // Log error response
      const errorText = await response.text();
      console.log("❌ Lỗi API Response:", errorText);
      return null;
    } catch (error) {
      console.error("❌ Lỗi khi lấy dữ liệu dashboard:", error);
      return null;
    }
  };

  // Fetch real-time analytics
  const fetchRealTimeData = async () => {
    if (!tokens.accessToken) return null;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/realtime`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }

      return null;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thời gian thực:", error);
      return null;
    }
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Track dashboard view with GA4
        ga4.trackPageView('Admin Dashboard', window.location.href);
        ga4.trackEvent('dashboard_view', {
          category: 'Admin',
          label: 'Dashboard Load',
          value: 1,
          dashboard_section: 'overview',
          user_role: 'admin'
        });

        // Get real-time users
        const realTime = await ga4.getRealTimeUsers();
        setRealTimeUsers(realTime);

        // Get page views data
        const pageViews = await ga4.getPageViews();
        const topPages = await ga4.getTopPages();
        const demographics = await ga4.getUserDemographics();

        setAnalyticsData({
          pageViews,
          topPages,
          demographics
        });

        // Track successful data load
        ga4.trackEvent('dashboard_data_loaded', {
          category: 'Admin',
          label: 'Data Load Success',
          value: 1
        });

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
        // Track error event
        ga4.trackEvent('dashboard_error', {
          category: 'Admin',
          label: 'Data Load Error',
          value: 1,
          error_message: error.message
        });
      }
    };

    fetchAnalyticsData();

    // Update real-time users every 30 seconds
    const interval = setInterval(async () => {
      const realTime = await ga4.getRealTimeUsers();
      setRealTimeUsers(realTime);
    }, 30000);

    return () => clearInterval(interval);
  }, [ga4]);

  // Existing dashboard data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch real data from API
        const realData = await fetchRealDashboardData();
        
        if (realData) {
          console.log("✅ Đang sử dụng dữ liệu thực từ API");
          setRealData(realData);
          
          // Update dashboard data với các giá trị thực theo yêu cầu mới
          setDashboardData({
            totalUsers: realData.summary.totalUsers || 0,           // Tổng số user
            newUsersToday: realData.summary.todayNewUsers || 0,     // Số user mới trong ngày
            totalProducts: realData.summary.totalProducts || 0,     // Tổng số sản phẩm
            totalPosts: realData.summary.totalPosts || 0,           // Tổng số bài post
            activeUsers: realData.summary.activeUsers || 0,         // User đang truy cập
            todayPageViews: realData.summary.todayPageViews || 0,   // Lượt xem hôm nay
          });
          
          // Update charts data
          if (realData.charts) {
            setPostsByMonth(realData.charts.postsByMonth || Array(12).fill(0));
          }
          
          // Set available years (just current year for now)
          setAvailableYears([new Date().getFullYear()]);
        } else {
          console.log("⚠️ Không có dữ liệu thực - hiển thị dashboard trống");
          // Set empty data when no real data is available
          setDashboardData({
            totalUsers: 0,
            newUsersToday: 0,
            totalProducts: 0,
            totalPosts: 0,
            activeUsers: 0,
            todayPageViews: 0,
          });
          setPostsByMonth(Array(12).fill(0));
          setAvailableYears([new Date().getFullYear()]);
        }
      } catch (error) {
        console.error("Lỗi khi xử lý dữ liệu dashboard:", error);
        // Set empty data on error
        setDashboardData({
          totalUsers: 0,
          newUsersToday: 0,
          totalProducts: 0,
          totalPosts: 0,
          activeUsers: 0,
          todayPageViews: 0,
        });
        setPostsByMonth(Array(12).fill(0));
        setAvailableYears([new Date().getFullYear()]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedYear, tokens.accessToken, tokens]);

  // Fetch real-time data
  useEffect(() => {
    const fetchRealTime = async () => {
      const realTimeData = await fetchRealTimeData();
      if (realTimeData) {
        setRealTimeUsers(realTimeData.onlineUsers || 0);
        // Update other real-time metrics
        setDashboardData(prev => ({
          ...prev,
          activeUsers: realTimeData.onlineUsers || prev.activeUsers,
          todayPageViews: realTimeData.todayViews || prev.todayPageViews,
        }));
      }
    };

    fetchRealTime();
    
    // Update real-time data every 30 seconds
    const interval = setInterval(fetchRealTime, 30000);
    return () => clearInterval(interval);
  }, [tokens.accessToken]);

  // Track year selection change
  const handleYearChange = (year) => {
    setSelectedYear(year);
    ga4.trackEvent('dashboard_year_changed', {
      category: 'Admin',
      label: 'Year Selection',
      value: year,
      dashboard_section: 'charts'
    });
  };

  // Track data refresh
  const handleDataRefresh = () => {
    ga4.trackEvent('dashboard_refresh', {
      category: 'Admin',
      label: 'Manual Refresh',
      value: 1,
      dashboard_section: 'overview'
    });
    // Trigger data refresh
    window.location.reload();
  };

  // Chart configurations - using only real data
  const chartData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: `Bài viết năm ${selectedYear}`,
        data: realData.charts?.postsByMonth || Array(12).fill(0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const userGrowthData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: 'Tăng trưởng người dùng',
        data: realData.charts?.userGrowth || Array(12).fill(0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const revenueData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: Array(12).fill(0), // Will be implemented when revenue tracking is added
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const deviceData = {
    labels: (realData.analytics?.devices?.map(d => d.device) || analyticsData.demographics?.devices?.map(d => d.device) || ['Desktop', 'Mobile', 'Tablet']).filter(Boolean),
    datasets: [
      {
        data: (realData.analytics?.devices?.map(d => d.percentage) || analyticsData.demographics?.devices?.map(d => d.percentage) || [45, 40, 15]).filter(Boolean),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }
    ]
  };

  const countryData = {
    labels: (analyticsData.demographics?.countries?.map(c => c.country) || ['Việt Nam', 'Hoa Kỳ', 'Nhật Bản', 'Hàn Quốc', 'Singapore']).filter(Boolean),
    datasets: [
      {
        data: (analyticsData.demographics?.countries?.map(c => c.percentage || c.users || 0) || [60, 20, 10, 5, 5]).filter(Boolean),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }
    ]
  };

  if (isLoading) return <div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"><span className="visually-hidden">Đang tải...</span></div></div>;

  return (
    <Container fluid className="bg-light admin-page" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Row>
        <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
          <Sidebar />
        </Col>
        <Col style={{ marginLeft: "10px" }} className="p-4">
          {/* Real-time Analytics Alert */}
          <Alert variant="info" className="mb-3">
            🔴 <strong>Trực tiếp:</strong> {realTimeUsers} người dùng đang hoạt động trên trang web của bạn
          </Alert>

          {/* GA4 Configuration Info */}
          <Alert variant="success" className="mb-3">
            📊 <strong>Google Analytics 4.5 Đã Kết Nối:</strong> 
            <br />
            <small>
              <strong>Stream:</strong> Vinsaky | 
              <strong> URL:</strong> https://Vinsaky.com | 
            </small>
            <br />
            <small className="text-success">
              ✅ Tracking code đã được tích hợp thành công. Dữ liệu sẽ xuất hiện trong GA4 sau 24-48 giờ.
            </small>
            <div className="mt-2">
              <button 
                onClick={handleDataRefresh}
                className="btn btn-sm btn-outline-success"
              >
                🔄 Làm Mới Dữ Liệu
              </button>
            </div>
          </Alert>

          {/* Token Status Display */}
          <div className="mb-3">
            <Card className={`border-${tokens.accessToken ? 'success' : 'warning'}`}>
              <Card.Body className="py-2">
                <Row>
                  <Col md={6}>
                    <small className={`text-${tokens.accessToken ? 'success' : 'warning'}`}>
                      {tokens.accessToken ? '✅' : '⚠️'} Access Token: {tokens.accessToken ? `${tokens.accessToken.substring(0, 15)}...` : 'Không tìm thấy'}
                    </small>
                  </Col>
                  <Col md={6}>
                    <small className={`text-${tokens.refreshToken ? 'success' : 'warning'}`}>
                      {tokens.refreshToken ? '✅' : '⚠️'} Refresh Token: {tokens.refreshToken ? `${tokens.refreshToken.substring(0, 15)}...` : 'Không tìm thấy'}
                    </small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>

          {/* Data Source Status */}
          <div className="mb-3">
            <Alert variant={realData.summary ? "success" : "warning"}>
              {realData.summary ? (
                <>
                  📊 <strong>Dữ Liệu Thực Đã Kết Nối:</strong> Dashboard đang sử dụng dữ liệu trực tiếp từ cơ sở dữ liệu của bạn
                  <br />
                  <small>Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</small>
                </>
              ) : (
                <>
                  ⚠️ <strong>Không Có Dữ Liệu:</strong> Không thể lấy dữ liệu từ cơ sở dữ liệu
                  <br />
                  <small>
                    Vui lòng kiểm tra:
                    <ul className="mb-0 mt-1">
                      <li>Server backend đang chạy (port 4000)</li>
                      <li>MongoDB đã kết nối</li>
                      <li>Bạn đã đăng nhập với quyền Admin</li>
                      <li>Cơ sở dữ liệu có dữ liệu (users, posts, products)</li>
                    </ul>
                  </small>
                </>
              )}
            </Alert>
          </div>

          {/* Enhanced Statistics Cards - Cập nhật theo yêu cầu */}
          <div id="dashboard" className="mb-5">
            <h3 className="mb-4">📊 Tổng Quan Dashboard</h3>
            <Row className="g-4 mb-4">
              <Col md={3}>
                <Card className="text-center shadow-sm h-100" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-primary">{dashboardData.totalUsers}</div>
                    <div className="text-muted">Tổng Số User</div>
                    <Badge bg="success" className="mt-2">Tất cả thành viên</Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm h-100" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-success">{dashboardData.newUsersToday}</div>
                    <div className="text-muted">User Mới Hôm Nay</div>
                    <Badge bg="info" className="mt-2">Đăng ký mới</Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm h-100" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-warning">{dashboardData.totalProducts}</div>
                    <div className="text-muted">Tổng Số Sản Phẩm</div>
                    <Badge bg="warning" className="mt-2">Sản phẩm</Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm h-100" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-info">{dashboardData.totalPosts}</div>
                    <div className="text-muted">Tổng Số Bài Post</div>
                    <Badge bg="primary" className="mt-2">Bài viết</Badge>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-4">
              <Col md={3}>
                <Card className="text-center shadow-sm h-100" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-success">{dashboardData.activeUsers}</div>
                    <div className="text-muted">User Đang Truy Cập</div>
                    <small className="text-success">🟢 Đang online</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm h-100" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-primary">{dashboardData.todayPageViews}</div>
                    <div className="text-muted">Lượt Xem Hôm Nay</div>
                    <small className="text-primary">📈 Truy cập</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm h-100" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-warning">{realData.summary?.todayNewPosts || 0}</div>
                    <div className="text-muted">Bài Post Mới Hôm Nay</div>
                    <small className="text-warning">📝 Mới đăng</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm h-100" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-info">{realData.summary?.todayNewProducts || 0}</div>
                    <div className="text-muted">Sản Phẩm Mới Hôm Nay</div>
                    <small className="text-info">🆕 Mới thêm</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Google Analytics Section */}
          <div className="mb-5">
            <h3 className="mb-4">📈 Thống Kê Google Analytics</h3>
            
            {/* GA4 Data Status */}
            <Alert variant={analyticsData.pageViews ? "success" : "warning"} className="mb-4">
              {analyticsData.pageViews ? (
                <>
                  ✅ <strong>Dữ liệu GA4 đã được tải thành công!</strong>
                  <br />
                  <small>Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</small>
                </>
              ) : (
                <>
                  ⚠️ <strong>Đang tải dữ liệu GA4...</strong>
                  <br />
                  <small>Vui lòng đợi hoặc kiểm tra kết nối</small>
                </>
              )}
            </Alert>

            {/* GA4 Metrics Cards */}
            <Row className="g-4 mb-4">
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-primary">
                      {analyticsData.pageViews?.totalPageViews || 0}
                    </div>
                    <div className="text-muted">Tổng Lượt Xem</div>
                    <small className="text-primary">📊 Từ GA4</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-success">
                      {analyticsData.pageViews?.uniquePageViews || 0}
                    </div>
                    <div className="text-muted">Lượt Xem Duy Nhất</div>
                    <small className="text-success">👥 Người dùng</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-info">
                      {Math.floor((analyticsData.pageViews?.avgSessionDuration || 0) / 60)}p {(analyticsData.pageViews?.avgSessionDuration || 0) % 60}s
                    </div>
                    <div className="text-muted">Thời Gian TB</div>
                    <small className="text-info">⏱️ Phiên làm việc</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-warning">
                      {analyticsData.pageViews?.bounceRate || 0}%
                    </div>
                    <div className="text-muted">Tỷ Lệ Thoát</div>
                    <small className="text-warning">🚪 Rời trang</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Real-time Users */}
            <Row className="g-4 mb-4">
              <Col md={12}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                  <Card.Body>
                    <div className="display-4">🟢 {realTimeUsers}</div>
                    <div className="h5">Người dùng đang online</div>
                    <small>Dữ liệu real-time từ GA4</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Top Pages Table */}
          {analyticsData.topPages && analyticsData.topPages.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-4">🔝 Trang Phổ Biến (GA4)</h3>
              <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                <Card.Body>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Trang</th>
                        <th>Lượt Xem</th>
                        <th>Tỷ Lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topPages.map((page, index) => {
                        const totalViews = analyticsData.topPages.reduce((sum, p) => sum + (p.views || 0), 0);
                        const percentage = totalViews > 0 ? ((page.views || 0) / totalViews * 100).toFixed(1) : 0;
                        return (
                          <tr key={index}>
                            <td>
                              <code>{page.page}</code>
                            </td>
                            <td>
                              <strong>{(page.views || 0).toLocaleString()}</strong>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="progress flex-grow-1 me-2" style={{ height: "8px" }}>
                                  <div 
                                    className="progress-bar bg-primary" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <small className="text-muted">{percentage}%</small>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Demographics Charts */}
          {analyticsData.demographics && (
            <div className="mb-5">
              <h3 className="mb-4">🌍 Phân Tích Người Dùng (GA4)</h3>
              <Row className="g-4">
                {/* Countries */}
                {analyticsData.demographics.countries && analyticsData.demographics.countries.length > 0 && (
                  <Col md={6}>
                    <Card className="shadow-sm h-100" style={{ borderRadius: "15px" }}>
                      <Card.Header>
                        <h5>🌍 Quốc Gia</h5>
                      </Card.Header>
                      <Card.Body>
                        <Pie data={countryData} options={{ responsive: true, maintainAspectRatio: false }} height={250} />
                      </Card.Body>
                    </Card>
                  </Col>
                )}
                
                {/* Devices */}
                {analyticsData.demographics.devices && analyticsData.demographics.devices.length > 0 && (
                  <Col md={6}>
                    <Card className="shadow-sm h-100" style={{ borderRadius: "15px" }}>
                      <Card.Header>
                        <h5>📱 Thiết Bị</h5>
                      </Card.Header>
                      <Card.Body>
                        <Doughnut data={deviceData} options={{ responsive: true, maintainAspectRatio: false }} height={250} />
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            </div>
          )}

          {/* Browser Statistics */}
          {analyticsData.demographics?.browsers && analyticsData.demographics.browsers.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-4">🌐 Trình Duyệt (GA4)</h3>
              <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                <Card.Body>
                  <Row>
                    {analyticsData.demographics.browsers.map((browser, index) => (
                      <Col md={2} key={index} className="text-center mb-3">
                        <div className="display-6 text-primary">{browser.percentage}%</div>
                        <div className="text-muted">{browser.browser}</div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Real Data Section */}
          {realData.summary && (
            <div className="mb-5">
              <h3 className="mb-4">📋 Tổng Quan Dữ Liệu Trực Tiếp</h3>
              
              {/* Recent Posts */}
              {realData.recentPosts && realData.recentPosts.length > 0 && (
                <Row className="g-4 mb-4">
                  <Col md={8}>
                    <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                      <Card.Header>
                        <h5>📝 Bài Viết Gần Đây</h5>
                      </Card.Header>
                      <Card.Body>
                        <Table responsive striped>
                          <thead>
                            <tr>
                              <th>Tiêu Đề</th>
                              <th>Tác Giả</th>
                              <th>Ngày Tạo</th>
                              <th>Trạng Thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {realData.recentPosts.map((post, index) => (
                              <tr key={index}>
                                <td>
                                  <strong>{post.title}</strong>
                                  <br />
                                  <small className="text-muted">{post.content?.substring(0, 50)}...</small>
                                </td>
                                <td>
                                  {post.author?.username || post.author?.email || 'Không xác định'}
                                </td>
                                <td>
                                  {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td>
                                  <Badge bg="success">Hoạt động</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  {/* Top Categories */}
                  <Col md={4}>
                    <Card className="shadow-sm h-100" style={{ borderRadius: "15px" }}>
                      <Card.Header>
                        <h5>🏷️ Danh Mục Phổ Biến</h5>
                      </Card.Header>
                      <Card.Body>
                        {realData.topCategories && realData.topCategories.length > 0 ? (
                          <div>
                            {realData.topCategories.map((category, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted">{category._id}</span>
                                <Badge bg="primary">{category.count}</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted">Không có dữ liệu danh mục</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Registration Trend */}
              {realData.charts?.registrationTrend && (
                <Card className="shadow-sm mb-4" style={{ borderRadius: "15px" }}>
                  <Card.Header>
                    <h5>📈 Xu Hướng Đăng Ký Người Dùng (7 Ngày Qua)</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {realData.charts.registrationTrend.map((count, index) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (6 - index));
                        return (
                          <Col key={index} className="text-center">
                            <div className="display-6 text-primary">{count}</div>
                            <div className="text-muted">{date.toLocaleDateString('vi-VN', { weekday: 'short' })}</div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}

          
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;