const Notes = require("../models/Notes");
const mongoose = require("mongoose");
const { search } = require("../routes");




/* 
GET /
Dashboard
*/


exports.dashboard = async (req, res) => {
    let perpage = 12;
    let page = req.query.page || 1;

    const locals = {
        title: "Dashboard",
        description: "Free node.js Notes App",
    };


    try {
        
        const notes =await Notes.aggregate([
            {
                $sort: {
                     updatedAt: -1,
                     }
            },
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $project:
                {
                    title:{ $substr: [ "$title", 0, 30 ] },
                    body:{ $substr: [ "$body", 0, 100 ] },
                }
            }
        ])
        .skip((perpage * page) - perpage)
        .limit(perpage)
        .exec() 

        const count = await Notes.countDocuments({user: req.user._id});


        res.render("dashboard/index", {
            userName: req.user.firstName,
            locals,
            notes,
            layout : "../views/layouts/dashboard",
            current : page,
            pages: Math.ceil(count / perpage)
        });
    
    } catch (error) {
        console.log(error);
    }

}

/*
GET /dashboard/item:id
Dashboard View Note
*/
exports.dashboardViewNote = async (req, res) => {
    try {
        const note = await Notes.findById({ _id: req.params.id })
        .where({ user: req.user._id })
        .lean();
        if(note)
            {
                res.render("dashboard/view-note", {
                    noteID: req.params.id,
                    note,
                    layout : "../views/layouts/dashboard"
                });
            }else
            {
                res.send("Note not found");
            }
        }catch (error) {
        console.log(error);
    }
}

/*
PUT /dashboard/item:id
Dashboard Update Note
*/

exports.dashboardUpdateNote = async (req, res) => {
    try {
        await Notes.findOneAndUpdate(
            { _id: req.params.id }, 
            {title: req.body.title, body: req.body.body, updatedAt:Date.now()}).where({ user: req.user._id });
        res.redirect("/dashboard");   
    } catch (error) {
        console.log(error);
    }
}

/*
DELETE /dashboard/item-delete:id
Dashboard Delete Note
*/


exports.dashboardDeleteNote = async (req, res) => {
    try {
        await Notes.deleteOne({ _id: req.params.id }).where({ user: req.user._id });
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }
}

/*
GET /dashboard/add
Dashboard Add Note
*/

exports.dashboardAddNote = async(req, res) => {
    res.render("dashboard/add-note", {
        layout : "../views/layouts/dashboard"
    });
}

/*
POST /dashboard/add
Dashboard Add Note Submit
*/
exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
        await Notes.create({
            title: req.body.title,
            body: req.body.body,
            user: req.user._id
        });
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }
}

/*
GET /dashboard/search
Dashboard Search
*/

exports.dashboardSearch = async (req, res) => {
    try {
        res.render("dashboard/search", {
            searchResults: '',
            layout : "../views/layouts/dashboard"
        });
    } catch (error) {
        console.log(error);
        
    }
}

/*
POST /dashboard/search
Dashboard Search Submit
*/
exports.dashboardSearchSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const sanitizedSearchTerm = searchTerm.replace(/[^a-zA-Z0-9\s.,-]/g, '');
        const searchResults = await Notes.find({
            $or: [
                {title: { $regex: new RegExp(sanitizedSearchTerm,'i')}},
                {body: { $regex: new RegExp(sanitizedSearchTerm,'i')}},
            ]
        }).where({ user: req.user._id });
        res.render("dashboard/search", {
            searchResults,
            layout : "../views/layouts/dashboard"
        });
    } catch (error) {
        console.log(error);
    }
}