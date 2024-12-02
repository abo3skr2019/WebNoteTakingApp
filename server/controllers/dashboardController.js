const Notes = require("../models/Notes");
const mongoose = require("mongoose");




/* 
GET /
Dashboard
*/


exports.dashboard = async (req, res) => {
    const locals = {
        title: "Dashboard",
        description: "Free node.js Notes App",
    };
    res.render("dashboard/index", {
        userName: req.user.firstName,
        locals,
        layout : "../views/layouts/dashboard"
    });
}