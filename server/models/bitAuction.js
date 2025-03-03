import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId, ref: "AuctionProduct",
    },
    highestBid: {
        type: Number,
        default:0
    },
    bids: [{
        bidderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
        bidAmount: { type: Number, required: true }
    }]
}, { timestamps: true });

export const Auction = mongoose.model("Auction", auctionSchema);