const Product = require('../models/productModel');
const axios = require('axios')
// Create product
const createProduct = async (req, res) => {
  try {
    const { Title, Category, Image, Video, Original_Price} = req.body;
    const formattedReleaseDate = new Date().toISOString().split('T')[0];

    const newProduct = new Product({
      Title,
      Category,
      Image,
      Video,
      Original_Price,
      Release_Date: formattedReleaseDate,
      sales_history: []
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error: error.message });
  }
};


// Get all products
const getAllProducts = async (req, res) => {
  try {
    const { season_offer } = req.body;
 
    const products = await Product.find({});
    if(!season_offer){
    let User_Traffic = 1;

    const { BetaAnalyticsDataClient } = require('@google-analytics/data');
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
    });

    async function fetchRealTimePages() {
      try {
        const response = await analyticsDataClient.runRealtimeReport({
          property: 'properties/467698068',
          dateRanges: [
            {
              startDate: '7daysAgo',
              endDate: 'today',
            },
          ],
          metrics: [
            {
              name: 'activeUsers',
            },
          ],
        });
        return response[0].rows[0].metricValues[0].value;
      } catch (error) {
        console.error('Error fetching real-time data:', error);
        return 1;
      }
    }

    User_Traffic = await fetchRealTimePages();

    const onnxruntime = require('onnxruntime-node');
    const fs = require('fs');

    await Promise.all(
      products.map(async (product) => {
        let Comp_Price = product.Original_Price;

        try {
          const response = await axios.post('http://127.0.0.1:4000/scrape', {
            query: (product.Category.split(' ').join('') === 'SmartPhone' || product.Category.split(' ').join('') === 'Laptop') 
              ? product.Title + product.Category.split(' ').join('') 
              : product.Title,
          });

          const matched_item = response.data.find(
            (webscrapedproduct) =>
              Number(webscrapedproduct.price.replace('$', '').replace(',', '')) >
                product.Original_Price - 200 &&
              webscrapedproduct.title.toLowerCase().includes(product.Title.toLowerCase())
          );

          if (matched_item) {
            Comp_Price = Number(matched_item.price.replace('$', '').replace(',', ''));
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }

        async function runInference(User_Traffic, Comp_Diff) {
          const session = await onnxruntime.InferenceSession.create('./model.onnx');

          const scalerParams = JSON.parse(fs.readFileSync('scaler_params.json'));
          const labelEncoderParams = JSON.parse(fs.readFileSync('label_encoder_params.json'));
          const dayDifference = Math.floor((new Date() - new Date(product.Release_Date)) / (1000 * 60 * 60 * 24));

          const inputData = [
            User_Traffic,
            product.sales_history.length,
            dayDifference,
            Comp_Diff,
            product.Category != 'Home Appliances'?product.Category.split(' ').join('') :product.Category,
            season_offer,
          ];

          const offer = inputData[inputData.length - 1];
          if (offer === true) return -50;

          const inputDataWithoutOffer = inputData.slice(0, -1);

          const standardizedInput = inputDataWithoutOffer.slice(0, -1).map((value, index) => {
            return (value - scalerParams.mean[index]) / scalerParams.scale[index];
          });

          const encodedCategory = labelEncoderParams.classes.indexOf(inputDataWithoutOffer[inputDataWithoutOffer.length - 1]);
          const finalInput = [...standardizedInput, encodedCategory];

          const tensor = new onnxruntime.Tensor('float32', new Float32Array(finalInput), [1, 5]);

          const outputs = await session.run({ input: tensor });
          console.log(product.Title,outputs.variable.cpuData[0])
          return outputs.variable.cpuData[0];
        }

        const mlOutput = await runInference(User_Traffic, Comp_Price - product.Original_Price);


        product.Original_Price = (product.Original_Price + mlOutput).toFixed(2);
      })
    );
  }else{
    products.map((product)=>{
      product.Original_Price = (product.Original_Price*0.95).toFixed(2)
    })
  }
    res.status(200).json({ message: 'success', data: products });
  } catch (error) {
    console.error(error);
    res.status(400).send('failed');
  }
};



// Get single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const { product_id } = req.body;
    const product = await Product.findById(product_id);
    if (product) {
      res.status(200).json({ message: 'success', data: product });
    } else {
      res.status(400).send("failed");
    }
  } catch (error) {
    res.status(400).send("failed");
  }
};



// Fetch products by an array of IDs
const getProductsByIds = async (req, res) => {
  try {
    const { productIds } = req.body; // Expecting an array of product IDs in the request body

    // Validate that productIds is an array
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Product IDs should be an array.' });
    }

    // Find all products with IDs in the provided array
    const products = await Product.find({ _id: { $in: productIds } });

    res.status(200).json({ message: 'success', data: products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};




// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.body;
  
    const product = await Product.findByIdAndDelete(product_id);
    if (product) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Increase product quantity
const increaseQuantity = async (req, res) => {
  try {
    const { product_id, amount } = req.body; // Expecting product ID and the amount to increase
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.quantity += amount; // Increase the quantity
    const updatedProduct = await product.save(); // Save the updated product

    res.status(200).json({ message: 'Quantity increased successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error increasing quantity', error: error.message });
  }
};

// Decrease product quantity
const decreaseQuantity = async (req, res) => {
  try {
    const { product_id, amount } = req.body; // Expecting product ID and the amount to decrease
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < amount) {
      return res.status(400).json({ message: 'Insufficient quantity to decrease' });
    }

    product.quantity -= amount; // Decrease the quantity
    const updatedProduct = await product.save(); // Save the updated product

    res.status(200).json({ message: 'Quantity decreased successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error decreasing quantity', error: error.message });
  }
};


module.exports = { createProduct, getAllProducts, getSingleProduct, deleteProduct, getProductsByIds,increaseQuantity,decreaseQuantity };

