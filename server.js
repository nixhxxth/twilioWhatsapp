require("dotenv").config();

const express = require("express");
const twilio = require("twilio");

const app = express();

app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "WhatsApp API Running"
  });
});

app.post("/send-whatsapp", async (req, res) => {
  try {

    const data = req.body;

    console.log("REQUEST RECEIVED");
    console.log(JSON.stringify(data, null, 2));

    // Send Template 1
    console.log("Sending Template 1...");

    const template1 = await client.messages.create({
      from: data.template1.From,
      to: data.template1.To,
      contentSid: data.template1.ContentSid,
      contentVariables: data.template1.ContentVariables
    });

    console.log("Template 1 Success:", template1.sid);

    // Wait 10 seconds
    await sleep(10000);

    // Send Template 2
    console.log("Sending Template 2...");

    const template2 = await client.messages.create({
      from: data.template2.From,
      to: data.template2.To,
      contentSid: data.template2.ContentSid,
      contentVariables: data.template2.ContentVariables
    });

    console.log("Template 2 Success:", template2.sid);

    return res.json({
      success: true,
      template1_sid: template1.sid,
      template2_sid: template2.sid
    });

  } catch (err) {

    console.error("TWILIO ERROR");

    console.error({
      code: err.code,
      status: err.status,
      message: err.message,
      moreInfo: err.moreInfo
    });

    return res.status(500).json({
      success: false,
      code: err.code,
      status: err.status,
      message: err.message,
      moreInfo: err.moreInfo
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
