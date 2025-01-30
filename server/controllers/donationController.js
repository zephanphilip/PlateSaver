
const Donation = require("../models/donationModel")

// post a  donation
const donation = async (req, res) => {
    try {
        const { userId, email, foodDetails, quantity, expiryDate, allergyInfo, location } = req.body;
    
        // Validate required fields
        if (!userId || !foodDetails || !quantity || !expiryDate || !location) {
          return res.status(400).json({ message: "All required fields must be filled." });
        }
    
        // Create a new donation entry
        const donation = new Donation({
          userId,
          email,
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

// Get all available non-expired donations
const getAvailableDonations = async (req, res) => {
  try {
   
    // Find donations where expiryDate is in the future and userId matches
    const currentDate = new Date();
    const donations = await Donation.find({
      isAccepted : false,
      expiryDate: { $gt: currentDate },
    }).select('foodDetails email quantity expiryDate allergyInfo location isAccepted recipient');

    res.status(200).json({ donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching user donations.' });
  }
};

// Accept a donation
const acceptDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { userId, name, phoneNumber, location } = req.body;

    // Validate required fields
    if (!userId || !name || !phoneNumber || !location) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Find and update the donation
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    if (donation.isAccepted) {
      return res.status(400).json({ message: 'This donation has already been accepted.' });
    }

    donation.isAccepted = true;
    donation.recipient = {
      userId,
      name,
      phoneNumber,
      location,
      acceptedAt: new Date()
    };

    await donation.save();

    res.status(200).json({ message: 'Donation accepted successfully.', donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while accepting the donation.' });
  }
};


module.exports = {donation, getUserDonations, getAvailableDonations, acceptDonation};