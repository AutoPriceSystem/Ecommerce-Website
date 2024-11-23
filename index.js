const express = require('express');
const dbConnect = require('./config/dbConnect');
const dotenv = require('dotenv').config();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/productRoute');
const authRouter = require("./routes/authRoute");
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const billingRouter = require('./routes/billingRoute');
const cartRouter = require("./routes/cartRoute"); // Import cartRouter
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require('./routes/userRoutes');



const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
// app.use(cors({ origin: 'https://autopricesystem.netlify.app' }));
// Database connection
dbConnect();

// Middleware to parse incoming JSON and URL-encoded payload
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie parser middleware
app.use(cookieParser());


// Routes
app.use('/api/products', productRouter);
app.use("/api/user", authRouter);
app.use("/api/billing", billingRouter);
app.use("/api/cart", cartRouter); // Use cartRouter
app.use('/', userRoutes); 
app.use("/api/orders", orderRoutes);
// app.use('/api/products', billingRouter);
app.use((req, res, next) => {
    res.status(404).send("Not Found");
});


// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});


const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Create a client for the API
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
    
    console.log('Real-Time Website User count:', response[0].rows[0].metricValues[0].value)
    return  response[0].rows[0].metricValues[0].value
  } catch (error) {
    console.error('Error fetching real-time data:', error)
    return 1
  }
}


const onnxruntime = require('onnxruntime-node');
const fs = require('fs');

async function runInference(User_Traffic) {
    // Load the ONNX model
    const session = await onnxruntime.InferenceSession.create('./model.onnx');
 
    // Load the scaler parameters and label encoder parameters
    const scalerParams = JSON.parse(fs.readFileSync('scaler_params.json'));
    const labelEncoderParams = JSON.parse(fs.readFileSync('label_encoder_params.json'));

    // Input data (replace this with the actual input you want to standardize)
    const inputData = [User_Traffic, 10, 180, 0, 'SmartPhone', false];  // 'Category_1' is a categorical feature

    // Check if 'offer' is true (last value in input)
    const offer = inputData[inputData.length - 1];

    // If 'offer' is true, return -50
    if (offer === true) {
        console.log(-50);
        return;
    }

    // Remove 'offer' flag from the input data for the ONNX model
    const inputDataWithoutOffer = inputData.slice(0, -1);

    // Standardize the numerical input data using the scaler parameters
    const standardizedInput = inputDataWithoutOffer.slice(0, -1).map((value, index) => {
        return (value - scalerParams.mean[index]) / scalerParams.scale[index];
    });

    // Label encode the categorical feature using the label encoder parameters
    const encodedCategory = labelEncoderParams.classes.indexOf(inputDataWithoutOffer[inputDataWithoutOffer.length - 1]);

    // Combine the standardized numerical data and label encoded categorical feature
    const finalInput = [...standardizedInput, encodedCategory];

    // Create the input tensor for the model
    const tensor = new onnxruntime.Tensor('float32', new Float32Array(finalInput), [1, 5]);  // 8 features

    // Run inference
    const outputs = await session.run({ input: tensor });

    // Access the output
    console.log(outputs.variable.cpuData[0]);
}



fetchRealTimePages()
  .then(user_traffic => {
    console.log("user_traffic", user_traffic);
    runInference(user_traffic)
  })
  .catch(error => {
    console.error('Error:', error);
    runInference(user_traffic)
  })
  
  
  const axios = require('axios');

axios.get('https://webscraping-av2g.onrender.com/scrape')
  .then(response => {
    if (response.data.status === 'success') {
      console.log('Products:', response.data.data);
    } else {
      console.log('Error:', response.data.message);
    }
  })
  .catch(error => console.error('Error fetching data:', error));


