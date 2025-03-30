import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGavel, FaUserCircle, FaSignInAlt, FaUserPlus, FaTachometerAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check authentication status whenever location changes
        checkAuth();
    }, [location]);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    };

    const handleLogout = () => {
        // Clear all auth related data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        // Redirect to home page
        navigate('/');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const navItems = (
        <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
                // Show these items when user is logged in
                <>
                    <li className="nav-item me-3">
                        <Link
                            className="nav-link d-flex align-items-center"
                            to="/dashboard"
                        >
                            <FaTachometerAlt className="me-2" />
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <button
                            className="nav-link d-flex align-items-center border-0 bg-transparent"
                            onClick={handleLogout}
                        >
                            <FaUserCircle className="me-2" />
                            Logout
                        </button>
                    </li>
                </>
            ) : (
                // Show these items when user is not logged in
                <>
                    <li className="nav-item me-3">
                        <Link
                            className="nav-link d-flex align-items-center"
                            to="/login"
                        >
                            <FaSignInAlt className="me-2" />
                            Login
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link d-flex align-items-center"
                            to="/register"
                        >
                            <FaUserPlus className="me-2" />
                            Register
                        </Link>
                    </li>
                </>
            )}
        </ul>
    );

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top m-2">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
                    <FaGavel className="me-2 brand-icon" />
                    <span className="brand-text">AuctionPro</span>
                </Link>

                {/* Desktop menu */}
                <div className="d-none d-lg-flex">{navItems}</div>

                {/* Mobile menu button */}
                <button
                    className="navbar-toggler border-0 d-lg-none"
                    type="button"
                    onClick={toggleMenu}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="position-absolute top-100 start-0 w-100 bg-black shadow-lg rounded-3 mt-2 p-3 d-lg-none mobile-menu">
                        {navItems}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
