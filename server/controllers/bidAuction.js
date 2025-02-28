import { Auction } from "../models/bitAuction.js";

export const placeBid = async (req, res) => {
    try {
        const {productId, bidAmount } = req.body;
        const bidderId = req.userId;

        // Validate input
        if (!bidAmount || !productId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const auction =await Auction.findOne({productId});

        //Search for auction
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
        //Compare the Current Bid with existingBid 
        const newhighestBid = Math.max(auction.highestBid||0,bidAmount);
        // Find the auction and update the bids array
        const updateAuction = await Auction.findByOneAndUpdate(
            {productId},
            { $push: { bids: { bidderId, bidAmount } } },
            {$set:{highestBid:newhighestBid}},
            { new: true }  // Return updated auction
        );

        res.status(200).json({ message: "Bid placed successfully", updateAuction });
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};


export const getBidHistory = async(req,res)=>{
    try{
        const {productId} = req.params;

        const auction = Auction.findOne({productId})
            .populate("bids.bidderId","name email")
            .populate("productId","name description startingPrice");

        
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        res.status(200).json({
            product: auction.productId,
            highestBid: auction.highestBid,
            bidHistory: auction.bids,
        });

    }catch(err){
        console.error("Error fetching bid history:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};
