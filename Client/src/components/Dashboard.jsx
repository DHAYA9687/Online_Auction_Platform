import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, Card } from "react-bootstrap";
import { FaGavel, FaRegClock, FaCheckCircle, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import axios from "axios";

const AuctionDashboard = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [auctions, setAuctions] = useState([]);
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/auction/all', { withCredentials: true });
                setAuctions(response.data.auctionProduct);
                console.log(response.data.auctionProduct);
            } catch (err) {
                console.error("Error Fectching auctions:", err);
            } finally {
                setLoading(false)
            };
        };

        fetchAuctions();

    }, []);



    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Live': return 'bg-danger';
            case 'Upcoming': return 'bg-warning text-dark';
            default: return 'bg-success ';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Live': return <FaGavel className="me-2" />;
            case 'Upcoming': return <FaRegClock className="me-2" />;
            default: return <FaCheckCircle className="me-2" />;
        }
    };

    const handleViewDetails = (auctionId) => {
        navigate(`/auction/${auctionId}`);
    };
    if (loading) {
        return <h1 className="text-white">Loading...</h1>
    }

    return (
        <div className="container-fluid mt-5 pt-4 px-4 mb-10">
            <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                <h2 className="text-theme">
                    <FaGavel className="me-3" />
                    Dashboard
                </h2>
                <Button variant="red" onClick={handleShow}>
                    <FaPlus className="me-2" />
                    Create New Auction
                </Button>
            </div>

            {/* Stats Cards */}
            {/* <Row className="mb-4 g-3">
                <Col md={4}>
                    <Card className="dashboard-card h-100">
                        <Card.Body>
                            <h3 className="text-theme mb-3">Live Auctions</h3>
                            <h2 className="mb-0">3</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="dashboard-card h-100">
                        <Card.Body>
                            <h3 className="text-theme mb-3">Upcoming</h3>
                            <h2 className="mb-0">2</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="dashboard-card h-100">
                        <Card.Body>
                            <h3 className="text-theme mb-3">Completed</h3>
                            <h2 className="mb-0">1</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}

            {/* Auction Cards */}
            <Row className="g-4">
                {auctions.map((auction) => (
                    <Col key={auction._id} lg={4} md={6}>
                        <Card className="auction-card h-100">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h4 className="card-title text-theme mb-0">{auction.name}</h4>
                                    <span className={`badge ${getStatusBadgeClass(auction.status)}`}>
                                        {getStatusIcon(auction.status)}
                                        {auction.status}
                                    </span>
                                </div>
                                <p className="text-secondary mb-3">{auction.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 text-white">Starting Bid : <span className="text-theme">{auction.currentBid}</span></h5>
                                    {auction.auctionEndTime && <small className="text-danger">Ends in: {new Date(auction.auctionEndTime).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit",
                                    })}, {new Date(auction.auctionEndTime).toLocaleTimeString()}</small>}
                                    {auction.startTime && <small className="text-warning">Starts in: {auction.startTime}</small>}
                                    {auction.winner && <small className="text-secondary">Winner: {auction.winner}</small>}
                                </div>
                                { auction.status ==='active'  && <div className="mt-3">
                                    <Button
                                        variant="outline-theme"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleViewDetails(auction._id)}
                                    >
                                        View Details
                                    </Button>
                                    {/* {auction.status === 'Live' && (
                                        <Button variant="red" size="sm">Place Bid</Button>
                                    )} */}
                                </div>}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Create Auction Modal */}
            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton className="border-danger">
                    <Modal.Title className="text-theme">
                        <FaPlus className="me-2" />
                        Create New Auction
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Item Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter item name" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Starting Bid</Form.Label>
                                    <Form.Control type="number" placeholder="Enter starting bid" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter item description" />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="datetime-local" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="datetime-local" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-end">
                            <Button variant="secondary" className="me-2" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="red" type="submit">
                                Create Auction
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AuctionDashboard;
