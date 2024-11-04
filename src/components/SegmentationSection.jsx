import React, { useState, useEffect } from "react";
import axios from "axios";
import CartDropdown from "./CartDropdown";
import Categories from "./categoryBar"; // Import the Categories component
import {
  CategoryContainer,
  ProductGrid,
  ProductCard,
} from "../StyledComponents/SegmentationSectionStyles";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const CategorySection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const { addToCart, fetchCartItems } = useCart();
  const { presentUser } = useAuth();

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/getallproducts"
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = async (product) => {
    if (presentUser?.uid) {
      await addToCart(presentUser.uid, product);
      // Optionally, you can re-fetch the cart items to ensure everything is updated
      fetchCartItems(presentUser.uid);
    }
  };

  // Filter products based on the selected category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.Category === selectedCategory);

  return (
    <CategoryContainer>
      {/* Replace CategoryButtons with Categories component */}
      <Categories handleCategoryChange={handleCategoryChange} />
      
      <ProductGrid>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
          >
            <img src={product.Image} alt={product.Title} />
            <h4>{product.Title}</h4>
            <p>${product.Original_Price}</p>
            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </ProductCard>
        ))}
      </ProductGrid>
    </CategoryContainer>
  );
};

export default CategorySection;
