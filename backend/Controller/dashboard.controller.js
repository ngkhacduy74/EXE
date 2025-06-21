const User = require("../Model/user.model");
const Post = require("../Model/post.model");
const Product = require("../Model/product.model");
const Banner = require("../Model/banner.model");

class DashboardController {
  // Get dashboard overview statistics
  async getDashboardStats(req, res) {
    try {
      console.log("📊 Dashboard stats requested by user:", req.user?.user?.email);
      
      // Get total counts
      const totalUsers = await User.countDocuments();
      const totalPosts = await Post.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalBanners = await Banner.countDocuments();

      console.log("📈 Counts:", { totalUsers, totalPosts, totalProducts, totalBanners });

      // Get active users (users who logged in within last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const activeUsers = await User.countDocuments({
        lastLoginAt: { $gte: yesterday }
      });

      // Get today's new users
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayNewUsers = await User.countDocuments({
        createdAt: { $gte: today }
      });

      console.log("👥 User stats:", { activeUsers, todayNewUsers });

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

      // Get recent posts
      const recentPosts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('author', 'username email');

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

      // Get user registration trend (last 7 days)
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
          todayPageViews: todayNewUsers // Using new users as a proxy for page views for now
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
      console.log("📊 Response data summary:", {
        totalUsers: responseData.summary.totalUsers,
        totalPosts: responseData.summary.totalPosts,
        totalProducts: responseData.summary.totalProducts,
        totalBanners: responseData.summary.totalBanners
      });

      res.json({
        success: true,
        data: responseData
      });
    } catch (error) {
      console.error('❌ Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard statistics',
        error: error.message
      });
    }
  }

  // Get real-time analytics
  async getRealTimeAnalytics(req, res) {
    try {
      // Get users online in last 5 minutes
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      
      const onlineUsers = await User.countDocuments({
        lastActivityAt: { $gte: fiveMinutesAgo }
      });

      // Get today's new users
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayNewUsers = await User.countDocuments({
        createdAt: { $gte: today }
      });

      // Get today's new posts
      const todayNewPosts = await Post.countDocuments({
        createdAt: { $gte: today }
      });

      // Calculate conversion rate based on actual data (placeholder for future implementation)
      const conversionRate = 0; // Will be calculated when e-commerce features are added

      res.json({
        success: true,
        data: {
          onlineUsers,
          todayViews: todayNewUsers, // Using new users as a proxy for views
          conversionRate
        }
      });
    } catch (error) {
      console.error('Real-time analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching real-time analytics',
        error: error.message
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