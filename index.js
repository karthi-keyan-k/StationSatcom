require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define Schema and Model
const DetailsSchema = new mongoose.Schema({
    employerName: String,
    shipName: String,
    imoNumber: String,
    serviceDate: String,
    serviceName: String,
    package: Number,
    companyName: String,
    contact: String,
    email: String,
});

const Details = mongoose.model("Details", DetailsSchema);

// API Routes

// Get all details
app.get("/api/details", async (req, res) => {
    const { query, filterBy } = req.query;
    let filter = {};

    if (query && filterBy) {
        switch (filterBy) {
            case "ship":
                filter.shipName = { $regex: query, $options: "i" };
                break;
            case "service":
                filter.serviceName = { $regex: query, $options: "i" };
                break;
            case "imo":
                filter.imoNumber = { $regex: query, $options: "i" };
                break;
            default:
                return res.status(400).json({ error: "Invalid filterBy value" });
        }
    }

    try {
        const details = await Details.find(filter);
        res.json(details);
    } catch (err) {
        res.status(500).json({ error: "Error fetching details" });
    }
});

// Add a new entry
app.post("/api/details", async (req, res) => {
    try {
        const newDetails = new Details(req.body);
        const savedDetails = await newDetails.save();
        res.json(savedDetails);
    } catch (err) {
        res.status(500).json({ error: "Error saving details" });
    }
});

// Update an entry
app.put("/api/details/:id", async (req, res) => {
    try {
        const updatedDetails = await Details.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updatedDetails);
    } catch (err) {
        res.status(500).json({ error: "Error updating details" });
    }
});

// Delete an entry
app.delete("/api/details/:id", async (req, res) => {
    try {
        await Details.findByIdAndDelete(req.params.id);
        res.json({ message: "Details deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting details" });
    }
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Catch-all route to serve index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
