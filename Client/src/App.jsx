import React from 'react'
import './App.css'

import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import AuctionDashboard from './components/Dashboard'
const App = () => {
  return (
    <div>
      <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path ="/auction" element={<AuctionDashboard/>}/>
        </Routes>
    </div>
  )
}

export default App