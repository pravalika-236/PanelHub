import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import nodemailer from "nodemailer";
import "dotenv/config.js";

const NOTIFICATIONS_ENABLED = process.env.NOTIFICATIONS_ENABLED === "true";
console.log(" Notifications Enabled:", process.env.NOTIFICATIONS_ENABLED);

const createTransporter = () => {
  if (!NOTIFICATIONS_ENABLED) return null;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("Notifications enabled but SMTP config missing in .env");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const transporter = createTransporter();

const sendEmails = async ({ toEmails = [], subject, text, html }) => {
  if (!NOTIFICATIONS_ENABLED) {
    console.log(
      "Notifications disabled by NOTIFICATIONS_ENABLED=false — skipping send"
    );
    return false;
  }
  if (!transporter) {
    console.warn("Transporter not configured — skipping send");
    return false;
  }

  (async () => {
    try {
      const testTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      const result = await testTransporter.verify();
      console.log("SMTP connection verified:", result);
    } catch (err) {
      console.error("SMTP verification failed:", err);
    }
  })();

  try {
    // send a single email with multiple recipients in BCC/To as needed
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: toEmails, // array or comma-separated
      subject,
      text,
      html,
    });
    console.log("Notification emails sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Error sending notification emails:", err);
    return false;
  }
};

export const createNotification = async (req, res) => {
  try {
    const { recipient, event, slotId } = req.body;

    makeNotification(recipient, event, slotId);

    return res
      .status(201)
      .json({ message: "Notification saved", notification: saved });
  } catch (err) {
    console.error("createNotification error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const makeNotification = async (recipient, event, slotId) => {

  if (!recipient || !event) {
    return res
      .status(400)
      .json({ message: "recipient and event are required" });
  }

  console.log("///")
  console.log(recipient, event, slotId);

  // Save notification document
  const notif = new Notification({
    recipient,
    event,
    slotId: slotId || null,
  });

  const saved = await notif.save();
  // Lookup emails for scholars & faculties
  const scholarIds = (recipient.scholarIds || []).filter(Boolean);
  const facultyIds = (recipient.facultyIds || []).filter(Boolean);

  const userIds = [...scholarIds, ...facultyIds];

  let users = [];
  if (userIds.length > 0) {
    users = await User.find({ _id: { $in: userIds } }).select("email name");
  }

  const emails = users.map((u) => u.email).filter(Boolean);

  // Optional: If slotId provided, we can lookup booking to include details in message
  let booking = null;
  if (slotId) {
    try {
      booking = await Booking.findById(slotId).lean();
    } catch (err) {
      // ignore silently, booking may not exist yet
    }
  }

  // Prepare a simple template depending on event
  let subject = `Notification: ${event}`;
  let text = `Event: ${event}`;
  let html = `<p>Event: <strong>${event}</strong></p>`;

  if (booking) {
    let dateStr = "";
    if (booking?.date) {
      try {
        const d = new Date(booking.date);
        dateStr = isNaN(d.getTime())
          ? booking.date // fallback if already a readable string
          : d.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
      } catch {
        dateStr = booking.date;
      }
    }

    html += `<p>Booking Date: ${dateStr || "N/A"}</p><p>StartTime: ${booking.startTime || booking.time || "N/A"
      }</p>`;
    text += `\nBooking Date: ${dateStr || "N/A"}\nStartTime: ${booking.startTime || booking.time || "N/A"
      }`;
  }

  // Add more context for specific events
  if (event.toLowerCase().includes("created")) {
    subject = "Booking request created";
    html = `<p>A new booking request has been created.</p>` + html;
    text = `A new booking request has been created.\n` + text;
  } else if (event.toLowerCase().includes("cancel")) {
    subject = "Booking request cancelled";
    html = `<p>A booking request has been cancelled.</p>` + html;
    text = `A booking request has been cancelled.\n` + text;
  } else if (event.toLowerCase().includes("approved")) {
    subject = "Booking request approved";
    html = `<p>Your booking request has been approved.</p>` + html;
    text = `Your booking request has been approved.\n` + text;
  } else if (event.toLowerCase().includes("rejected")) {
    subject = "Booking request declined";
    html = `<p>Your booking request has been declined.</p>` + html;
    text = `Your booking request has been declined.\n` + text;
  }

  // send email (if configured)
  let sent = false;
  if (emails.length > 0 && NOTIFICATIONS_ENABLED) {
    sent = await sendEmails({ toEmails: emails, subject, text, html });
  } else {
    console.log(
      "No recipient emails found or notifications disabled — saved only"
    );
  }

  // update sentStatus on doc
  saved.sentStatus = !!sent;
  await saved.save();
}

/* Optional: simple listing endpoint (non-invasive) */
export const listNotifications = async (req, res) => {
  try {
    const docs = await Notification.find().sort({ createdAt: -1 }).limit(100);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};