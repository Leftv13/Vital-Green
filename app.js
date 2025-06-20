const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
const path = require("path");
const loginRouter = require("./controllers/login");
const usersRouters = require("./controllers/users.js"); 
const { userExtractor } = require("./middleware/auth");
const productsRouter = require("./controllers/products");
//const logoutRouter = require("./controllers/logout");
const { MONGO_URI } = require("./config");
const {PAGE_URL} = require("./config");


(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

//Middleware
app.use(cors({
  origin: PAGE_URL,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas BackEnd

app.use("/api/users", usersRouters);
app.use("/api/login", loginRouter); 
//app.use("/api/logout", logoutRouter); (temporal)
app.use("/api/products", productsRouter);

// Rutas FrontEnd
app.use("/", express.static(path.join(__dirname, "views", "home")));
app.use('/styles', express.static(path.join(__dirname, "views", "styles")));
app.use('/verify/:id/:token', express.static(path.join(__dirname, "views", "verify")));
app.use("/signup", express.static(path.join(__dirname, "views", "signup")));
app.use("/login", express.static(path.join(__dirname, "views", "login")));
//app.use("/admView", express.static(path.join(__dirname, "views", "store"))); (temporal)
app.use("/components", express.static(path.join(__dirname, "views", "components")));
app.use("/images", express.static(path.join(__dirname, "imgs")));

//Morgan
app.use(morgan('tiny'))



module.exports = app;