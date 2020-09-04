const express = require("Express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {

    console.log("In api notes");
    fs.readFile(path.join(__dirname, "db", "db.json"), (err, data) => {
        if (err) {
            throw err;
        }
        console.log(JSON.parse(data));
        return res.json(JSON.parse(data));
    })
});

app.get ("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
    
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});