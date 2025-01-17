import React, { useState } from 'react';
import './App.css';
import './index.css';
import "./style.css";
import Navbar from './components/Nav';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import Newsletter from './components/Newsletter';
import Advertisement from './components/Advertisement';
import CutOutNameSlip from './components/cutoutnameslip/CutOutNameSlip'; 
import ProductDetails from './components/cutoutnameslip/ProductDetails'; 
import Order from './components/order/Order'; // Assuming you will create this component
import Nameslip from './components/Nameslip/Nameslip';
import Bagtag from './components/Bagtag/Bagtag';
import NSProductDetails from './components/Nameslip/NSProductDetails';
import NSPersonalize from './components/Personalize/NSPersonalize';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  const [cartCount, setCartCount] = useState(0);
  const [showResellerLogin, setShowResellerLogin] = useState(false);


  // Function to handle navigation between components
 

  return (
    <>
       <Router>
      <Navbar cartCount={cartCount} />
      <Advertisement />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/cutoutnameslip" element={<CutOutNameSlip />} />
        <Route path="/productdetails" element={<ProductDetails />} />
        <Route path="/Nameslip" element={<Nameslip />} />
        <Route path="/nsproductdetails/:id" element={<NSProductDetails />} />
        <Route path="/bagtag" element={<Bagtag />} /> {/* Route for Bagtag */}
        <Route path="/nspersonalize/:id" element={<NSPersonalize />} />
        <Route path="/order" element={<Order />} />
      </Routes>
      <Newsletter />
      <Footer />
    </Router>
    </>
  );
}

export default App;
