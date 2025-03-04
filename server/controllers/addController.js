import { AuctionProduct } from "../models/auctionProductModel.js";

export const addAuctionProduct = async (req, res) => {
    try {
        let { name, description, startingPrice, auctionEndTime, auctionStartTime } = req.body;

        // Ensure required fields are present
        if (!name || !description || !startingPrice || !auctionEndTime) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

         //Get Current Time
        const currentTime = new Date().toISOString();

        if(!auctionStartTime){
            auctionStartTime = currentTime;
        }
       
        const status = auctionStartTime <= currentTime ? "active" : "Upcoming";
        // Create new auction product
        const auctionProduct = new AuctionProduct({
            name,
            description,
            startingPrice,
            auctionEndTime,
            auctionStartTime,
            status,
            seller: req.user_id,  // Assuming req.user is set from authentication middleware
        });
        // Save to database
        await auctionProduct.save();
        res.status(201).json({ message: "Auction product added successfully!", auctionProduct });

    } catch (error) {
        console.error("Error adding auction product:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

export const endAuctionProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user_id;

        const product = await AuctionProduct.findById(productId);

        if (!product) {
            return res.status(400).json({ message: "Auction product not found" });
        }

        // Ensure only the seller can end the auction
        if (product.seller.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to end this auction" });
        }
        console.log(product.status);
        //Check the status of the product  
        if (product.status !== "active") {
            return res.status(400).json({ message: "Auction is already ended or cancelled" });
        }
        // Update status to completed
        product.status = "completed";
        await product.save();

        res.json({ message: "Auction ended successfully", product });

    } catch (err) {
        res.status(500).json({ message: "Error updating auction status", error: err.message });
    }
};

// Function to check and update expired auctions
export const checkExpiredAuctions = async () => {
    try {
        console.log("Running checkExpiredAuctions at:", new Date().toLocaleString());
        const now = new Date();
        const expiredAuctions = await AuctionProduct.find({
            auctionEndTime: { $lte: now },
            status: "active"
        });

        if (expiredAuctions.length > 0) {
            for (let auction of expiredAuctions) {
                auction.status = "completed";
                await auction.save();
                console.log(`Auction ${auction._id} ended automatically.`);
            }
        }
    } catch (error) {
        console.error("Error checking expired auctions:", error);
    }
};

const checkAuctionStatus = async () => {
    try {
        const currentTime = new Date().toISOString();

        // Find upcoming auctions whose start time has passed
        const upcomingAuctions = await AuctionProduct.find({
            status: "upcoming",
            auctionStartTime: { $lte: currentTime }
        });

        if (upcomingAuctions.length > 0) {
            // Update auctions to active
            await AuctionProduct.updateMany(
                { status: "upcoming", auctionStartTime: { $lte: currentTime } },
                { $set: { status: "active" } }
            );

            console.log(`Updated ${upcomingAuctions.length} auctions to active.`);
        }
    } catch (error) {
        console.error("Error updating auction status:", error);
    }
};

// Run every minute
setInterval(checkAuctionStatus, 60 * 1000);
// Run the function every 1 minute
setInterval(checkExpiredAuctions, 60 * 1000);




export const getAllAuctionProducts = async (req, res) => {
    try {
        const auctionProduct = await AuctionProduct.find()
            .populate("seller", "name email").
            sort({ createdAt: -1 });

        res.status(200).json({ auctionProduct });
    } catch (err) {
        return res.status(500).json({ message: "Server error, Please try again later." })
    }
};

