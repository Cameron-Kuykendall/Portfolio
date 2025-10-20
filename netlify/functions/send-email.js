// Load local env vars when running `netlify dev`
try {
  require("dotenv").config();
} catch (_) {}

const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Enforce POST only
  if (event.httpMethod && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const { name, email, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "Name, email, and message are required.",
        }),
      };
    }

    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : 465;
    const SMTP_SECURE = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : true;

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error("Missing EMAIL_USER/EMAIL_PASS environment variables");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: "Email service is not configured." }),
      };
    }

    // Set up the Nodemailer transporter (use Gmail with App Password or your SMTP provider)
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE, // true for 465, false for 587
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Portfolio Contact <${EMAIL_USER}>`, // Must be the authenticated user for Gmail
      to: EMAIL_USER,
      replyTo: email, // So you can reply directly to the sender
      subject: `PORTFOLIO MESSAGE from ${name}`,
      text: `Message from: ${name}\nEmail: ${email}\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Send email error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Failed to send email." }),
    };
  }
};
