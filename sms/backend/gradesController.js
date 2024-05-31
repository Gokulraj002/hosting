const express = require("express");
const router = express.Router();
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

let gradesCollection;

async function connectToDB() {
    try {
        const db = await connectDB();
        gradesCollection = db.collection("grades");
        
    } catch (error) {
        console.error("Error connecting to collection:", error);
        throw error;
    }
}

// Call connectToDB to establish the connection
connectToDB().catch(error => console.error("Error connecting to database:", error));

router.post("/", async (req, res) => {
        const { grade, detail } = req.body;
        const result = await gradesCollection.insertOne({ grade, detail });
        res.status(201).json({ message: "Grade added successfully" });

});

router.get("/", async (req, res) => {
    
        const grades = await gradesCollection.find({}).toArray();
        res.status(200).json(grades);

});

router.put("/:id", async (req, res) => {
    try {
        const gradeId = req.params.id;
        if (!ObjectId.isValid(gradeId)) {
            return res.status(400).json({ message: "Invalid gradeId" });
        }
        const updatedGradeData = req.body;
        await gradesCollection.updateOne({ _id: new ObjectId(gradeId) }, { $set: updatedGradeData });
        res.status(200).json({ message: "Grade data updated successfully" });
    } catch (error) {
        console.error("Error updating grade data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid grade ID" });
        }
        const result = await gradesCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Grade deleted successfully" });
        } else {
            return res.status(404).json({ message: "Grade not found" });
        }
    } catch (error) {
        console.error("Error deleting grade:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
