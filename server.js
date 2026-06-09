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

    console.log("Sending Template 1...");

    const template1 = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+917200524344",

      // USE THE TEMPLATE THAT WORKED LOCALLY
      contentSid: "HX65799a1d3eb99bb9023e8a20b309e169",

      contentVariables: JSON.stringify({
        "1": "Nishanth P",
        "2": "Noise Cancelling Headphones",
        "3": "4999",
        "4": "4499",
        "5": "Special Offer Just For You",
        "6": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
      })
    });

    console.log("Template1 SID:", template1.sid);

    await sleep(10000);

    console.log("Sending Template 2...");

    const template2 = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+917200524344",

      contentSid: "HX0bb5b0e06114a758b6f383777f53c85f",

      contentVariables: JSON.stringify({
        "1": "https://google.com"
      })
    });

    console.log("Template2 SID:", template2.sid);

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
