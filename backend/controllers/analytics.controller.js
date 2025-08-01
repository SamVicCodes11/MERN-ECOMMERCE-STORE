import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

/**
 * Fetches overall analytics data for users, products, total sales, and revenue.
 */
export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesSummary = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesSummary[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

/**
 * Fetches daily sales and revenue data between a given date range.
 * Returns an array with each day's total sales and revenue.
 */
export const getDailySalesData = async (startDate, endDate) => {
  try {
    const salesPerDay = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const allDates = generateDateRange(startDate, endDate);

    return allDates.map((date) => {
      const found = salesPerDay.find((entry) => entry._id === date);
      return {
        date,
        sales: found?.sales || 0,
        revenue: found?.revenue || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching daily sales data:", error.message);
    throw error;
  }
};

/**
 * Generates an array of date strings (YYYY-MM-DD) between startDate and endDate.
 */
function generateDateRange(startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
