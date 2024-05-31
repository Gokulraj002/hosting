const express = require("express");
const router = express.Router();
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

let studentsCollection;
let deletedStudentsCollection;

async function connectCollection() {
    try {
        const db = await connectDB();
        studentsCollection = db.collection("students");
        deletedStudentsCollection = db.collection("inactives");
    } catch (error) {
        console.error("Error connecting to collections:", error);
        throw error;
    }
}

connectCollection().catch(error => console.error("Error connecting to database:", error));

// get the inserted value in inactive colection

router.get("/deleted", async (req, res) => {
    const deletedStudents = await deletedStudentsCollection.find({}).toArray();
    res.status(200).json(deletedStudents);
  });
  


//   insert value in student collection 
router.post("/", async (req, res) => {
    const studentData = req.body;
    studentData._id = new ObjectId();
    // Check if the _id already exists in the collection
    const existingStudent = await studentsCollection.findOne({ _id: studentData._id });
    if (existingStudent) {
        return res.status(400).json({ error: "Student with the same _id already exists" });
    }

    // Insert the student data into the collection
    try {
        await studentsCollection.insertOne(studentData);
        res.status(201).json({ message: "Student inserted successfully" });
    } catch (error) {
        console.error("Error inserting student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// delete value in inactive collection 
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deletedStudentsCollection.deleteOne({ _id: new ObjectId(id)});
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Student deleted successfully" });
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Error deleting student" });
    }
  });


module.exports = router;
