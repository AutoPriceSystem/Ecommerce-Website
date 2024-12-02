import React, { createContext, useContext, useState, useEffect,useRef } from "react";
import axios from "axios";
import { useOffer } from "./OfferContext";


const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    let Category = useRef("")
    let Price = useRef("0")
    let Search = useRef("")
    const[Products, setProducts] = useState([])
    const[AllProducts,setAllProducts] = useState([])
    const {Offer} = useOffer()
    useEffect(()=>{
        async function fetchData(){
        try {
          console.log(Offer)
            const response = await axios.post(
              "https://autopricesystem.onrender.com/api/products/getallproducts",{
                season_offer:Offer
              }
            );
            setAllProducts(response.data.data);
            setProducts(response.data.data)
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        }
        fetchData()
    },[])
   
function FilterFunction(){
    let filteredProducts = AllProducts.filter(product =>
        product.Title.toLowerCase().includes(Search.current.toLowerCase()) &&
        product.Category.replace(/\s+/g, '').toLowerCase().includes(Category.current.replace(/\s+/g, '').toLowerCase()) &&
        (Price.current === '0' || 
          (product.Original_Price >= (Number(Price.current) - 250) && product.Original_Price <= (Number(Price.current) + 250))
        )
      );
      setProducts(filteredProducts);
}

const filterProduct = (method, value)=>{
    if (method == 'Category')  Category.current = value
    else Price.current = value
       
    FilterFunction()

}

const searchProduct = (value) => {
    Search.current = value
    FilterFunction()
}
  return (
    <ProductContext.Provider value={{ Products , searchProduct, filterProduct }}>
{children}
    </ProductContext.Provider>
  );
};
