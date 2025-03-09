const Donation = require("../models/donationModel");

// post a donation
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
      // Initialize remaining quantity to equal total quantity
      remainingQuantity: quantity
    });

    // Save the donation to the database
    await donation.save();

    res.status(201).json({ message: "Donation submitted successfully.", donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while submitting the donation." });
  }
};

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
    }).select('foodDetails quantity expiryDate allergyInfo location isAccepted recipient recipients remainingQuantity');

    res.status(200).json({ donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching user donations.' });
  }
};

// Get all available non-expired donations
const getAvailableDonations = async (req, res) => {
  try {
    // Find donations where expiryDate is in the future and have remaining quantity
    const currentDate = new Date();
    const donations = await Donation.find({
      remainingQuantity: { $gt: 0 },
      expiryDate: { $gt: currentDate },
    }).select('foodDetails email quantity expiryDate allergyInfo location isAccepted recipient recipients remainingQuantity');

    res.status(200).json({ donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching available donations.' });
  }
};

// Accept a donation
const acceptDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { userId, name, phoneNumber, location, requestedQuantity } = req.body;

    // Validate required fields
    if (!userId || !name || !phoneNumber || !location || !requestedQuantity) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Find the donation
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    // Check if there's enough quantity available
    const currentRemainingQuantity = donation.remainingQuantity !== undefined ? 
      donation.remainingQuantity : donation.quantity;
    
    if (requestedQuantity <= 0 || requestedQuantity > currentRemainingQuantity) {
      return res.status(400).json({ 
        message: `Invalid quantity requested. Available quantity: ${currentRemainingQuantity}` 
      });
    }

    // Update the donation with the new recipient and quantity
    const newRemainingQuantity = currentRemainingQuantity - requestedQuantity;
    
    // Update the donation's remaining quantity
    donation.remainingQuantity = newRemainingQuantity;
    
    // If this is the first acceptance or all quantity is now taken
    if (!donation.isAccepted || newRemainingQuantity === 0) {
      donation.isAccepted = true;
    }

    // Create the new recipient object
    const newRecipient = {
      userId,
      name,
      phoneNumber,
      location,
      acceptedAt: new Date(),
      requestedQuantity
    };

    // Make sure recipients array exists
    if (!donation.recipients) {
      donation.recipients = [];
    }
    
    // Add to recipients array
    donation.recipients.push(newRecipient);
    
    // For backward compatibility, also update the recipient field
    donation.recipient = newRecipient;

    // Save the updated donation
    await donation.save();

    res.status(200).json({ 
      message: 'Donation accepted successfully.', 
      donation,
      requestedQuantity,
      remainingQuantity: newRemainingQuantity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while accepting the donation.' });
  }
};

module.exports = { donation, getUserDonations, getAvailableDonations, acceptDonation };
