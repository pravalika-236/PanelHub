const express = require("express");
const { sendNotification } = require("./notificationController");

const router = express.Router();

router.post("/send", sendNotification);

module.exports = router;
