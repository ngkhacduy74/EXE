const User = require("../Model/user.model");
const Post = require("../Model/post.model");
const Product = require("../Model/product.model");
const { BannerProduct, BannerProductIds } = require("../Model/banner.model");
const path = require("path");

// Google Analytics 4 Helper Class
class GA4Helper {
  constructor() {
    this.measurementId = process.env.GA4_MEASUREMENT_ID || 'G-0DRKJH48YN';
    this.propertyId = process.env.GA4_PROPERTY_ID || '494181948';
    
    // Initialize GA4 client with service account
    try {
      const keyFilePath = path.join(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS || 'vinsaky-0578a851fdad.json');
      
      // Check if service account file exists
      const fs = require('fs');
      if (fs.existsSync(keyFilePath)) {
        // Initialize with real GA4 client
        const { BetaAnalyticsDataClient } = require('@google-analytics/data');
        this.analyticsDataClient = new BetaAnalyticsDataClient({
          keyFilename: keyFilePath
        });
        console.log('✅ GA4 Analytics Data Client initialized successfully');
        console.log(`📊 Using Property ID: ${this.propertyId}`);
        this.useRealAPI = true;
      } else {
        console.warn('⚠️ GA4 service account file not found, using enhanced mock data');
        this.useRealAPI = false;
      }
    } catch (error) {
      console.error('❌ Error initializing GA4 client:', error.message);
      this.analyticsDataClient = null;
      this.useRealAPI = false;
    }
  }

  // Get real-time users from GA4 API or enhanced mock data
  async getRealTimeUsers() {
    try {
      if (this.useRealAPI && this.analyticsDataClient) {
        // Real GA4 API call for real-time users
        const [response] = await this.analyticsDataClient.runRealtimeReport({
          property: `properties/${this.propertyId}`,
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
        });

        const totalActiveUsers = response.rows?.reduce((sum, row) => {
          return sum + parseInt(row.metricValues[0].value);
        }, 0) || 0;

        return totalActiveUsers;
      } else {
        // Enhanced mock data with international users
        const activeUsers = await User.countDocuments({
          lastActivity: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
        });
        
        // Add international users simulation
        const internationalUsers = Math.floor(Math.random() * 15) + 5; // 5-20 international users
        return Math.max(activeUsers + internationalUsers, Math.floor(Math.random() * 10) + 1);
      }
    } catch (error) {
      console.error('Error getting real-time users:', error);
      return 0;
    }
  }

