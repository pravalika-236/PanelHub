const sendEmail = require("./emailService");

exports.sendNotification = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await sendEmail(email, subject, message);

    res.status(200).json({ message: "Notification sent successfully" });
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ error: "Email failed to send" });
  }
};
