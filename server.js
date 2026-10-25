require("dotenv").config();

const express = require ('express');
const ejs = require ('ejs');
const path = require ('path');

const DBConnection = require ('./src/config/dbcon');

const app = express();

// Database Connection
DBConnection();

// EJS Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Static Files
app.use(express.static(path.join(__dirname,'public')));

// Local uploads (only needed if using local image storage)
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

// Product Router
const productRouter = require('./src/router/product.router');
app.use('/products',productRouter);

// Brand Router
const brandRouter = require('./src/router/brand.router');
app.use('/brand',brandRouter);

// Category Router
const categoryRouter = require('./src/router/category.router');
app.use('/categories',categoryRouter);

// Server
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server is runing ${port}`)
})