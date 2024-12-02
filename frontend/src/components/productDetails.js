import React, { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useProduct } from "../contexts/ProductContext";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const { addToCart } = useCart();
  const { presentUser } = useAuth();
  const { Products } = useProduct();

  // Filter similar products based on the current product's category
  const similarProducts = useMemo(() => {
    if (product) {
      return Products.filter(
        (item) => item.Category === product.Category && item._id !== product._id
      );
    }
    return [];
  }, [product, Products]);

  // Add to Cart handler
  const handleAddToCart = async () => {
    if (presentUser) {
      await addToCart(
        product._id,
        product.Title,
        product.Category,
        product.Image,
        product.Original_Price
      );
    } else {
      alert("Please log in to add products to the cart.");
    }
  };

  // Buy Now handler
  const handleBuyNow = async () => {
    if (presentUser) {
      await addToCart(
        product._id,
        product.Title,
        product.Category,
        product.Image,
        product.Original_Price
      );
      navigate("/checkout");
    } else {
      alert("Please log in to proceed to checkout.");
    }
  };

  useEffect(() => {
    if (!product) {
      alert("Product details not available!");
      navigate("/shop");
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <ErrorContainer>
        <p>No product details available. Redirecting to shop...</p>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      {/* Product Details */}
      <DetailsWrapper>
        <ImageWrapper>
          <img src={product.Image} alt={product.Title} />
        </ImageWrapper>
        <ContentWrapper>
          <h1>{product.Title}</h1>
          <p className="price">Price: ${product.Original_Price}</p>
          <p className="category">Category: {product.Category}</p>
          <p className="description">
            {product.Description || "No description available."}
          </p>
          <ButtonWrapper>
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </ButtonWrapper>
        </ContentWrapper>
      </DetailsWrapper>

      {/* Similar Products Section */}
      <SimilarProductsWrapper>
        <h2>Similar Products</h2>
        <ProductsGrid>
          {similarProducts.length > 0 ? (
            similarProducts.map((item) => (
              <ProductCard
                key={item._id}
                onClick={() =>
                  navigate(`/ProductDetails`, { state: { product: item } })
                }
              >
                <img src={item.Image} alt={item.Title} />
                <h4>{item.Title}</h4>
                <p>${item.Original_Price}</p>
              </ProductCard>
            ))
          ) : (
            <p>No similar products found.</p>
          )}
        </ProductsGrid>
      </SimilarProductsWrapper>
    </PageContainer>
  );
};

export default ProductDetails;

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const DetailsWrapper = styled.div`
  display: flex;
  gap: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ContentWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;

  h1 {
    font-size: 2rem;
    color: #333;
  }

  .price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #6200ea;
  }

  .category {
    font-size: 1.2rem;
    color: #555;
  }

  .description {
    font-size: 1rem;
    line-height: 1.5;
    color: #777;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 15px;

  button {
    flex: 1;
    padding: 12px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;

    &.add-to-cart {
      background-color: #6200ea;
      color: white;

      &:hover {
        background-color: #4c00b0;
      }
    }

    &.buy-now {
      background-color: #ff6f61;
      color: white;

      &:hover {
        background-color: #e85b50;
      }
    }
  }
`;

const SimilarProductsWrapper = styled.div`
  margin-top: 40px;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #333;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 10px;
  text-align: center;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  img {
    max-width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  h4 {
    font-size: 1.2rem;
    margin: 10px 0;
    color: #333;
  }

  p {
    font-size: 1rem;
    color: #6200ea;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #6200ea;
  font-size: 1.2rem;
`;
