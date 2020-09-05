const path = require("path");
const fs = require("fs");
const util = require("util");

// Promisify using util for Asynchronous read/write to db.json file.
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = (app) => {

    const pathToDBfile = path.join(__dirname, "..", "db", "db.json");

    app.get("/api/notes", (req, res) => {

        //console.log("In api notes");
        fs.readFile(pathToDBfile, (err, data) => {
            if (err) {
                throw err;
            }
            //console.log(JSON.parse(data));
            return res.json(JSON.parse(data));
        })
    });

    //post will write the notes into db.json, don't know if there a better way than read first and 
    // then add the newly created notes that is in req body  -- check code agai!
    // Write better check - don't insert if the item is already in 
    app.post("/api/notes", (req, res) => {
        //console.log("In post");

        addANewNote(req.body);
        res.end("Saved");

    });

    app.delete("/api/notes/:id", (req, res) => {
        //console.group("In delete");
        //console.log(req.params.id);
        deleteANote(req.params.id);
        res.end("Deleted");
    });
    
    function addANewNote (newNote) {
        readFileAsync(pathToDBfile)
        .then ( data => {
            //console.log(JSON.parse(data));
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
                //console.log(arrayOfNotes);
                writeFileAsync(pathToDBfile, JSON.stringify(arrayOfNotes, null, 2))
                .then ( ()=>{
                    console.log("Successfully wrote to db.json file");
                })
            }
        });
    };
    
    function deleteANote(id) {
        // Add code to search for id and remove that note
        readFileAsync(pathToDBfile)
        .then ( data => {
            //console.log(JSON.parse(data));
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