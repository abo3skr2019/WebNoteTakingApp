/*
Get / 
Home page
*/

exports.homepage = async (req, res) => {
    const locals = {
        title: "Home",
        description: "Welcome to the homepage",
    };
    res.render("index", {
        locals,
        layout : "../views/layouts/front-page"
    });
}

/*
Get /about
About page
*/

exports.about = async (req, res) => {
    const locals = {
        title: "About",
        description: "Welcome to the about page",
    };
    res.render("about", locals);
}