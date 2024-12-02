import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {  useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { OfferProvider } from "./contexts/OfferContext";
import { ProductProvider } from "./contexts/ProductContext";
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
import PageNotFound from "./components/PageNotFound";
import OrderPage from "./components/OrderPage";
import ProductDetails from "./components/productDetails";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/Contact";

const App = () => {

  const {presentUser,adminId} = useAuth()


  return (

 
        <OfferProvider>
          <ProductProvider>
          <CartProvider>
        <Router>
          <Navbar />
          <CartDropdown />
          <main>
            <div style={{ padding: "90px 30px" }}>
              <Routes>
                <Route path="/profile" element={presentUser!=adminId ?<ProfilePage />:<PageNotFound />} />
                <Route
                  path="/"
                  element={
                    presentUser!=adminId ?
                    <>
                      <Categories />
                      <OfferGrid />
                    </>
                    : <PageNotFound />
                  }
                />
                <Route path="/shop" element={presentUser!=adminId ?<CategorySection />:<PageNotFound />}/>
                <Route path="/checkout"  element={presentUser!=adminId ?<Checkout />:<PageNotFound />} />
                <Route path="/about"  element={presentUser!=adminId ?<AboutUs />:<PageNotFound />} />
                <Route path="/contact"  element={presentUser!=adminId ?<ContactUs />:<PageNotFound />} />
                <Route path="/productdetails" element={presentUser!=adminId ?<ProductDetails />:<PageNotFound />} />
     
                <Route path="/products" element={presentUser!=adminId ?<ProductCard />:<PageNotFound />} />
                <Route
                    path="/orders"
                    element={presentUser!=adminId ?<OrderPage />:<PageNotFound />}
                  />
                <Route path="/login" element={presentUser!=adminId ?<LoginPage />:<PageNotFound />} />
                <Route path="/signup" element={presentUser!=adminId ?<SignUpPage />:<PageNotFound />} />
                <Route path="/admin" element={presentUser==adminId ?<Admin />:<PageNotFound/>} />
              </Routes>
            </div>
          </main>
          <Footer />
        </Router>
        </CartProvider>
        </ProductProvider>
        </OfferProvider>
  

  );
};

export default App;
