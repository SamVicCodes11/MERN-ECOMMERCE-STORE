import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const transition = { duration: 0.5, delay: 0.2 };

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [dailySalesData, setDailySalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData ?? {});
        setDailySalesData(response.data.dailySalesData ?? []);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 py-8">Loading analytics...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <CardGrid data={analyticsData} />
      <ChartPanel data={dailySalesData} />
    </div>
  );
};

export default AnalyticsTab;

// ------------------ Card Grid ------------------

const CardGrid = ({ data }) => {
  const cards = [
    {
      title: "Total Users",
      value: data.users?.toLocaleString() ?? "0",
      icon: Users,
      color: "from-emerald-500 to-teal-700",
    },
    {
      title: "Total Products",
      value: data.products?.toLocaleString() ?? "0",
      icon: Package,
      color: "from-emerald-500 to-green-700",
    },
    {
      title: "Total Sales",
      value: data.totalSales?.toLocaleString() ?? "0",
      icon: ShoppingCart,
      color: "from-emerald-500 to-cyan-700",
    },
    {
      title: "Total Revenue",
      value: `$${data.totalRevenue?.toLocaleString() ?? "0"}`,
      icon: DollarSign,
      color: "from-emerald-500 to-lime-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map(({ title, value, icon, color }) => (
        <AnalyticsCard
          key={title}
          title={title}
          value={value}
          icon={icon}
          color={color}
        />
      ))}
    </div>
  );
};

// ------------------ Chart Panel ------------------

const ChartPanel = ({ data }) => {
  return (
    <motion.div
      className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <h2 className="text-lg font-semibold text-white mb-4">
        Daily Sales & Revenue
      </h2>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#D1D5DB" />
            <YAxis yAxisId="left" stroke="#D1D5DB" />
            <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              activeDot={{ r: 6 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              activeDot={{ r: 6 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400 text-center py-8">
          No sales data available.
        </p>
      )}
    </motion.div>
  );
};

// ------------------ Card Component ------------------

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`relative rounded-lg p-6 shadow-lg overflow-hidden bg-gradient-to-br ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={transition}
  >
    <div className="relative z-10">
      <p className="text-sm font-semibold text-white/70 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className="absolute -bottom-6 -right-6 text-white/20">
      <Icon className="h-28 w-28" />
    </div>
  </motion.div>
);
