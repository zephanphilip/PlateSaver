const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmailNotification = async (req, res) => {
   
  const { userEmail, message, item } = req.body;
  console.log(userEmail, message, item);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Item Expiry Alert! 🔔',
    html: `
      <h2>Item Expiry Notification</h2>
      <p>${message}</p>
      <hr>
      <h3>Item Details:</h3>
      <ul>
        <li>Name: ${item.name}</li>
        <li>Category: ${item.category}</li>
        <li>Quantity: ${item.quantity}</li>
        <li>Expiry Date: ${new Date(item.expires).toLocaleDateString()}</li>
      </ul>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email', error });
  }
};


const sendDonationEmailNotification = async (req, res) => {
  const { userEmail, message, data } = req.body;
  
  // Log the incoming data
  console.log('Sending email to:', userEmail);
  console.log('Message:', message);
  console.log('Data:', data);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Your Donation Has Been Accepted! 🔔',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #FF6B6B;">Donation Accepted</h2>
        <p style="color: #333; line-height: 1.6;">${message}</p>
        <hr style="border: 1px solid #FFE5E5; margin: 20px 0;">
        <h3 style="color: #FF6B6B;">Item Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 10px;"><strong>Food Item:</strong> ${data.foodDetails}</li>
          ${data.acceptedBy ? `<li style="margin-bottom: 10px;"><strong>Accepted By:</strong> ${data.acceptedBy}</li>` : ''}
          ${data.phoneNumber ? `<li style="margin-bottom: 10px;"><strong>Contact Number:</strong> ${data.phoneNumber}</li>` : ''}
          ${data.expiryDate ? `<li style="margin-bottom: 10px;"><strong>Expiry Date:</strong> ${new Date(data.expiryDate).toLocaleDateString()}</li>` : ''}
          <li style="margin-bottom: 10px;"><strong>Accepted At:</strong> ${new Date(data.acceptedAt).toLocaleString()}</li>
        </ul>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">Thank you for using our platform to share food and reduce waste! 🌱</p>
      </div>
    `
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    
    // Return success response
    res.json({ 
      success: true, 
      message: 'Email notification sent successfully',
      recipient: userEmail 
    });
  } catch (error) {
    // Log the error details
    console.error('Error sending email notification:', error);
    
    // Return error response
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email notification', 
      error: error.message 
    });
  }
};


module.exports = { sendEmailNotification, sendDonationEmailNotification };