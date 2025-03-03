import { Auction } from "../models/bitAuction.js";
import { AuctionProduct } from "../models/auctionProductModel.js";
export const placeBid = async (req, res) => {
    try {
        const { bidAmount } = req.body;
        const { productId } = req.params;
        const bidderId = req.user_id;

        // Validate input
        if (!bidAmount || !productId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        //Search for auction
        let auction = await Auction.findOne({ productId });


        if (!auction) {
            //Retrieve product from AuctionProduct
            const product = await AuctionProduct.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "Auction product not found" });
            }
            auction = new Auction({
                productId: product._id,
                highestBid: product.startingPrice,
                bids: []
            });
            await auction.save();
        }
        if (bidAmount <= auction.highestBid) {
            return res.status(400).json({ message: "Bid must be higher than the current highest bid" });
        }
        //Compare the Current Bid with existingBid 
        //const newhighestBid = Math.max(auction.highestBid || 0, bidAmount);
        // Find the auction and update the bids array
        auction.highestBid = bidAmount;
        auction.bids.push({ bidderId, bidAmount });
        await auction.save();

        res.status(200).json({ message: "Bid placed successfully", auction });
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};


export const getBidHistory = async (req, res) => {
    try {
        const { productId } = req.params;

        const auction = await Auction.findOne({ productId })
            .populate("bids.bidderId", "name email")
            .populate("productId", "name description startingPrice");


        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        res.status(200).json({
            product: auction.productId,
            highestBid: auction.highestBid,
            bidHistory: auction.bids,
        });

    } catch (err) {
        console.error("Error fetching bid history:", err);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};
