import { AuctionProduct } from "../models/auctionProductModel.js";

export const addAuctionProduct = async (req, res) => {
    try {
        let { name, description, startingPrice, auctionEndTime, auctionStartTime } = req.body;

        // Ensure required fields are present
        if (!name || !description || !startingPrice || !auctionEndTime) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Convert string dates to Date objects
        const currentTime = new Date();
        auctionEndTime = new Date(auctionEndTime);
        auctionStartTime = auctionStartTime ? new Date(auctionStartTime) : currentTime;

        // Determine initial status
        const status = auctionStartTime <= currentTime ? "active" : "upcoming";

        // Create new auction product
        const auctionProduct = new AuctionProduct({
            name,
            description,
            startingPrice,
            auctionEndTime,
            auctionStartTime,
            status,
            seller: req.user_id,
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

// Function to check and update upcoming auctions to active
const checkAuctionStatus = async () => {
    try {
        const now = new Date();
        //console.log("Current time:", now);

        // Find upcoming auctions that should be active now
        const upcomingAuctions = await AuctionProduct.find({
            status: "upcoming"
        });

        for (const auction of upcomingAuctions) {
            const startTime = new Date(auction.auctionStartTime);
            console.log(`Auction ${auction._id} start time:`, startTime);
            
            if (startTime <= now) {
                 console.log(`Updating auction ${auction._id} to active`);
                await AuctionProduct.findByIdAndUpdate(
                    auction._id,
                    { status: "active" },
                    { new: true }
                );
            }
        }

    } catch (error) {
        console.error("Error in checkAuctionStatus:", error);
    }
};

// Function to check and update expired auctions
export const checkExpiredAuctions = async () => {
    try {
        const now = new Date();
        console.log("Checking for expired auctions at:", now);

        // Find active auctions that have passed their end time
        const expiredAuctions = await AuctionProduct.find({
            status: "active"
        });

        for (const auction of expiredAuctions) {
            const endTime = new Date(auction.auctionEndTime);
            // console.log(`Auction ${auction._id} end time:`, endTime);
            
            if (endTime <= now) {
                //console.log(`Marking auction ${auction._id} as completed`);
                await AuctionProduct.findByIdAndUpdate(
                    auction._id,
                    { status: "completed" },
                    { new: true }
                );
            }
        }

    } catch (error) {
        console.error("Error in checkExpiredAuctions:", error);
    }
};

// Initial check when server starts
checkExpiredAuctions();
checkAuctionStatus();

// Schedule regular checks every 30 seconds for more frequent updates
const CHECK_INTERVAL = 30000; // 30 seconds

setInterval(() => {
    checkExpiredAuctions();
    checkAuctionStatus();
}, CHECK_INTERVAL);

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

