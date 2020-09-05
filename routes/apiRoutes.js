const path = require("path");
const fs = require("fs");
const util = require("util");

// Promisify using util for Asynchronous read/write to db.json file.
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = (app) => {

    const pathToDBfile = path.join(__dirname, "..", "db", "db.json");

    // API GET Request
    // The below code is used to display the JSON data in the file
    // The JSON data represents the saved notes
    app.get("/api/notes", (req, res) => {

        fs.readFile(pathToDBfile, (err, data) => {
            if (err) {
                throw err;
            }
            return res.json(JSON.parse(data));
        })
    });

    // API POST Requests
    // post will write the notes into db.json,  when the user saves the newly created note
    app.post("/api/notes", (req, res) => {
        //console.log("In post");

        addANewNote(req.body);
        res.end("Saved");

    });

    // API DELETE Requests
    // This code will delete the note that user wants to delete
    app.delete("/api/notes/:id", (req, res) => {
        deleteANote(req.params.id);
        res.end("Deleted");
    });
    
    function addANewNote (newNote) {
        readFileAsync(pathToDBfile)
        .then ( data => {
            let arrayOfNotes = JSON.parse(data);
            let duplicate = false;
            newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();
            for (let i=0; i<arrayOfNotes.length; i++) {
                if (arrayOfNotes[i].id === newNote.id) {
                    duplicate = true;
                }
            }
            if(!duplicate) {
                arrayOfNotes.push(newNote);
                writeFileAsync(pathToDBfile, JSON.stringify(arrayOfNotes, null, 2))
                .then ( ()=>{
                    console.log("Successfully wrote to db.json file");
                })
            }
        });
    };
    
    // This function is going to search for id and remove that note from the db.json file
    function deleteANote(id) {
        readFileAsync(pathToDBfile)
        .then ( data => {
            let arrayOfNotes = JSON.parse(data);
            for (let i=0; i<arrayOfNotes.length; i++) {
                if (arrayOfNotes[i].id === id) {
                    arrayOfNotes.splice(i, 1);
                }
            }
            console.log(arrayOfNotes);
            writeFileAsync(pathToDBfile, JSON.stringify(arrayOfNotes, null, 2))
            .then ( ()=>{
                console.log("Successfully wrote to db.json file");
            })
        });
    };
    

};