require("dotenv").config();

const express = require("express");
const twilio = require("twilio");

const app = express();

app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post("/send-whatsapp", async (req, res) => {
  try {
    const data = req.body;

    if (!data.template1 || !data.template2) {
      return res.status(400).json({
        success: false,
        message: "template1 or template2 missing"
      });
    }

    // Send Template 1
    const msg1 = await client.messages.create({
      contentSid: data.template1.ContentSid,
      contentVariables: data.template1.ContentVariables,
      from: data.template1.From,
      to: data.template1.To
    });

    // Send Template 2
    const msg2 = await client.messages.create({
      contentSid: data.template2.ContentSid,
      contentVariables: data.template2.ContentVariables,
      from: data.template2.From,
      to: data.template2.To
    });

    return res.json({
      success: true,
      customer: data.customer_name,
      phone: data.customer_phone,
      message1_sid: msg1.sid,
      message2_sid: msg2.sid
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
