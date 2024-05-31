const express = require("express");
const router = express.Router();
const { connectDB } = require("./db");
const { ObjectId } = require("mongodb"); // Ensure ObjectId is imported correctly

let studentsCollection;
let feesCollection;

async function connectToDB() {
  try {
    const db = await connectDB();
    studentsCollection = db.collection("students");
    feesCollection = db.collection("fees");
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

connectToDB().catch((error) => console.error("Error connecting to database:", error));
// Update student balance
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;

  try {
    const result = await studentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { balance: balance } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Balance updated successfully" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error updating balance:", error);
    res.status(500).json({ error: error.message });
  }
});


// Insert fee details
router.post("/", async (req, res) => {
  try {
    const {  paid, paidDate, feeRemarks, intern} = req.body;

    const feeData = {
      paid,
      paidDate,
      feeRemarks,
      intern,
    };

    await feesCollection.insertOne(feeData);

    res.status(201).send("Fee details added successfully!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error adding fee details.");
  }
});
router.post("/ins", async (req, res) => {
  try {
    const { doj, advanceFees, feesRemarks, internId } = req.body;

    const feeData = {
      paid: advanceFees,
      paidDate: doj,
      feeRemarks: feesRemarks,
      intern: internId,
    };

    await feesCollection.insertOne(feeData);

    res.status(201).json({ message: "Fee details added successfully!" });
  } catch (error) {
    console.error("Error adding fee details:", error);
    res.status(500).json({ message: "Error adding fee details." });
  }
});

router.get('/', async (req, res) => {
  try {
    const fees = await feesCollection.find({}).toArray();
    res.status(200).json(fees);
  } catch (error) {
    console.error("Error fetching fees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
