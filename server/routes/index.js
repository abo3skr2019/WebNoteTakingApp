const express = require("express");
const router = express.Router();
const mainController = require("../controllers/MainController");

/*
App Routes
*/

router.get("/", mainController.homepage);
router.get("/about", mainController.about);
router.get("/faq", mainController.faq);
router.get("/features", mainController.features);

module.exports = router;