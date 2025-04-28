import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [offers, setoffers] = useState(null);
  const [oneplus1diff, setoneplus1diff] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/offer.json");
        const data = await response.json();
        setoffers(data.onePlusOneOffer);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    if (offers?.end_time) {
      const start = new Date();
      const end = new Date(offers.end_time);
      const diffInMs = end - start;
      const diffInSeconds = diffInMs / 1000;
      setoneplus1diff(diffInSeconds);
    }
  }, [offers]);

  const [cartCount, setCartCount] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem('OrderData')) || [];
    return storedCart.length;
  });

  const [buy1get1, setbuy1get1] = useState(0);

  const buy1get1increase = () => {
    const New = Math.min(buy1get1 + 1, 2);
    setbuy1get1(New);
  };

  const buy1get1reset = () => {
    setbuy1get1(0);
  };

  const addToCart = () => {
    const newCartCount = cartCount + 1;
    setCartCount(newCartCount);
    localStorage.setItem('CartCount', JSON.stringify(newCartCount));
  };

  const removeFromCart = () => {
    const newCartCount = Math.max(cartCount - 1, 0);
    setCartCount(newCartCount);
    localStorage.setItem('CartCount', JSON.stringify(newCartCount));
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart,
        removeFromCart,
        setCartCount,
        buy1get1,
        setbuy1get1,
        buy1get1increase,
        buy1get1reset,
        oneplus1diff
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