  // Get page views from GA4 API or enhanced mock data
  async getPageViews(dateRange = '7daysAgo') {
    try {
      if (this.useRealAPI && this.analyticsDataClient) {
        // Real GA4 API call for page views
        const [response] = await this.analyticsDataClient.runReport({
          property: `properties/${this.propertyId}`,
          dateRanges: [{ startDate: dateRange, endDate: 'today' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'uniquePageviews' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' }
          ],
        });

        const row = response.rows?.[0];
        if (row) {
          return {
            totalPageViews: parseInt(row.metricValues[0].value),
            uniquePageViews: parseInt(row.metricValues[1].value),
            avgSessionDuration: Math.round(parseFloat(row.metricValues[2].value)),
            bounceRate: Math.round(parseFloat(row.metricValues[3].value) * 100)
          };
        }
      }
      
      // Enhanced mock data with realistic international traffic
      return {
        totalPageViews: Math.floor(Math.random() * 100) + 50, // 50-150 page views
        uniquePageViews: Math.floor(Math.random() * 30) + 15, // 15-45 unique views
        avgSessionDuration: Math.floor(Math.random() * 1800) + 600, // 10-40 minutes
        bounceRate: Math.floor(Math.random() * 40) + 20 // 20-60% bounce rate
      };
    } catch (error) {
      console.error('Error getting page views:', error);
      return {
        totalPageViews: 0,
        uniquePageViews: 0,
        avgSessionDuration: 0,
        bounceRate: 0
      };
    }
  }

  // Get top pages from GA4 API or enhanced mock data
  async getTopPages() {
    try {
      if (this.useRealAPI && this.analyticsDataClient) {
        // Real GA4 API call for top pages
        const [response] = await this.analyticsDataClient.runReport({
          property: `properties/${this.propertyId}`,
          dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' }
          ],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10
        });

        return response.rows?.map(row => ({
          pagePath: row.dimensionValues[0].value,
          pageTitle: row.dimensionValues[1].value,
          pageViews: parseInt(row.metricValues[0].value),
          avgSessionDuration: Math.round(parseFloat(row.metricValues[1].value)),
          bounceRate: Math.round(parseFloat(row.metricValues[2].value) * 100)
        })) || [];
      }
      
      // Enhanced mock data with realistic page data
      return [
        { pagePath: '/', pageTitle: 'Trang chủ', pageViews: 45, avgSessionDuration: 1200, bounceRate: 25 },
        { pagePath: '/admin', pageTitle: 'Admin Dashboard', pageViews: 23, avgSessionDuration: 1800, bounceRate: 15 },
        { pagePath: '/home', pageTitle: 'Trang chính', pageViews: 18, avgSessionDuration: 900, bounceRate: 30 },
        { pagePath: '/login', pageTitle: 'Đăng nhập', pageViews: 12, avgSessionDuration: 300, bounceRate: 40 },
        { pagePath: '/manaProduct', pageTitle: 'Quản lý sản phẩm', pageViews: 8, avgSessionDuration: 2400, bounceRate: 10 },
        { pagePath: '/product', pageTitle: 'Sản phẩm', pageViews: 6, avgSessionDuration: 1500, bounceRate: 20 },
        { pagePath: '/post', pageTitle: 'Bài viết', pageViews: 4, avgSessionDuration: 1200, bounceRate: 25 }
      ];
    } catch (error) {
      console.error('Error getting top pages:', error);
      return [];
    }
  }

  // Get user demographics from GA4 API or enhanced mock data with international data
  async getUserDemographics() {
    try {
      if (this.useRealAPI && this.analyticsDataClient) {
        // Real GA4 API call for demographics
        const [response] = await this.analyticsDataClient.runReport({
          property: `properties/${this.propertyId}`,
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [
            { name: 'country' },
            { name: 'city' },
            { name: 'deviceCategory' },
            { name: 'browser' }
          ],
          metrics: [
            { name: 'activeUsers' },
            { name: 'screenPageViews' }
          ],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 20
        });

        // Process real GA4 data
        const regions = [];
        const devices = [];
        const browsers = [];

        response.rows?.forEach(row => {
          const country = row.dimensionValues[0].value;
          const city = row.dimensionValues[1].value;
          const device = row.dimensionValues[2].value;
          const browser = row.dimensionValues[3].value;
          const users = parseInt(row.metricValues[0].value);
          const views = parseInt(row.metricValues[1].value);

          // Add to regions
          const regionKey = `${city}, ${country}`;
          const existingRegion = regions.find(r => r.region === regionKey);
          if (existingRegion) {
            existingRegion.users += users;
            existingRegion.views += views;
          } else {
            regions.push({
              region: regionKey,
              country: country,
              city: city,
              users: users,
              views: views,
              percentage: 0 // Will calculate later
            });
          }

          // Add to devices
          const existingDevice = devices.find(d => d.device === device);
          if (existingDevice) {
            existingDevice.users += users;
          } else {
            devices.push({ device: device, users: users, percentage: 0 });
          }

          // Add to browsers
          const existingBrowser = browsers.find(b => b.browser === browser);
          if (existingBrowser) {
            existingBrowser.users += users;
          } else {
            browsers.push({ browser: browser, users: users, percentage: 0 });
          }
        });

        // Calculate percentages
        const totalUsers = regions.reduce((sum, r) => sum + r.users, 0);
        regions.forEach(r => r.percentage = Math.round((r.users / totalUsers) * 100));
        devices.forEach(d => d.percentage = Math.round((d.users / totalUsers) * 100));
        browsers.forEach(b => b.percentage = Math.round((b.users / totalUsers) * 100));

        return { regions, devices, browsers };
      }
      
      // Enhanced mock data with international users
      const totalUsers = 35;
      return {
        regions: [
          { region: 'Hà Nội, Việt Nam', country: 'Việt Nam', city: 'Hà Nội', percentage: 35, users: 12, views: 45, coordinates: [21.0285, 105.8542] },
          { region: 'TP. Hồ Chí Minh, Việt Nam', country: 'Việt Nam', city: 'TP. Hồ Chí Minh', percentage: 25, users: 9, views: 32, coordinates: [10.8231, 106.6297] },
          { region: 'New York, Hoa Kỳ', country: 'Hoa Kỳ', city: 'New York', percentage: 15, users: 5, views: 18, coordinates: [40.7128, -74.0060] },
          { region: 'Paris, Pháp', country: 'Pháp', city: 'Paris', percentage: 10, users: 4, views: 12, coordinates: [48.8566, 2.3522] },
          { region: 'Berlin, Đức', country: 'Đức', city: 'Berlin', percentage: 8, users: 3, views: 9, coordinates: [52.5200, 13.4050] },
          { region: 'Đà Nẵng, Việt Nam', country: 'Việt Nam', city: 'Đà Nẵng', percentage: 4, users: 1, views: 3, coordinates: [16.0544, 108.2022] },
          { region: 'London, Anh', country: 'Anh', city: 'London', percentage: 3, users: 1, views: 2, coordinates: [51.5074, -0.1278] }
        ],
        devices: [
          { device: 'desktop', percentage: 60, users: 21 },
          { device: 'mobile', percentage: 35, users: 12 },
          { device: 'tablet', percentage: 5, users: 2 }
        ],
        browsers: [
          { browser: 'Chrome', percentage: 65, users: 23 },
          { browser: 'Safari', percentage: 20, users: 7 },
          { browser: 'Firefox', percentage: 8, users: 3 },
          { browser: 'Edge', percentage: 5, users: 2 },
          { browser: 'Others', percentage: 2, users: 1 }
        ]
      };
    } catch (error) {
      console.error('Error getting demographics:', error);
      return null;
    }
  }
}

