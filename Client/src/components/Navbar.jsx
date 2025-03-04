import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGavel, FaUserCircle, FaSignInAlt, FaUserPlus, FaTachometerAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) setUser(JSON.parse(userString));
    }, []);

    useEffect(() => {
        if (isOpen) setIsOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const navItems = (
        <ul className="navbar-nav w-100">
            <li className="nav-item mb-2">
                <Link
                    className="nav-link d-flex align-items-center"
                    to="/dashboard"
                    onClick={toggleMenu}
                >
                    <FaTachometerAlt className="me-2" />
                    Dashboard
                </Link>
            </li>
            {user ? (
                <li className="nav-item mb-2">
                    <Link
                        className="nav-link d-flex align-items-center"
                        onClick={handleLogout}
                    >
                        <FaUserCircle className="me-2" />
                        {user.username}
                        <FaSignInAlt className="ms-2" />
                    </Link>
                </li>
            ) : (
                <>
                    <li className="nav-item mb-2">
                        <Link
                            className="nav-link d-flex align-items-center"
                            to="/login"
                            onClick={toggleMenu}
                        >
                            <FaSignInAlt className="me-2" />
                            Login
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link d-flex align-items-center"
                            to="/register"
                            onClick={toggleMenu}
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
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
                    <FaGavel className="me-2 brand-icon" />
                    <span className="brand-text">AuctionPro</span>
                </Link>
                <div className="d-none d-lg-flex">{navItems}</div>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={toggleMenu}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                {isOpen && (
                    <div className="position-absolute top-100 start-0 w-100 bg-black shadow-lg rounded-3 mt-2 p-3 d-lg-none mobile-menu"
                        style={{ border: '1px solid var(--red-primary)' }}>
                        {navItems}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
