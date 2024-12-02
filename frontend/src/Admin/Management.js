import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProduct } from '../contexts/ProductContext';
function Management() {
  const [userCount, setUserCount] = useState();
  const [selectedProductId, setSelectedProductId] = React.useState("");
  const [formData, setFormData] = useState({
    Title: '',
    Category: '',
    Image: '',
    Video: '',
    Original_Price: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const {Products} = useProduct()

  // Fetch User Count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get("https://autopricesystem.onrender.com/user/getUserCount");
        setUserCount(res.data.count);
      } catch (error) {
        console.error("Error fetching user count", error);
      }
    };
    
    fetchUserCount();
  }, []);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle Product Form Submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    
    try {
      const response = await axios.post("https://autopricesystem.onrender.com/api/products/add", formData);
      setSuccessMessage(response.data.message); // Success message from the server
    } catch (error) {
      setError(error.response ? error.response.data.message : "Error adding product");
    }
  };

  async function DeleteProduct(id){
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if(confirmDelete)
    await axios.post("https://autopricesystem.onrender.com/api/products/delete", { product_id: id}).then((res)=>setSuccessMessage('Product Deleted Successfully'))
}

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedProductId(selectedId);

    // Find the selected product to log details
    const selectedProduct = Products.find((product) => product._id === selectedId);
    if (selectedProduct) {
      DeleteProduct(selectedProduct._id)
    }
  };

  return (
    <div>
      <h3    style={{
        border: "2px solid black", // Black border with 2px thickness
        borderRadius: "15px",      // Rounded corners
        padding: "20px",           // Inner spacing
        width: "300px",            // Set width
        textAlign: "center"        // Center text
      }}>Registered Users: {userCount}</h3>

      <h2>Create Product</h2>
      <form onSubmit={handleProductSubmit} style={{
        border: "2px solid black", // Black border with 2px thickness
        borderRadius: "15px",      // Rounded corners
        padding: "20px",           // Inner spacing
        width: "300px",            // Set width
        textAlign: "center"        // Center text
      }}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="Title"
            value={formData.Title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="Category"
            value={formData.Category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="Image"
            value={formData.Image}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Video URL:</label>
          <input
            type="text"
            name="Video"
            value={formData.Video}
            onChange={handleInputChange}

          />
        </div>
        <div>
          <label>Original Price:</label>
          <input
            type="number"
            name="Original_Price"
            value={formData.Original_Price}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Create Product</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      
<div>
      <label htmlFor="product-select">Choose a product to delete: </label>
      <select
        id="product-select"
        value={selectedProductId}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select a product
        </option>
        {Products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.Title}
          </option>
        ))}
      </select>
    </div>

    </div>


  );
}

export default Management;
