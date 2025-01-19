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

module.exports = { sendEmailNotification };