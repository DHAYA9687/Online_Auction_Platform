import { AuctionProduct } from "../models/auctionProductModel.js";

export const addAuctionProduct = async (req, res) => {
    try {
        const { name, description, startingPrice, auctionEndTime, images } = req.body;

        // Ensure required fields are present
        if (!name || !description || !startingPrice || !auctionEndTime) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Create new auction product
        const auctionProduct = new AuctionProduct({
            name,
            description,
            startingPrice,
            auctionEndTime,
            seller: req.user.id,  // Assuming req.user is set from authentication middleware
        });
        // Save to database
        await auctionProduct.save();
        res.status(201).json({ message: "Auction product added successfully!", auctionProduct });

    } catch (error) {
        console.error("Error adding auction product:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

export const endAuctionProduct = async (req,res) => {
    try{
        const {productId} = req.body;
        const userId = req.userId;

        const product = await AuctionProduct.findById(productId);

    if (!product) {
        return res.status(400).json( {message:"Auction product not found"});
    }

    // Ensure only the seller can end the auction
    if (product.seller.toString() !== userId) {
        return res.status(400).json( {message:"You are not authorized to end this auction"});
    }
    //Check the status of the product  
    if (auction.status !== "active") {
        return res.status(400).json({ message: "Auction is already ended or cancelled" });
    }
    // Update status to completed
    product.status = "completed";
    await product.save();

    res.json({ message: "Auction ended successfully", auction });

    }catch(err){
        res.status(500).json({ message: "Error updating auction status", error: error.message });
    }
};

// Function to check and update expired auctions
export const checkExpiredAuctions = async () => {
    try {
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

// Run the function every 1 minute
setInterval(checkExpiredAuctions, 60 * 1000);


export const getAllAuctionProducts = async (req,res)=>{
    try{
        const auctionProduct = await AuctionProduct.find()
            .populate("seller","name email").
            sort({createdAt:-1});

        res.status(200).status({auctionProduct});
    }catch(err){
        return res.status(500).json({message:"Server error, Please try again later."})
    }
};

