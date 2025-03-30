import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaGavel, FaRegClock, FaCheckCircle, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosConfig from "../lib/axios";

const AuctionDashboard = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [auctions, setAuctions] = useState([]);
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await axiosConfig.get('/auction/all');
                setAuctions(response.data.auctionProduct);
                console.log(auctions);
                console.log(response.data.auctionProduct);
            } catch (err) {
                console.error("Error Fetching auctions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startingPrice: "",
        auctionStartTime: "",
        auctionEndTime: "",
    });

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate form data
            if (!formData.name || !formData.description || !formData.startingPrice || !formData.auctionEndTime) {
                toast.error("Please fill all required fields");
                return;
            }

            // Convert startingPrice to number
            const formattedData = {
                ...formData,
                startingPrice: Number(formData.startingPrice)
            };

            const response = await axiosConfig.post('/auction/auction-products', formattedData);

            toast.success("Auction successfully created!");

            // Close modal and refresh auctions list
            setShowModal(false);

            // Reset form
            setFormData({
                name: "",
                description: "",
                startingPrice: "",
                auctionStartTime: "",
                auctionEndTime: "",
            });

            // Update auctions list
            setAuctions(prev => [...prev, response.data.auctionProduct]);

        } catch (error) {
            console.error("Error creating auction:", error);
            toast.error(error.response?.data?.message || "Failed to create auction.");
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Live': return 'bg-danger';
            case 'Upcoming': return 'bg-warning text-dark';
            default: return 'bg-success ';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="danger" role="status" />
                    <h4 className="text-white mt-3">Loading auctions...</h4>
                </div>
            ) : auctions.length === 0 ? (
                <div className="text-center py-5">
                    <h4 className="text-white">No auctions available</h4>
                    <p className="text-secondary">Create a new auction to get started</p>
                </div>
            ) : (
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
                                        <h5 className="mb-0 text-white">Starting Bid : <span className="text-theme">{auction.startingPrice}</span></h5>
                                        {auction.auctionEndTime && <small className="text-danger">Ends in: {new Date(auction.auctionEndTime).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                        })}, {new Date(auction.auctionEndTime).toLocaleTimeString()}</small>}
                                        {auction.startTime && <small className="text-warning">Starts in: {auction.startTime}</small>}
                                        {auction.winner && <small className="text-secondary">Winner: {auction.winner}</small>}
                                    </div>
                                    <div className="mt-3">
                                        <Button
                                            variant="outline-theme"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleViewDetails(auction._id)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton className="border-danger">
                    <Modal.Title className="text-theme">
                        <FaPlus className="me-2" />
                        Create New Auction
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Item Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter item name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Starting Bid</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter starting bid"
                                        name="startingPrice"
                                        value={formData.startingPrice}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter item description" name="description" value={formData.description} onChange={handleChange} required />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="datetime-local" name="auctionStartTime" value={formData.auctionStartTime} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="datetime-local" name="auctionEndTime" value={formData.auctionEndTime} onChange={handleChange} required />
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
            <ToastContainer />
        </div>
    );
};

export default AuctionDashboard;
