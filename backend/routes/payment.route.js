import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js";

const router = express.Router();

// @route   POST /api/payment/create-checkout-session
// @desc    Create Stripe Checkout session
// @access  Protected
router.post("/create-checkout-session", protectRoute, createCheckoutSession);

// @route   POST /api/payment/checkout-success
// @desc    Handle successful payment
// @access  Protected
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;
