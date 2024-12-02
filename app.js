require("dotenv").config();
const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const connectDB = require("./server/config/db");
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')


const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 86400000} // 24 hours
}))

app.use(passport.initialize());
app.use(passport.session());

// Connect to database
connectDB();
// Static files 
app.use(express.static("public"));
// Set template engine
app.use(expresslayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/index"));
app.use("/", require("./server/routes/dashboard"));


// Handle 404
app.get("*", function(req, res)
  {
    res.status(404).render("404");
  })


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 