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

const userRoutes = require('./routes/userRoutes');



const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
dbConnect();

// Middleware to parse incoming JSON and URL-encoded payload
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie parser middleware
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api/products', productRouter);
app.use("/api/user", authRouter);
app.use("/api/billing", billingRouter);
app.use("/api/cart", cartRouter); // Use cartRouter
app.use('/', userRoutes); 
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
