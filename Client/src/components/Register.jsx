import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaLock, FaEnvelope, FaUserPlus, FaPhone } from 'react-icons/fa';
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.name === "" || formData.email === "" || formData.password === "" || formData.confirmPassword === "") {
                toast.error("Please fill in all fields");
                return;
            }
            if (formData.confirmPassword !== formData.password) {
                setFormData({ ...formData, password: "", confirmPassword: "" });
                toast.info("Passwords do not match");
                return;
            }
            const response = await axios.post('http://localhost:4000/api/auth/register', formData, {
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((res) => {
                console.log(res.data.message);
                toast.success("Account created successfully");
                setTimeout(() => navigate("/login"), 2000);

            }).catch((err) => {
                console.error(err);
                toast.error(err.response?.data?.message || "Something went wrong");
            });
                // Handle registration logic here
                
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
        setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    };

    return (
        <Container fluid className="auth-container">
            <Row className="justify-content-center align-items-center min-vh-100">
            <ToastContainer position="top-right" autoClose={3000} />
                <Col md={8} lg={6} xl={5}>
                    <Card className="auth-card">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="text-theme mb-3">
                                    <FaUserPlus className="me-2" />
                                    Create Account
                                </h2>
                                <p className="text-secondary">Join our auction community today</p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaUser className="text-theme" />
                                        </span>
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaEnvelope className="text-theme" />
                                        </span>
                                        <Form.Control
                                            type="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaLock className="text-theme" />
                                        </span>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaLock className="text-theme" />
                                        </span>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                </Form.Group>

                                <Button variant="red" type="submit" className="w-100 mb-4">
                                    <FaUserPlus className="me-2" />
                                    Create Account
                                </Button>

                                <div className="text-center text-secondary">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-theme text-decoration-none">
                                        Sign In
                                    </Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
