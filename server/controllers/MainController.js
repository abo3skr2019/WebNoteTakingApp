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

/*
Get /faq
FAQ page
*/
exports.faq = async (req, res) => {
    const locals = {
        title: "FAQ",
        description: "Welcome to the FAQ page",
    };
    res.render("faq", locals);
}

/*
Get /features
Features page
*/
exports.features = async (req, res) => {
    const locals = {
        title: "Features",
        description: "Discover the features of our application",
    };
    res.render("features", locals);
}