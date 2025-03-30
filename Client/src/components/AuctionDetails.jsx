import React, { useState } from 'react';
import { Card, Button, Table, Form, Badge } from 'react-bootstrap';
import { FaGavel, FaRegClock, FaCheckCircle, FaUser, FaHistory } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../lib/useFetch';
import axiosConfig from '../lib/axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuctionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bidAmount, setBidAmount] = useState('');

    // Fetch auction details and bid history using custom hook
    const { data, loading, error: auctionerror } = useFetch(`/auction/getauctionById/${id}`);
    const auction = data?.product || {};
    console.log(`auction : ${auction.name}`);

    // Fetch bid history using custom hook
    const { data: bidData, loading: loadingBidHistory, error } = useFetch(`/auction/bid-history/${id}`);
    const bidHistory = bidData?.bidHistory || [];
    console.log(`bidHistory : ${bidHistory?.product?.name}`);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Live': return 'bg-danger';
            case 'Upcoming': return 'bg-warning text-dark';
            default: return 'bg-success';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Live': return <FaGavel className="me-2" />;
            case 'Upcoming': return <FaRegClock className="me-2" />;
            default: return <FaCheckCircle className="me-2" />;
        }
    };


    // Calculate the Highest Bid
    const highestBid = bidHistory.length > 0
        ? Math.max(...bidHistory.map(bid => Number(bid.bidAmount)))
        : auction.startingPrice;


    const handleBidSubmit = async (e) => {
        e.preventDefault();
        const bidValue = Number(bidAmount);
        if (!bidValue || bidValue <= highestBid) {
            toast.warning("Bid amount must be greater than the current highest bid!");
            setBidAmount('');
            return;
        }
        try {
            const response = await axiosConfig.post(`/auction/place-bid/${id}`, {
                bidAmount: bidValue,
            });
            toast.success("Bid placed successfully!");
            setBidAmount('');
            setTimeout(() => {
                window.location.reload();  // Delay reload to allow toast to show
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error("Error placing bid. Please try again.");
        }
    };

    const handleEndAuction = async () => {
        // Add auction end logic here
        if (!window.confirm("Are you sure you want to end this auction?")) return;

        try {

            const response = await axiosConfig.post(`/auction/end/${id}`);
            const { message, winner } = response.data;
            toast.success(message);
            if (winner) {
                toast.info(`🏆Winner: ${winner.name} (${winner.email})`);
            } else {
                toast.info("No bids were placed.");
            }
            setTimeout(() => {
                window.location.reload();  // Delay reload to allow toast to show
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error("Error ending auction. Please try again.");
        }
    };



    //Get the logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || {}; // Get logged-in user
    const isSeller = loggedInUser?._id && auction?.seller?._id === loggedInUser?._id; // Compare IDs
    console.log(`loggedInUser : ${loggedInUser?._id}`);
    console.log(`auction.seller.name : ${auction?.seller?._id}`);


    if (loading || loadingBidHistory) return <p className="text-white">Loading...</p>;
    if (error || auctionerror) return <p className="text-white">Error: {error}</p>;
    if (!auction || Object.keys(auction).length === 0) return <p className="text-text">No auction found.</p>;

    return (
        <div className="container-fluid mt-5 pt-4 px-4">
            <Button variant="outline-theme" className="mb-4" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
            </Button>

            <Card className="auction-card">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <h2 className="text-theme">{auction.name}</h2>
                        <Badge className={`${getStatusBadgeClass(auction.status)} fs-6`}>
                            {getStatusIcon(auction.status)}
                            {auction.status}
                        </Badge>
                    </div>

                    <div className="row">
                        <div className="col-md-8">
                            <p className="text-secondary">{auction.description}</p>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="mb-0 text-white">
                                    Highest Bid: <span className="text-theme">${highestBid}</span>
                                </h4>
                                {auction.endTime && (
                                    <span className="text-danger">
                                        <FaRegClock className="me-2" />
                                        Ends in: {auction.endTime}
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons Section */}
                            <div className="d-flex align-items-center gap-3">
                                {/* Place Bid Form */}
                                {auction.status === 'active' && (
                                    <Form onSubmit={handleBidSubmit} className="flex-grow-1">
                                        <div className="d-flex gap-2">
                                            <Form.Control
                                                type="number"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                placeholder="Enter bid amount"
                                                min={auction.currentBid + 1}
                                            />
                                            <Button variant="red" type="submit" size="sm">
                                                Place Bid
                                            </Button>
                                        </div>
                                    </Form>
                                )}

                                {/* End Auction Button */}
                                {auction.status === 'active' && isSeller && (
                                    <Button
                                        variant="danger"
                                        onClick={handleEndAuction}
                                        size="md"
                                    >
                                        <FaGavel className="me-2" />
                                        End Auction
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <Card className="h-100">
                                <Card.Body>
                                    <h5 className="text-theme mb-3">
                                        <FaUser className="me-2" />
                                        Auction Details
                                    </h5>
                                    <p className="mb-2 text-white">Created by : {auction.seller.name}</p>
                                    <p className="mb-2 text-white">Starting bid : ${auction.startingPrice}</p>
                                    <p className="mb-0 text-white">Total bids : {bidHistory.length}</p>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h4 className="text-theme mb-3">
                            <FaHistory className="me-2" />
                            Bid History
                        </h4>
                        {bidHistory.length > 0 ? (
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Bidder Name</th>
                                        <th>Amount</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bidHistory.map((bid, index) => (
                                        <tr key={index}>
                                            <td>{bid.bidderId.name}</td>
                                            <td>${bid.bidAmount}</td>
                                            <td>{bid.bidderId.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-white">No bids placed yet.</p>
                        )}
                    </div>
                    {/* Winner Details Section */}
                    {auction.status === 'completed' && bidHistory.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-theme mb-3">
                                🏆 Winner Details
                            </h4>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Winner Name</th>
                                        <th>Email</th>
                                        <th>Winning Bid</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{bidHistory[bidHistory.length - 1].bidderId.name}</td>
                                        <td>{bidHistory[bidHistory.length - 1].bidderId.email}</td>
                                        <td>${bidHistory[bidHistory.length - 1].bidAmount}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    )}

                </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default AuctionDetails; 