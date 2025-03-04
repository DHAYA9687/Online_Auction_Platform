import React, { useState } from 'react';
import { Card, Button, Table, Form, Badge } from 'react-bootstrap';
import { FaGavel, FaRegClock, FaCheckCircle, FaUser, FaHistory } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

const AuctionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bidAmount, setBidAmount] = useState('');

    // Mock data - replace with actual API calls
    const auction = {
        id: 1,
        item: "Vintage Watch",
        currentBid: 500,
        status: "Live",
        description: "Rare collectible timepiece from 1960s",
        endTime: "2h 30m",
        createdBy: "seller123",
        images: ["watch1.jpg"],
        startingBid: 300,
        endAuction: true
    };

    const bidHistory = [
        { id: 1, bidder: "user456", amount: 500, time: "2024-03-20 14:30" },
        { id: 2, bidder: "user789", amount: 450, time: "2024-03-20 14:15" },
        { id: 3, bidder: "user123", amount: 400, time: "2024-03-20 14:00" },
    ];

    // Mock logged-in user - replace with actual auth
    const currentUser = {
        id: 'user123',
        username: 'user123'
    };

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

    const handleBidSubmit = (e) => {
        e.preventDefault();
        // Add bid submission logic here
        alert('Bid placed successfully!');
        setBidAmount('');
    };

    const handleEndAuction = () => {
        // Add auction end logic here
        alert('Auction ended successfully!');
    };

    return (
        <div className="container-fluid mt-5 pt-4 px-4">
            <Button variant="outline-theme" className="mb-4" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
            </Button>

            <Card className="auction-card">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <h2 className="text-theme">{auction.item}</h2>
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
                                    Highest Bid: <span className="text-theme">${auction.currentBid}</span>
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
                                {auction.status === 'Live' && (
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
                                {auction.status === 'Live' && (
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
                                    <p className="mb-2 text-white">Created by : {auction.createdBy}</p>
                                    <p className="mb-2 text-white">Starting bid : ${auction.startingBid}</p>
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
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Bidder</th>
                                    <th>Amount</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bidHistory.map((bid) => (
                                    <tr key={bid.id}>
                                        <td>{bid.bidder}</td>
                                        <td>${bid.amount}</td>
                                        <td>{bid.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AuctionDetails; 