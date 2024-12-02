import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useProduct } from "./ProductContext";
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { presentUser } = useAuth();
  const {Products} = useProduct()
  useEffect(()=>{
  fetchCartItems()
  },[Products,presentUser])
  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      const response = await axios.post(`https://autopricesystem.onrender.com/api/cart/user-cart`,{
        userId:presentUser
      });
      if (response.data && response.data.items) {
        const updatedItems = response.data.items.map(item => {
          const product = Products.find(product => product._id === item.productId);
          if (product) {
            return {
              ...item,
              Original_Price: product.Original_Price // Replace original_price with price from Products
            };
          }
          return item; // If no match is found, keep the item unchanged
        });
        console.log(updatedItems)
        setCartItems(updatedItems); // Update cart items with modified array
      } 
      else if (response.data && response.data.message=="Cart not found."){
        setCartItems([])
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Add item to cart
  const addToCart = async ( productId,productTitle,productCategory,productImage,product_Original_Price) => {
    try {

      const response = await axios.post("https://autopricesystem.onrender.com/api/cart/add", {
        userId:presentUser,
        productId,productTitle,productCategory,productImage,product_Original_Price
      });
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      }
      else{
        console.log("error")
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  // Increment item quantity
  const incrementItem = async ( itemId) => {
    try {
      const response = await axios.post(`https://autopricesystem.onrender.com/api/cart/increase`, { userId:presentUser, itemId });
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error("Error incrementing item:", error);
    }
  };

  // Decrement item quantity
  const decrementItem = async ( itemId) => {
    try {
      const response = await axios.post(`https://autopricesystem.onrender.com/api/cart/decrease`, { userId:presentUser, itemId });
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error("Error decrementing item:", error);
    }
  };

  // Delete item from cart
  const deleteItem = async ( itemId) => {
    try {
      const response = await axios.post(`https://autopricesystem.onrender.com/api/cart/remove-item`, {userId:presentUser,itemId});
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
