const express = require("express")
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
// const path = require("path");
const cors = require('cors');
const cloudinary = require("cloudinary")
const connectDatabase = require("./config/database");
const PORT = process.env.PORT || 3000;

const errorMiddleware = require("./middleware/error");


dotenv.config({
    path: "./.env",
})

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", (req, res)=>{
    res.send("hello world");
})

const user = require("./routes/user");
const employee = require("./routes/employee");
// const order = require("./routes/orderRoute");
// const payment = require("./routes/paymentRoute");


app.use("/api/v1", user);
app.use("/api/v1", employee);
// app.use("/api/v1", order);
// app.use("/api/v1", payment);

app.use(errorMiddleware);

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})



const server = app.listen(PORT, () => {
    console.log(`Server is working on http://localhost:${PORT}`);
});

process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    })
})

