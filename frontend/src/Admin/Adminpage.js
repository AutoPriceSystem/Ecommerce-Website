import React from 'react';
import { useOffer } from '../contexts/OfferContext';
const Admin = () => {
    const {toggleOffer, Offer} = useOffer()
    return (
        <div>
        <button onClick={()=>toggleOffer()}>Toggle Season Offer</button>
        <p>Season Offer: {Offer ? "Yes" : "No"}</p>

        
        </div>
    );
};

export default Admin;