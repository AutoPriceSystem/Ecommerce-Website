import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { OfferProvider } from "./contexts/OfferContext";
import Navbar from "./components/Navbar";
import LoginPage from "./Authentication/LoginPage";
import SignUpPage from "./Authentication/SignUpPage";
import OfferGrid from "./components/OfferGrid";
import CategorySection from "./components/SegmentationSection";
import ProductCard from "./components/ProductCard";
import ProfilePage from "./components/Profilepage";
import Categories from "./components/categoryBar";
import Footer from "./components/Footer";
import CartDropdown from "./components/CartDropdown";
import Checkout  from "./components/CheckoutPage";
import Admin from "./Admin/Adminpage";
const App = () => {


  // State to store cart items
  const [cartItems, setCartItems] = useState([]);

  return (
    <AuthProvider>
      <CartProvider>
        <OfferProvider>
        <Router>
          <Navbar />
          <CartDropdown cartItems={cartItems} />
          <main>
            <div style={{ padding: "90px 30px" }}>
              <Routes>
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/"
                  element={
                    <>
                      <Categories />
                      <OfferGrid />
                    </>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <CategorySection
                      cartItems={cartItems}
                      setCartItems={setCartItems}
                    />
                  }
                />
                <Route path="/checkout"  element={<Checkout />} />
                
     
                <Route path="/products" element={<ProductCard />} />
         
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </Router>
        </OfferProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
