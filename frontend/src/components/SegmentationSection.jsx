import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CategoryContainer,
  ProductGrid,
  ProductCard,
} from "../StyledComponents/SegmentationSectionStyles";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useProduct } from "../contexts/ProductContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "../components/LoadingSpinner"; 
const CategorySection = () => {
  const { addToCart } = useCart();
  const { presentUser } = useAuth();
  const {Products} = useProduct()
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  React.useEffect(()=>{
  if(Products.length>0)
    setLoading(false)
  },[Products])
  const notifyError = (err) => {
    toast.error(err, {
      position: "bottom-center",
      autoClose: 3000,

    });
  };

  const handleProductClick = (product) => {
    navigate(`/ProductDetails`, { state: { product } });
  };

  const handleAddToCart = async (productId,productTitle,productCategory,productImage,product_Original_Price) => {
    if (presentUser) {
      await addToCart( productId,productTitle,productCategory,productImage,product_Original_Price);
    }
    else{
      notifyError("Login and conitnue shopping")
    }
  };

  return (
    <CategoryContainer>
      {loading? <LoadingSpinner /> : 
      <ProductGrid>
        {Products.map((product) => (
          <ProductCard
            key={product._id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
          >
            <button
                onClick={() => handleProductClick(product)}
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "inherit",
                  padding: "0",
                }}
              >  <img src={product.Image} alt={product.Title} />
              <h4>{product.Title}</h4>
              <p>${product.Original_Price}</p></button>
          
            <button onClick={() => handleAddToCart(product._id,product.Title,product.Category,product.Image,product.Original_Price)}>
              Add to Cart
            </button>
          </ProductCard>
        ))}
      </ProductGrid>}
      <ToastContainer />
    </CategoryContainer>
  );
};

export default CategorySection;
