import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from backend
  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Add item to cart
  const addToCart = async (userId, product) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        product,
      });
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  // Increment item quantity
  const incrementItem = async (userId, itemId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/cart/increment/${itemId}`, { userId });
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error("Error incrementing item:", error);
    }
  };

  // Decrement item quantity
  const decrementItem = async (userId, itemId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/cart/decrement/${itemId}`, { userId });
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error("Error decrementing item:", error);
    }
  };

  // Delete item from cart
  const deleteItem = async (userId, itemId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/delete/${itemId}`, {
        data: { userId },
      });
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, fetchCartItems, addToCart, incrementItem, decrementItem, deleteItem }}
    >
      {children}
    </CartContext.Provider>
  );
};
