require("dotenv").config();
const express = require("express");
const twilio = require("twilio");

const app = express();
app.use(express.json({ limit: '10mb' }));

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get("/", (req, res) => res.json({ success: true, message: "WhatsApp API Running" }));

app.post("/send-whatsapp", async (req, res) => {
  try {
    console.log("Received body:", JSON.stringify(req.body, null, 2));

    const {
      customer_name,
      customer_phone,
      product_title,
      product_image,
      selling_price,
      offer_price,
      reason,
      product_url = "https://yourdomain.com"
    } = req.body || {};

    if (!customer_phone) {
      console.log("Missing customer_phone. Available keys:", Object.keys(req.body || {}));
      return res.status(400).json({ 
        success: false, 
        message: "customer_phone is required",
        received_keys: Object.keys(req.body || {})
      });
    }

    const to = `whatsapp:${customer_phone.toString().replace(/\s+/g, '').replace('+', '')}`;

    // Template 1
    const template1 = await client.messages.create({
      from: "whatsapp:+14155238886",
      to,
      contentSid: "HX65799a1d3eb99bb9023e8a20b309e169",
      contentVariables: JSON.stringify({
        "1": customer_name || "Customer",
        "2": product_title || "",
        "3": selling_price?.toString() || "",
        "4": offer_price?.toString() || "",
        "5": reason || "",
        "6": product_image || ""
      })
    });

    console.log("✅ Template 1 sent:", template1.sid);

    await sleep(10000);

    // Template 2
    const template2 = await client.messages.create({
      from: "whatsapp:+14155238886",
      to,
      contentSid: "HX0bb5b0e06114a758b6f383777f53c85f",
      contentVariables: JSON.stringify({ "1": product_url })
    });

    console.log("✅ Template 2 sent:", template2.sid);

    res.json({
      success: true,
      template1_sid: template1.sid,
      template2_sid: template2.sid
    });

  } catch (err) {
    console.error("Twilio Error:", err);
    res.status(500).json({
      success: false,
      code: err.code,
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
