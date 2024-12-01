require("dotenv").config();
const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static files 
app.use(express.static("public"));
// Set template engine
app.use(expresslayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("/", require("./server/routes/index"));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 