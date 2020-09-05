const path = require("path");

module.exports = (app) => {


    app.get("/notes", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "public", "notes.html"));
        //res.sendFile(path.join(__dirname, "public", "notes.html"));
    });
    
    // This was added as Heroku guide said that there should be atleast one "/" for route
    app.get ("/", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "public", "index.html"));
        
    });


    // If no matching route default to index.html
    app.get ("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "public", "index.html"));
        
    });

};