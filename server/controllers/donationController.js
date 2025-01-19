
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


    // Get all non-expired donations made by a user
const getUserDonations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate the userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Find donations where expiryDate is in the future and userId matches
    const currentDate = new Date();
    const donations = await Donation.find({
      userId: userId,
      expiryDate: { $gt: currentDate },
    }).select('foodDetails quantity expiryDate allergyInfo location isAccepted recipient');

    res.status(200).json({ donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching user donations.' });
  }
};


module.exports = {donation, getUserDonations};