require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
// const cors     = require("cors");
const path     = require("path");
const app      = express();
 
const PORT     = process.env.PORT || 4339;
const DB_URI   = process.env.DB_URI
const DB       = process.env.DB;
 
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
 
// Establish DB connection
mongoose.connect(DB_URI + DB, {
   useUnifiedTopology: true,
   useNewUrlParser: true,

   connectTimeoutMS: 10000
});
 
const db = mongoose.connection;
 
// Event listeners
db.once('open', () => console.log(`Connected to ${DB} database`));
 
// Create Schema
let NoteSchema = new mongoose.Schema(
   {
      title: String,
      content: String
   },
   { collection: "note" }
);
 
// Create Model
let NoteModel = db.model("NoteModel", NoteSchema);
 
// Route to Get all People
app.get("/api/note", (req, res) => {
   NoteModel.find({}, {__v: 0}, (err, docs) => {
      if (!err) {
         res.json(docs);
      } else {
         res.status(400).json({"error": err});
      }
   });
})
 
// Route to Add a Person
app.post("/api/note/add", async(req, res) => {
   let note = new NoteModel(req.body);
   
   try {
    const result = await note.save();
    delete result._doc.__v;
    res.json(result._doc);
  } catch (err) {
    res.status(400).json({"error": err});
  }
  
})
 
app.listen(PORT, () => {
   console.log(app.get("env").toUpperCase() + " Server started on port " + (PORT));
});