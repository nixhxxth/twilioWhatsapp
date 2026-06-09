require("dotenv").config();
const express = require("express");
const twilio = require("twilio");

const app = express();
app.use(express.json({ limit: '10mb' }));

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get("/", (req, res) => {
  res.json({ success: true, message: "WhatsApp API Running" });
});

app.post("/send-whatsapp", async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      product_title,
      product_image,
      selling_price,
      offer_price,
      reason,
      product_url = "https://yourdomain.com"
    } = req.body;

    console.log("Received payload:", JSON.stringify(req.body, null, 2));

    // Template 1
    console.log("Sending Template 1...");
    const template1 = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${customer_phone.toString().replace(/\s+/g, '').replace('+', '')}`,
      contentSid: "HX65799a1d3eb99bb9023e8a20b309e169",
      contentVariables: JSON.stringify({
        "1": customer_name || "Customer",
        "2": product_title || "Product",
        "3": selling_price?.toString() || "4999",
        "4": offer_price?.toString() || "4499",
        "5": reason || "Special Offer Just For You",
        "6": product_image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
      })
    });

    console.log("Template 1 SID:", template1.sid);

    await sleep(10000);

    // Template 2
    console.log("Sending Template 2...");
    const template2 = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${customer_phone.toString().replace(/\s+/g, '').replace('+', '')}`,
      contentSid: "HX0bb5b0e06114a758b6f383777f53c85f",
      contentVariables: JSON.stringify({
        "1": product_url
      })
    });

    console.log("Template 2 SID:", template2.sid);

    return res.json({
      success: true,
      template1_sid: template1.sid,
      template2_sid: template2.sid
    });

  } catch (err) {
    console.error("TWILIO ERROR:", err);
    return res.status(500).json({
      success: false,
      code: err.code,
      message: err.message,
      moreInfo: err.moreInfo
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
