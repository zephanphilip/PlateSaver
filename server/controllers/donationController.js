
const Donation = require("../models/donationModel")

// post a  donation
const donation = async (req, res) => {
    try {
        const { userId, foodDetails, quantity, expiryDate, allergyInfo, location } = req.body;
    
        // Validate required fields
        if (!userId || !foodDetails || !quantity || !expiryDate || !location) {
          return res.status(400).json({ message: "All required fields must be filled." });
        }
    
        // Create a new donation entry
        const donation = new Donation({
          userId,
          foodDetails,
          quantity,
          expiryDate,
          allergyInfo,
          location,
        });
    
        // Save the donation to the database
        await donation.save();
    
        res.status(201).json({ message: "Donation submitted successfully.", donation });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while submitting the donation." });
      }
    }


module.exports = {donation};