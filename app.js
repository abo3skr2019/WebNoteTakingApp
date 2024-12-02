require("dotenv").config();
const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const connectDB = require("./server/config/db");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to database
connectDB();
// Static files 
app.use(express.static("public"));
// Set template engine
app.use(expresslayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes
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