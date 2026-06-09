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

    const {
      customer_name,
      customer_phone,
      product_title,
      product_image,
      selling_price,
      product_url
    } = req.body;

    const regularPrice = Math.round(selling_price * 1.25);

    // MESSAGE 1
    const msg1 = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${customer_phone}`,
      contentSid: "HX83a327b9790c0ee676b06366863157f",
      contentVariables: JSON.stringify({
        "1": customer_name,
        "2": product_title,
        "3": String(regularPrice),
        "4": String(selling_price),
        "5": "Special Offer Just For You!",
        "6": product_image
      })
    });

    // MESSAGE 2
    const msg2 = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${customer_phone}`,
      contentSid: "HX0bb5b0e06114a758b6f383777f53c85f",
      contentVariables: JSON.stringify({
        "1": product_url
      })
    });

    return res.json({
      success: true,
      template1_sid: msg1.sid,
      template2_sid: msg2.sid
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      code: err.code,
      message: err.message,
      moreInfo: err.moreInfo
    });
  }
});

app.get("/", (req, res) => {
  res.send("WhatsApp API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
