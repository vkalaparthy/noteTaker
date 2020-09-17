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
    // post will write the notes into db.json
    // and then returns the new note to the client
    app.post("/api/notes", (req, res) => {
        let id = 0;
        readFileAsync("count.txt")
        .then(data => {
            id = parseInt(data) + 1;      
            req.body.id = id;
            let info = id;

            fs.writeFile("count.txt", info, function(err) {
                if (err) {
                    return console.log(err);
                }
                
                console.log("Success!");
            });
            res.json(addANewNote(req.body));
        });

    });

    // API DELETE Requests
    // This code will delete the note that user wants to delete from db.json
    app.delete("/api/notes/:id", (req, res) => {
        deleteANote(req.params.id);
        res.end("Deleted");
    });
    
    function addANewNote (newNote) {
    
        readFileAsync(pathToDBfile)
        .then ( data => {
            let arrayOfNotes = JSON.parse(data);
            let duplicate = false;
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
        return (JSON.stringify(newNote));
    };
    
    // This function is going to search for note that has the id 
    //  and remove that note from the db.json
    function deleteANote(id) {
        readFileAsync(pathToDBfile)
        .then ( data => {
            let arrayOfNotes = JSON.parse(data);
            for (let i=0; i<arrayOfNotes.length; i++) {
                if (arrayOfNotes[i].id === parseInt(id)) {
                    arrayOfNotes.splice(i, 1);
                }
            }
            //console.log(arrayOfNotes);
            writeFileAsync(pathToDBfile, JSON.stringify(arrayOfNotes, null, 2))
            .then ( ()=>{
                console.log("Successfully wrote to db.json file");
            })
        });
    };
    

};