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

//post will write the notes into db.json, don't know if there a better way than read first and 
// then add the newly created notes that is in req body  -- something is wrong with this POST
app.post("/api/notes", (req, res) => {
    console.log("In post");

    fs.readFile(path.join(__dirname, "db", "db.json"), (err, data) => {
        if (err) {
            throw err;
        }
        console.log(JSON.parse(data));
        let arrayOfNotes = JSON.parse(data);
        arrayOfNotes.push(req.body);
        console.log(arrayOfNotes);

        fs.writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(arrayOfNotes, null, 2), (err) => {
            if (err) {
            throw err;
            }
        
            console.log("Successfully wrote to db.json file");
        });
    })
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});