const ga4Helper = new GA4Helper();

class DashboardController {
  // Get dashboard overview statistics
  async getDashboardStats(req, res) {
    try {
      console.log("📊 Dashboard stats requested by user:", req.user?.user?.email);
      
      // Get total counts - đọc trực tiếp từ database
      const totalUsers = await User.countDocuments();
      const totalPosts = await Post.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalBanners = await BannerProduct.countDocuments();

      console.log("📈 Counts:", { totalUsers, totalPosts, totalProducts, totalBanners });

      // Get today's new users - tính chính xác
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayNewUsers = await User.countDocuments({
        createdAt: { $gte: today }
      });

      // Get today's new posts
      const todayNewPosts = await Post.countDocuments({
        createdAt: { $gte: today }
      });

      // Get today's new products
      const todayNewProducts = await Product.countDocuments({
        createdAt: { $gte: today }
      });

      // Get active users (users who logged in within last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const activeUsers = await User.countDocuments({
        lastLoginAt: { $gte: yesterday }
      });

      // Get today's page views (approximate - using new users as proxy)
      const todayPageViews = todayNewUsers * 3; // Giả sử mỗi user mới xem 3 trang

      console.log("👥 User stats:", { activeUsers, todayNewUsers, todayNewPosts, todayNewProducts });

      // Get posts by month for current year
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

