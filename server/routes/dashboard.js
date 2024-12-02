const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/checkAuth");
const dashboardController = require("../controllers/dashboardController");


/*
Dashboard Routes
*/
router.get("/dashboard", isLoggedIn,dashboardController.dashboard);
router.get("/dashboard/item/:id", isLoggedIn,dashboardController.dashboardViewNote);
router.post("/dashboard/item/:id", isLoggedIn,dashboardController.dashboardUpdateNote);




module.exports = router;