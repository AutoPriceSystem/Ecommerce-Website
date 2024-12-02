import React from 'react';
import axios from "axios";
import { useOffer } from '../contexts/OfferContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {useProduct} from '../contexts/ProductContext'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashBoard = () => {
    const [product, setProduct] = React.useState({});
    const [selectedProductId, setSelectedProductId] = React.useState("");
    const [currentMonthIndex, setCurrentMonthIndex] = React.useState(new Date().getMonth()); // Track current month (0-11)
    const [salesData, setSalesData] = React.useState(null); // Store the sales data for the current month
    const {toggleOffer, Offer} = useOffer()
    const {Products} = useProduct()
function FetchProductDetails(id){
    axios.post("https://autopricesystem.onrender.com/api/products/getSingleProduct", {
        product_id: id
    })
        .then((res) => setProduct(res.data.data))
        .catch((error) => console.error("Error fetching single product:", error));
}

    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const getSalesDataForMonth = (month) => {
        if (!product.sales_history) return { days: [], sales: [] };

        const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);  // Days 1 to 30
        const dailySales = new Array(30).fill(0);  // Initialize daily sales to 0

        product.sales_history.forEach((sale) => {
            const [year, saleMonth, saleDay] = sale.date.split("-").map(Number); // Parse the "YYYY-MM-DD" format
            if (saleMonth - 1 === month) { // Months are 0-indexed in JavaScript
                const saleValue = sale.quantity * sale.price;
                dailySales[saleDay - 1] += saleValue; // Sum up sales for each day
            }
        });

        return { days: daysInMonth, sales: dailySales };
    };
    const handleChange = (event) => {
        const selectedId = event.target.value;
        setSelectedProductId(selectedId);
    
        // Find the selected product to log details
        const selectedProduct = Products.find((product) => product._id === selectedId);
        if (selectedProduct) {
          FetchProductDetails(selectedProduct._id)
        }
      };
    // Fetch sales data every time the month changes
    React.useEffect(() => {
        const { days, sales } = getSalesDataForMonth(currentMonthIndex);
        setSalesData({ days, sales });
    }, [currentMonthIndex, product.sales_history]); // Trigger on month or product data change

    // Chart data configuration
    const chartData = {
        labels: salesData ? salesData.days : [],  // x-axis: days of the month
        datasets: [
            {
                label: 'Sales History',
                data: salesData ? salesData.sales : [],  // y-axis: daily sales
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            }
        ]
    };

    // Chart options
    const chartOptions = {
        scales: {
            x: {
                title: { display: true, text: 'Day of the Month' },
            },
            y: {
                title: { display: true, text: 'Sales Value ($)' },
                min: 0,
                max: 10000,
            }
        }
    };

    // Handle month toggle
    const toggleMonth = (increment) => {
        setCurrentMonthIndex(prevMonthIndex => (prevMonthIndex + increment + 12) % 12);
    };

    const averagePercentageDifference = product.sales_history && product.Original_Price
        ? product.sales_history.length>0 ?product.sales_history.reduce((sum, sales) => {
            const percentageDifference = ((sales.price - product.Original_Price) / product.Original_Price) * 100;
            return sum + percentageDifference;
        }, 0) / product.sales_history.length
        :0
        : null;
    
    
    return (
        <div style={{textAlign:'center'}}>

<div>
      <h3 >Choose a product to monitor Sales </h3>
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
          {product._id &&<>
            <h1>{product.Title} Sales</h1>
            <img src={product.Image} alt={product.Title}   style={{ maxWidth: "75%", maxHeight: "50%", display: "block", margin: "0 auto" }} />
          
            <p>Original Price ${product.Original_Price}</p>
            {averagePercentageDifference !== null ? (
                <p>Profit / Loss Percentage: {averagePercentageDifference.toFixed(2)}%</p>
            ) : (
                <p>Loading sales history or original price...</p>
            )}
            <p>Current Month: {months[currentMonthIndex]}</p>

            {/* Month Toggle Buttons */}
            <div>
                <button onClick={() => toggleMonth(-1)}>&lt; Previous</button>
                <button onClick={() => toggleMonth(1)}>Next &gt;</button>
            </div>

            {/* Sales data chart */}
            {salesData && (
                <Line data={chartData} options={chartOptions}      style={{ maxWidth: "100%", height: "auto" }} />
            )}
        </>}
        <br />

<div>
        <button onClick={()=>toggleOffer()}>{Offer ? 'Disable' : 'Enable'} Season Offer</button>
        <p>Season Offer: {Offer ? "Yes" : "No"}</p>

          
        </div>

        </div>
    );
};

export default AdminDashBoard;
