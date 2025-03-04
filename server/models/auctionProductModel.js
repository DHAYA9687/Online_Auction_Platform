import mongoose from "mongoose";

const auctionProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    startingPrice: {
        type: Number,
        required: true,
        min: 0
    },
    currentBid: {
        type: Number,
        default: 0
    },
    auctionEndTime: {
        type: Date,
        required: true
    },
    auctionStartTime: {
        type: Date,
        require: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // bids:{
    //     type: Array[{
    //         bidderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
    //         bidAmount: { type: Number, required: true }
    //     }],
    //     default:[]
    // },
    // highestBidder: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     default: null
    // },
    status: {
        type: String,
        enum: ['active', 'completed', 'Upcoming'],
        default: 'active'
    },
    // images: [{
    //     type: String  // Store image URLs
    // }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const AuctionProduct = mongoose.model('AuctionProduct', auctionProductSchema);
