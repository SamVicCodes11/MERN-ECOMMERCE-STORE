import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
	try {
		// Fetch general analytics
		const analyticsData = await getAnalyticsData();

		// Prepare date range: past 7 days
		const today = new Date();
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(today.getDate() - 7);

		// Fetch sales data for the last 7 days
		const dailySalesData = await getDailySalesData(sevenDaysAgo, today);

		// Send the combined response
		res.status(200).json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.error("Analytics Route Error:", error.message);
		res.status(500).json({
			message: "Internal server error",
			error: error.message,
		});
	}
});

export default router;
