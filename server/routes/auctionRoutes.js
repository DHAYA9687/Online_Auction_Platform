import express from "express";
import { getBidHistory } from "../controllers/bidAuction.js";
import { placeBid } from "../controllers/bidAuction.js";
import { endAuctionProduct, getAllAuctionProducts } from "../controllers/addController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addAuctionProduct } from "../controllers/addController.js";

const router = express.Router();

router.post("/auction-products", authMiddleware, addAuctionProduct);
router.get("/all", authMiddleware, getAllAuctionProducts);
router.post("/place-bid/:productId", authMiddleware, placeBid);
router.get("/bid-history/:productId", authMiddleware, getBidHistory);
router.post("/end/:productId", authMiddleware, endAuctionProduct);


export { router as auctionRoutes }