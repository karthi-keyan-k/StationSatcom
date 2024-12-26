

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
    package: String,
    companyName: String,
    contact: String,
    email: String,
    history: [{
        modifiedBy: String,
        modifiedAt: { type: Date, default: Date.now }, 
        changes: Object 
    }]
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


// Update an entry and log history
app.put("/api/details/:id", async (req, res) => {
    try {
        const { serviceName, package: newPackage, modifiedBy } = req.body;

        const existingDetail = await Details.findById(req.params.id);
        if (!existingDetail) {
            return res.status(404).json({ error: "Details not found" });
        }

        const changes = {
            serviceName,
            package: newPackage
        };

        const historyEntry = {
            modifiedBy,
            modifiedAt: new Date(), // Use current date and time
            changes: {
                serviceName: existingDetail.serviceName,
                package: existingDetail.package
            }
        };

        existingDetail.history.push(historyEntry);

        existingDetail.serviceName = serviceName;
        existingDetail.package = newPackage;

        const updatedDetails = await existingDetail.save();
        res.json(updatedDetails);
    } catch (err) {
        console.error("Error updating details:", err);
        res.status(500).json({ error: "Error updating details" });
    }
});




// Get history of an entry
app.get("/api/details/:id/history", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching history for ID: ${id}`); // Debug log
        const detail = await Details.findById(id, 'history');
        if (!detail) {
            console.error(`Details not found for ID: ${id}`); // Log missing entry
            return res.status(404).json({ error: "Details not found" });
        }
        res.json(detail.history);
    } catch (err) {
        console.error("Error fetching history:", err); // Log unexpected errors
        res.status(500).json({ error: "Error fetching history" });
    }
});



app.delete("/api/details/:id", async (req, res) => {
    try {
        await Details.findByIdAndDelete(req.params.id);
        res.json({ message: "Details deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting details" });
    }
});

// Serve static frontend files




const ServiceNameSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

const ServiceName = mongoose.model("ServiceName", ServiceNameSchema);

app.post("/api/services", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Service name is required" });
    }

    try {
        const newService = new ServiceName({ name });
        const savedService = await newService.save();
        res.json(savedService);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: "Service name already exists" });
        } else {
            res.status(500).json({ error: "Error saving service name" });
        }
    }
});
app.get("/api/services", async (req, res) => {
    try {
        const services = await ServiceName.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Error fetching service names" });
    }
});



// Delete a service name
app.delete("/api/services/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const decodedName = decodeURIComponent(name);
        const deletedService = await ServiceName.findOneAndDelete({ name: decodedName });
        if (deletedService) {
            res.json({ message: "Service name deleted successfully" });
        } else {
            res.status(404).json({ error: "Service name not found" });
        }
    } catch (err) {
        console.error("Error deleting service name:", err);
        res.status(500).json({ error: "Error deleting service name" });
    }
});






const ShipNameSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

const ShipName = mongoose.model("ShipName", ShipNameSchema);

// Add a new ship name
app.post("/api/ships", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Ship name is required" });
    }

    try {
        const newShip = new ShipName({ name });
        const savedShip = await newShip.save();
        res.json(savedShip);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: "Ship name already exists" });
        } else {
            res.status(500).json({ error: "Error saving ship name" });
        }
    }
});

// Fetch all ship names
app.get("/api/ships", async (req, res) => {
    try {
        const ships = await ShipName.find();
        res.json(ships);
    } catch (err) {
        res.status(500).json({ error: "Error fetching ship names" });
    }
});

// Delete a ship name
app.delete("/api/ships/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const deletedShip = await ShipName.findOneAndDelete({ name });
        if (deletedShip) {
            res.json({ message: "Ship name deleted successfully" });
        } else {
            res.status(404).json({ error: "Ship name not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error deleting ship name" });
    }
});




app.use(express.static(path.join(__dirname, "public")));

// Catch-all route to serve index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



