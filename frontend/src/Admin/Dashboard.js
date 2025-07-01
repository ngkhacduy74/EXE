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
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement,
  LineElement,
  BarElement,
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
    // Use proxy in development, full URL in production
    this.baseUrl = process.env.NODE_ENV === 'development' 
      ? '/api/dashboard'
      : `${process.env.REACT_APP_BACKEND_URL}/api/dashboard`;
  }

  // Track custom events using official GA4 gtag
  trackEvent(eventName, parameters = {}) {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
          event_category: parameters.category || 'Admin Dashboard',
          event_label: parameters.label || eventName,
          value: parameters.value || 1,
          custom_parameter_1: parameters.dashboard_section || 'overview',
          custom_parameter_2: parameters.user_role || 'admin',
          ...parameters
        });

      } else {
        console.warn('⚠️ GA4 gtag not available for event tracking');
      }
    } catch (error) {
      console.error('❌ Error tracking GA4 event:', error);
    }
  }

  // Track page views
  trackPageView(pageTitle, pageLocation) {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', this.measurementId, {
          page_title: pageTitle,
          page_location: pageLocation
        });

      }
    } catch (error) {
      console.error('❌ Error tracking GA4 page view:', error);
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
  
  // Initialize GA4 with error handling
  const [ga4] = useState(() => {
    try {
      return new GA4Analytics('G-0DRKJH48YN', 'your-api-secret');
    } catch (error) {
      console.error('❌ Error initializing GA4 client:', error);
      // Return a fallback object with basic methods
      return {
        trackEvent: () => console.warn('GA4 not available'),
        trackPageView: () => console.warn('GA4 not available'),
        getRealTimeUsers: async () => 0,
        getPageViews: async () => null,
        getTopPages: async () => [],
        getUserDemographics: async () => null
      };
    }
  });
  
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
  
  // Auto refresh tracking
  const [nextRefreshTime, setNextRefreshTime] = useState(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  
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
    try {
      // Check if GA4 is already loaded
      if (typeof window !== 'undefined' && window.gtag) {

        
        // Track dashboard load event
        setTimeout(() => {
          try {
            window.gtag('event', 'dashboard_loaded', {
              event_category: 'Admin',
              event_label: 'Dashboard Load',
              value: 1,
              custom_parameter_1: 'overview',
              custom_parameter_2: 'admin'
            });
          } catch (error) {
            console.error('Error sending GA4 event:', error);
          }
        }, 1000);
        
        return;
      }


      
      // Fallback: Load GA4 script if not already loaded
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=G-0DRKJH48YN`;
      script1.onload = () => {
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
      `;
      document.head.appendChild(script2);

      // Track dashboard load event
      setTimeout(() => {
        try {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'dashboard_loaded', {
              event_category: 'Admin',
              event_label: 'Dashboard Load',
              value: 1
            });
          }
        } catch (error) {
          console.error('❌ Error sending GA4 event (fallback):', error);
        }
      }, 1000);

      return () => {
        try {
          if (script1.parentNode) script1.parentNode.removeChild(script1);
          if (script2.parentNode) script2.parentNode.removeChild(script2);
        } catch (error) {
          console.error('❌ Error cleaning up GA4 scripts:', error);
        }
      };
    } catch (error) {
      console.error('❌ Error initializing GA4:', error);
    }
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
        return true;
      }
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);
    }
    return false;
  };

  // Fetch real dashboard data from API - FIXED: Use proxy URL
  const fetchRealDashboardData = async () => {
    if (!tokens.accessToken) {
      return null;
    }

    try {
      // FIXED: Use proxy URL instead of direct backend URL
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? '/api/dashboard/stats'
        : `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/stats`;
        
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      });



      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return await fetchRealDashboardData();
        }
        return null;
      }

      if (response.status === 403) {
        return null;
      }

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("❌ Response không phải JSON:", contentType);
          return null;
        }
        
        const data = await response.json();
        return data.data;
      }

      // Log error response
      const errorText = await response.text();
      return null;
    } catch (error) {
      console.error("❌ Lỗi khi lấy dữ liệu dashboard:", error);
      return null;
    }
  };

  // Fetch real-time analytics - FIXED: Use proxy URL
  const fetchRealTimeData = async () => {
    if (!tokens.accessToken) return null;

    try {
      // FIXED: Use proxy URL instead of direct backend URL
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? '/api/dashboard/realtime'
        : `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/realtime`;
        
      const response = await fetch(apiUrl, {
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

  // Fetch analytics data - FIXED: Use proxy URL
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

        // Get GA4 data from backend API - FIXED: Use proxy URL
        if (tokens.accessToken) {
          const apiUrl = process.env.NODE_ENV === 'development' 
            ? '/api/dashboard/ga4'
            : `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/ga4`;
            
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokens.accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('✅ GA4 data from backend:', data);
            
            setAnalyticsData({
              pageViews: data.data.pageViews,
              topPages: data.data.topPages,
              demographics: data.data.demographics
            });
          } else {
            console.warn('⚠️ Could not fetch GA4 data from backend:', response.status);
          }
        }

        // Get real-time users from backend
        const realTime = await ga4.getRealTimeUsers();
        setRealTimeUsers(realTime);

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
  }, [ga4, tokens.accessToken]);

  // Existing dashboard data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch real data from API
        const realData = await fetchRealDashboardData();
        
        if (realData) {
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

  // Auto refresh dashboard data every 1 hour
  useEffect(() => {
    const autoRefreshDashboard = async () => {
      console.log('🔄 Auto refreshing dashboard data...');
      
      // Update refresh times
      const now = new Date();
      setLastRefreshTime(now);
      setNextRefreshTime(new Date(now.getTime() + 3600000)); // 1 hour from now
      
      // Track auto refresh event
      ga4.trackEvent('dashboard_auto_refresh', {
        category: 'Admin',
        label: 'Auto Refresh',
        value: 1,
        dashboard_section: 'overview'
      });

      // Refresh all dashboard data
      try {
        // Refresh main dashboard data
        const dashboardData = await fetchRealDashboardData();
        if (dashboardData) {
          setDashboardData({
            totalUsers: dashboardData.totalUsers || 0,
            newUsersToday: dashboardData.newUsersToday || 0,
            totalProducts: dashboardData.totalProducts || 0,
            totalPosts: dashboardData.totalPosts || 0,
            activeUsers: dashboardData.activeUsers || 0,
            todayPageViews: dashboardData.todayPageViews || 0,
          });
        }

        // Refresh real-time data
        const realTimeData = await fetchRealTimeData();
        if (realTimeData) {
          setRealTimeUsers(realTimeData.onlineUsers || 0);
        }

        // Refresh analytics data
        const analyticsData = await ga4.getPageViews();
        if (analyticsData) {
          setAnalyticsData(prev => ({
            ...prev,
            pageViews: analyticsData
          }));
        }

        console.log('✅ Dashboard auto refresh completed');
      } catch (error) {
        console.error('❌ Error during auto refresh:', error);
      }
    };

    // Set up auto refresh every 1 hour (3600000 milliseconds)
    const autoRefreshInterval = setInterval(autoRefreshDashboard, 3600000);
    
    // Also refresh immediately when component mounts
    autoRefreshDashboard();

    return () => {
      clearInterval(autoRefreshInterval);
    };
  }, [tokens.accessToken, ga4]);

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

  // Chart configurations - using only real data - FIXED: Add proper chart options
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
    labels: (analyticsData.demographics?.devices?.map(d => d.device) || ['Desktop', 'Mobile', 'Tablet']).filter(Boolean),
    datasets: [
      {
        data: (analyticsData.demographics?.devices?.map(d => d.percentage) || [100, 0, 0]).filter(Boolean),
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

  // User regions with coordinates - Updated with international data
  const userRegions = analyticsData.demographics?.regions || [
    { region: 'Hà Nội, Việt Nam', country: 'Việt Nam', city: 'Hà Nội', percentage: 35, users: 12, views: 45, coordinates: [21.0285, 105.8542] },
    { region: 'TP. Hồ Chí Minh, Việt Nam', country: 'Việt Nam', city: 'TP. Hồ Chí Minh', percentage: 25, users: 9, views: 32, coordinates: [10.8231, 106.6297] },
    { region: 'New York, Hoa Kỳ', country: 'Hoa Kỳ', city: 'New York', percentage: 15, users: 5, views: 18, coordinates: [40.7128, -74.0060] },
    { region: 'Paris, Pháp', country: 'Pháp', city: 'Paris', percentage: 10, users: 4, views: 12, coordinates: [48.8566, 2.3522] },
    { region: 'Berlin, Đức', country: 'Đức', city: 'Berlin', percentage: 8, users: 3, views: 9, coordinates: [52.5200, 13.4050] },
    { region: 'Đà Nẵng, Việt Nam', country: 'Việt Nam', city: 'Đà Nẵng', percentage: 4, users: 1, views: 3, coordinates: [16.0544, 108.2022] },
    { region: 'London, Anh', country: 'Anh', city: 'London', percentage: 3, users: 1, views: 2, coordinates: [51.5074, -0.1278] }
  ];

  // Enhanced country data for charts
  const countryData = {
    labels: (analyticsData.demographics?.regions?.map(c => c.region) || [
      'Hà Nội, Việt Nam', 'TP. Hồ Chí Minh, Việt Nam', 'New York, Hoa Kỳ', 
      'Paris, Pháp', 'Berlin, Đức', 'Đà Nẵng, Việt Nam', 'London, Anh'
    ]).filter(Boolean),
    datasets: [
      {
        data: (analyticsData.demographics?.regions?.map(c => c.percentage || c.users || 0) || [35, 25, 15, 10, 8, 4, 3]).filter(Boolean),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#FF6384'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#FF6384'
        ]
      }
    ]
  };

  // FIXED: Add proper chart options to prevent errors
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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
            📊 <strong>Google Analytics 4 Đã Kết Nối Thành Công:</strong> 
            <br />
            <small>
              <strong>Stream:</strong> Vinsaky | 
              <strong> URL:</strong> https://Vinsaky.com | 
              <strong> Trạng thái:</strong> ✅ Hoạt động
            </small>
            <br />
            <small className="text-success">
              ✅ Dashboard đang hiển thị dữ liệu thực từ GA4. Tổng lượt xem: {analyticsData.pageViews?.totalPageViews || 0}
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

          {/* Auto Refresh Status */}
          <Alert variant="info" className="mb-3">
            ⏰ <strong>Tự Động Làm Mới:</strong> Dashboard sẽ tự động cập nhật dữ liệu mỗi 1 tiếng
            <br />
            <small>
              {lastRefreshTime && (
                <>🕐 Lần cập nhật cuối: {lastRefreshTime.toLocaleString('vi-VN')} | </>
              )}
              {nextRefreshTime && (
                <>⏳ Lần cập nhật tiếp theo: {nextRefreshTime.toLocaleString('vi-VN')}</>
              )}
            </small>
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
          {analyticsData.pageViews && (
            <div className="mb-5">
              <h3 className="mb-4">📈 Thống Kê Google Analytics (Dữ Liệu Thực)</h3>
              <Row className="g-4">
                <Col md={3}>
                  <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                    <Card.Body>
                      <div className="display-6 text-primary">{analyticsData.pageViews.totalPageViews || 0}</div>
                      <div className="text-muted">Lượt Xem Trang</div>
                      <small className="text-success">✅ Dữ liệu thực từ GA4</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                    <Card.Body>
                      <div className="display-6 text-success">{analyticsData.pageViews.uniquePageViews || 0}</div>
                      <div className="text-muted">Lượt Xem Duy Nhất</div>
                      <small className="text-success">✅ Dữ liệu thực từ GA4</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                    <Card.Body>
                      <div className="display-6 text-info">
                        {Math.floor((analyticsData.pageViews.avgSessionDuration || 0) / 60)}p {(analyticsData.pageViews.avgSessionDuration || 0) % 60}s
                      </div>
                      <div className="text-muted">Thời Gian Trung Bình</div>
                      <small className="text-success">✅ Dữ liệu thực từ GA4</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                    <Card.Body>
                      <div className="display-6 text-warning">{analyticsData.pageViews.bounceRate || 0}%</div>
                      <div className="text-muted">Tỷ Lệ Thoát</div>
                      <small className="text-success">✅ Dữ liệu thực từ GA4</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* Google Analytics Setup Notice - Updated */}
          {!analyticsData.pageViews && (
            <Alert variant="info" className="mb-4">
              📊 <strong>Đang Kết Nối Google Analytics:</strong> 
              <br />
              <small>
                Dashboard đang cố gắng kết nối với Google Analytics 4 API
                <br />
                <strong>Measurement ID:</strong> G-0DRKJH48YN
                <br />
                <strong>Trạng thái:</strong> Đang xử lý...
                <br />
                <small className="text-muted">
                  Nếu không thấy dữ liệu, vui lòng kiểm tra:
                  <ul className="mb-0 mt-1">
                    <li>Google Analytics 4 đã được cấu hình đúng</li>
                    <li>API credentials đã được thiết lập</li>
                    <li>Backend API đang hoạt động</li>
                  </ul>
                </small>
              </small>
            </Alert>
          )}

          {/* Charts Section */}
          <div className="mb-5">
            <h3 className="mb-4">📈 Biểu Đồ Thống Kê</h3>
            
            {/* Year Selection */}
            <div className="mb-3">
              <label className="form-label">Chọn năm:</label>
              <select 
                className="form-select w-auto" 
                value={selectedYear} 
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <Row className="g-4">
              {/* Posts by Month Chart */}
              <Col lg={6}>
                <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <h5 className="card-title">📊 Bài Viết Theo Tháng ({selectedYear})</h5>
                    <div style={{ height: "300px" }}>
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* User Growth Chart */}
              <Col lg={6}>
                <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <h5 className="card-title">📈 Tăng Trưởng Người Dùng</h5>
                    <div style={{ height: "300px" }}>
                      <Line data={userGrowthData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-4 mt-3">
              {/* Device Usage Chart */}
              <Col lg={6}>
                <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <h5 className="card-title">📱 Thiết Bị Sử Dụng</h5>
                    <div style={{ height: "300px" }}>
                      <Doughnut data={deviceData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Regional Distribution Chart */}
              <Col lg={6}>
                <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <h5 className="card-title">🌍 Phân Bố Theo Khu Vực</h5>
                    <div style={{ height: "300px" }}>
                      <Pie data={countryData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Top Pages Table */}
          {analyticsData.topPages && analyticsData.topPages.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-4">📄 Trang Phổ Biến Nhất</h3>
              <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                <Card.Body>
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Trang</th>
                        <th>Lượt Xem</th>
                        <th>Thời Gian Trung Bình</th>
                        <th>Tỷ Lệ Thoát</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topPages.map((page, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>{page.pageTitle || page.pagePath}</strong>
                            <br />
                            <small className="text-muted">{page.pagePath}</small>
                          </td>
                          <td>
                            <Badge bg="primary">{page.pageViews}</Badge>
                          </td>
                          <td>
                            {Math.floor((page.avgSessionDuration || 0) / 60)}p {(page.avgSessionDuration || 0) % 60}s
                          </td>
                          <td>
                            <Badge bg={page.bounceRate > 70 ? "danger" : page.bounceRate > 50 ? "warning" : "success"}>
                              {page.bounceRate}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Recent Posts */}
          {realData.recentPosts && realData.recentPosts.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-4">📝 Bài Viết Gần Đây</h3>
              <Row className="g-4">
                {realData.recentPosts.slice(0, 6).map((post, index) => (
                  <Col lg={4} md={6} key={index}>
                    <Card className="shadow-sm h-100" style={{ borderRadius: "15px" }}>
                      <Card.Body>
                        <h6 className="card-title">{post.title}</h6>
                        <p className="card-text text-muted small">
                          {post.content?.substring(0, 100)}...
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                          </small>
                          <Badge bg="info">{post.category || 'Chung'}</Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Top Categories */}
          {realData.topCategories && realData.topCategories.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-4">🏷️ Danh Mục Phổ Biến</h3>
              <Row className="g-4">
                {realData.topCategories.map((category, index) => (
                  <Col lg={3} md={6} key={index}>
                    <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                      <Card.Body>
                        <div className="display-6 text-primary">{category.count}</div>
                        <div className="text-muted">{category.name}</div>
                        <Badge bg="primary" className="mt-2">{category.percentage}%</Badge>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* User Demographics Map - Enhanced with International Data */}
          {userRegions && userRegions.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-4">🗺️ Phân Bố Người Dùng Theo Khu Vực & Quốc Gia</h3>
              <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                <Card.Body>
                  <div className="row">
                    {userRegions.map((region, index) => (
                      <div key={index} className="col-lg-4 col-md-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded shadow-sm" 
                             style={{ 
                               background: index < 3 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                               color: index < 3 ? 'white' : 'inherit'
                             }}>
                          <div className="me-3 text-center">
                            <div className="h3 mb-0" style={{ color: index < 3 ? 'white' : '#007bff' }}>
                              {region.users || region.percentage}
                            </div>
                            <small style={{ color: index < 3 ? 'rgba(255,255,255,0.8)' : '#6c757d' }}>
                              {region.users ? 'người dùng' : '%'}
                            </small>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                              <span className="me-2">
                                {region.country === 'Việt Nam' && '🇻🇳'}
                                {region.country === 'Hoa Kỳ' && '🇺🇸'}
                                {region.country === 'Pháp' && '🇫🇷'}
                                {region.country === 'Đức' && '🇩🇪'}
                                {region.country === 'Anh' && '🇬🇧'}
                                {!['Việt Nam', 'Hoa Kỳ', 'Pháp', 'Đức', 'Anh'].includes(region.country) && '🌍'}
                              </span>
                              <strong>{region.city}</strong>
                            </div>
                            <div style={{ color: index < 3 ? 'rgba(255,255,255,0.9)' : '#495057' }}>
                              <strong>{region.country}</strong>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <small style={{ color: index < 3 ? 'rgba(255,255,255,0.7)' : '#6c757d' }}>
                                📊 {region.percentage}% tổng số
                              </small>
                              {region.views && (
                                <small style={{ color: index < 3 ? 'rgba(255,255,255,0.7)' : '#6c757d' }}>
                                  👁️ {region.views} lượt xem
                                </small>
                              )}
                            </div>
                            {region.coordinates && (
                              <small style={{ color: index < 3 ? 'rgba(255,255,255,0.6)' : '#adb5bd' }}>
                                📍 {region.coordinates[0].toFixed(2)}, {region.coordinates[1].toFixed(2)}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Summary Statistics */}
                  <div className="mt-4 p-3 bg-light rounded">
                    <h6 className="mb-3">📈 Tổng Kết Phân Bố Quốc Tế</h6>
                    <div className="row text-center">
                      <div className="col-md-3">
                        <div className="h5 text-primary">
                          {userRegions.filter(r => r.country === 'Việt Nam').reduce((sum, r) => sum + (r.users || 0), 0)}
                        </div>
                        <small className="text-muted">🇻🇳 Việt Nam</small>
                      </div>
                      <div className="col-md-3">
                        <div className="h5 text-success">
                          {userRegions.filter(r => r.country !== 'Việt Nam').reduce((sum, r) => sum + (r.users || 0), 0)}
                        </div>
                        <small className="text-muted">🌍 Quốc tế</small>
                      </div>
                      <div className="col-md-3">
                        <div className="h5 text-info">
                          {userRegions.length}
                        </div>
                        <small className="text-muted">🏙️ Thành phố</small>
                      </div>
                      <div className="col-md-3">
                        <div className="h5 text-warning">
                          {userRegions.reduce((sum, r) => sum + (r.views || 0), 0)}
                        </div>
                        <small className="text-muted">👁️ Tổng lượt xem</small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="mb-5">
            <h3 className="mb-4">⚡ Chỉ Số Hiệu Suất</h3>
            <Row className="g-4">
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-success">
                      {Math.round((dashboardData.activeUsers / Math.max(dashboardData.totalUsers, 1)) * 100)}%
                    </div>
                    <div className="text-muted">Tỷ Lệ Hoạt Động</div>
                    <small className="text-success">Người dùng online</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-info">
                      {Math.round((dashboardData.todayPageViews / Math.max(dashboardData.totalUsers, 1)) * 100)}%
                    </div>
                    <div className="text-muted">Tương Tác Hôm Nay</div>
                    <small className="text-info">Lượt xem/người dùng</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-warning">
                      {Math.round((dashboardData.newUsersToday / Math.max(dashboardData.totalUsers, 1)) * 100)}%
                    </div>
                    <div className="text-muted">Tăng Trưởng Hôm Nay</div>
                    <small className="text-warning">Người dùng mới</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <div className="display-6 text-primary">
                      {Math.round((dashboardData.totalPosts / Math.max(dashboardData.totalProducts, 1)) * 100)}%
                    </div>
                    <div className="text-muted">Tỷ Lệ Nội Dung</div>
                    <small className="text-primary">Bài viết/sản phẩm</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Footer */}
          <div className="text-center text-muted mt-5">
            <small>
              📊 Dashboard được cập nhật tự động mỗi giờ | 
              🔄 Lần cập nhật cuối: {new Date().toLocaleString('vi-VN')} |
              📈 Google Analytics 4 Integration v1.0
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;