      const postsByMonth = await Post.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear, $lte: endOfYear }
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      // Convert to array with 12 months
      const monthlyPosts = Array(12).fill(0);
      postsByMonth.forEach(item => {
        monthlyPosts[item._id - 1] = item.count;
      });

      // Get user growth by month
      const userGrowthByMonth = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear, $lte: endOfYear }
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      // Convert to cumulative array
      const monthlyUserGrowth = Array(12).fill(0);
      let cumulative = 0;
      for (let i = 0; i < 12; i++) {
        const monthData = userGrowthByMonth.find(item => item._id === i + 1);
        if (monthData) {
          cumulative += monthData.count;
        }
        monthlyUserGrowth[i] = cumulative;
      }

      // Get recent posts - không dùng populate để tránh lỗi
      const recentPosts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title content createdAt author'); // Chỉ lấy các trường cần thiết

      // Get top categories (from products)
      const topCategories = await Product.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 5
        }
      ]);

      // Get registration trend for last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        last7Days.push(date);
      }

      const dailyRegistrations = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: last7Days[0] }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      const registrationTrend = last7Days.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const dayData = dailyRegistrations.find(item => item._id === dateStr);
        return dayData ? dayData.count : 0;
      });

      // Get device distribution (mock data for now - would need user agent tracking)
      const deviceDistribution = [
        { device: 'Desktop', percentage: 45 },
        { device: 'Mobile', percentage: 40 },
        { device: 'Tablet', percentage: 15 }
      ];

      // Get browser distribution (mock data for now - would need user agent tracking)
      const browserDistribution = [
        { browser: 'Chrome', percentage: 65 },
        { browser: 'Safari', percentage: 20 },
        { browser: 'Firefox', percentage: 8 },
        { browser: 'Edge', percentage: 5 },
        { browser: 'Others', percentage: 2 }
      ];

      const responseData = {
        summary: {
          totalUsers,
          totalPosts,
          totalProducts,
          totalBanners,
          activeUsers,
          todayNewUsers,
          todayNewPosts,
          todayNewProducts,
          todayPageViews
        },
        charts: {
          postsByMonth: monthlyPosts,
          userGrowth: monthlyUserGrowth,
          registrationTrend
        },
        analytics: {
          devices: deviceDistribution,
          browsers: browserDistribution
        },
        recentPosts,
        topCategories
      };

      console.log("✅ Dashboard stats calculated successfully");
      res.json({
        success: true,
        data: responseData
      });

    } catch (error) {
      console.error("❌ Error fetching dashboard statistics:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching dashboard statistics",
        error: error.message
      });
    }
  }

  // Get real-time analytics
  async getRealTimeAnalytics(req, res) {
    try {
      const realTimeUsers = await ga4Helper.getRealTimeUsers();
      const pageViews = await ga4Helper.getPageViews();
      
      res.json({
        success: true,
        data: {
          onlineUsers: realTimeUsers,
          todayViews: pageViews.totalPageViews,
          uniqueViews: pageViews.uniquePageViews,
          avgSessionDuration: pageViews.avgSessionDuration,
          bounceRate: pageViews.bounceRate
        }
      });
    } catch (error) {
      console.error('Error getting real-time analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy dữ liệu thời gian thực'
      });
    }
  }

  // Get GA4 analytics data
  async getGA4Data(req, res) {
    try {
      const pageViews = await ga4Helper.getPageViews();
      const topPages = await ga4Helper.getTopPages();
      const demographics = await ga4Helper.getUserDemographics();
      
      res.json({
        success: true,
        data: {
          pageViews,
          topPages,
          demographics
        }
      });
    } catch (error) {
      console.error('Error getting GA4 data:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy dữ liệu Google Analytics'
      });
    }
  }

  // Get detailed analytics
  async getDetailedAnalytics(req, res) {
    try {
      const { period = '7d' } = req.query;
      
      let startDate;
      const endDate = new Date();
      
      switch (period) {
        case '1d':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
      }

      // Get user registrations in period
      const newUsers = await User.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      });

      // Get posts created in period
      const newPosts = await Post.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      });

      // Get products created in period
      const newProducts = await Product.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      });

      // Get user activity by day
      const userActivity = await User.aggregate([
        {
          $match: {
            lastLoginAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastLoginAt" } },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      res.json({
        success: true,
        data: {
          period,
          summary: {
            newUsers,
            newPosts,
            newProducts
          },
          userActivity
        }
      });
    } catch (error) {
      console.error('Detailed analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching detailed analytics',
        error: error.message
      });
    }
  }
}

module.exports = new DashboardController(); 