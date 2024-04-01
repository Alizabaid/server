// Import required modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// MongoDB connection setup
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;
database.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
database.once('open', () => {
    console.log('Database Connected');
});

// Define data schema
const dataSchema = new mongoose.Schema({
    amount: Number,
    currency: String,
    phone: String,
    email: String,
    donorName: String,
    country: String,
    donationType: String
});

// Define model
const Data = mongoose.model("Data", dataSchema);

// Define route for handling POST requests
app.post('/', async (req, res) => {
    // Extract data from the request body
    const { amount, currency, phone, email, donorName, country, donationType } = req.body;

    // Create a new instance of the Data model
    const newData = new Data({
        amount: amount,
        currency: currency,
        phone: phone,
        email: email,
        donorName: donorName,
        country: country,
        donationType: donationType
    });

    try {
       
        await newData.save();

        console.log("Data Saved");
        res.send("Data Saved");
    } catch (error) {
        console.error("Error saving data:", error); // Log the error
        res.status(500).send("Error saving data");
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
