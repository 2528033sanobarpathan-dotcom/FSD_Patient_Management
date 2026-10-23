const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const PORT = 3000;

//Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/patientDB")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

// 2. Define Patient Schema
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Patient name is required"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [0, "Age must be a positive number"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Other"],
  },
  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
  },
});

//Mongoose model for Patient
const Patient = mongoose.model("Patient", patientSchema);

//REST API ENDPOINTS

// CREATE - Add a Patient
app.post("/patients", async (req, res) => {
  try {

    const patient = await Patient.create(req.body);
    
    res.status(201).json(patient);

  } catch (err) {

    res.status(400).json({ error: err.message });

  }
});

// READ - Get All Patients
app.get("/patients", async (req, res) => {
  try {

    const patients = await Patient.find();

    res.json(patients);
    
  } catch (err) {

    res.status(500).json({ error: err.message });

  }
});

// READ - Get Single Patient by ID
app.get("/patients/:id", async (req, res) => {
  try {

    const patient = await Patient.findById(req.params.id);

    if (!patient) 
    {
      return res.status(404).json({ message: "Patient not found" });
    } 
    res.json(patient);

  } catch (err) {

    res.status(400).json({ error: err.message });

  }
});

// UPDATE - Update Patient by ID
app.put("/patients/:id", async (req, res) => {
  try {

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) 
    {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);

  } catch (err) {

    res.status(400).json({ error: err.message });

  }
});

// DELETE - Delete Patient by ID
app.delete("/patients/:id", async (req, res) => {
  try {

    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) 
    {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient record deleted successfully" });

  } catch (err) {

    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});