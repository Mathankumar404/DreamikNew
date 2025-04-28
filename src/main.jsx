import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './components/CartContext';
import { CouponProvider } from "./components/adminpanel/CouponContext";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <CouponProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </CouponProvider>
  /* </StrictMode>, */
)
