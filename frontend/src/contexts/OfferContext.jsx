import React, { createContext, useContext, useState, useEffect } from "react";

const OfferContext = createContext();

export const useOffer = () => useContext(OfferContext);

export const OfferProvider = ({ children }) => {
    const[Offer, setOffer] = useState(()=>{
      const storedOffer = localStorage.getItem("Offer");
    return storedOffer ? JSON.parse(storedOffer) : false;
    })



const toggleOffer = ()=> {localStorage.setItem('Offer',!Offer);setOffer(!Offer)}
  return (
    <OfferContext.Provider value={{ Offer , toggleOffer }}>
{children}
    </OfferContext.Provider>
  );
};
