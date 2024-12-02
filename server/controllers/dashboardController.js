const Notes = require("../models/Notes");
const mongoose = require("mongoose");




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
POST /dashboard/item:id
Dashboard Update Note
*/

exports.dashboardUpdateNote = async (req, res) => {
    try {
        const note = await Notes.findOne({ _id: req.params.id });
        note.title = req.body.title;
        note.body = req.body.body;
        note.save();
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }
}