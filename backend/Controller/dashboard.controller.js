const User = require("../Model/user.model");
const Post = require("../Model/post.model");
const Product = require("../Model/product.model");
const { BannerProduct, BannerProductIds } = require("../Model/banner.model");
const path = require("path");

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
}

module.exports = new DashboardController(); 