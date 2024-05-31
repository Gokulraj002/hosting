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
        // console.log("Connected to collections");
    } catch (error) {
        console.error("Error connecting to collections:", error);
        throw error;
    }
}

connectCollection().catch(error => console.error("Error connecting to database:", error));

// insert sutdent information in collection

router.post("/", async (req, res) => {
  try {
    const studentData = req.body;
    await studentsCollection.insertOne(studentData);
    res.status(201).send("Student added successfully!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error adding student.");
  }
});

// Get the inserted value in table
router.get("/", async (req, res) => {
        const students = await studentsCollection.find({}).toArray();
        res.status(200).json(students);

});



// insert values in inactive collection 
router.post("/deleted1", async (req, res) => {
  try {
    const deletedStudent = req.body;
    deletedStudent._id = new ObjectId();
    const existingStudent = await deletedStudentsCollection.findOne({ _id: deletedStudent._id });
    if (existingStudent) {
      return res.status(400).json({ error: "Student with the same ID already exists" });
    }
    await deletedStudentsCollection.insertOne(deletedStudent);
    res.status(201).json({ message: "Deleted student saved successfully" });
  } catch (error) {
    console.error("Error inserting deleted student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// deleted that inserted data in inactive collection
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const result = await studentsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
          res.status(200).json({ message: "Student deleted successfully" });
      } else {
          res.status(404).json({ message: "Student not found" });
      }
  } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

// form eidt 
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const studentData = req.body;
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const result = await studentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: studentData }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Student updated successfully" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;



