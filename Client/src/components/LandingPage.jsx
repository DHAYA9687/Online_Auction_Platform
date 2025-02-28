import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center bg-black shadow-lg rounded-4 p-5 w-75" 
                 style={{ border: '2px solid var(--red-primary)' }}>
                <h1 className="fw-bold text-theme">Welcome to AuctionPro</h1>
                <p className="text-secondary">
                    Your Premier Platform for Online Auctions and Bidding
                </p>
                <hr className="w-50 mx-auto my-4 border-danger" />
                <p className="text-secondary">
                    Discover unique items, place bids, and win auctions from the comfort of your home.
                </p>
                <div className="mt-4 d-flex justify-content-center gap-3">
                    <Link to="/register" className="btn btn-red btn-lg px-4">Get Started</Link>
                    <Link to="/login" className="btn btn-outline-theme btn-lg px-4">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
