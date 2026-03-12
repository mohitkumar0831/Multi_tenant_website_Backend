import Enquiry from "../models/enquiry.model.js";
import nodemailer from "nodemailer";

// Nodemailer Transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Create Enquiry
export const createEnquiry = async (req, res) => {
  try {
    // debug incoming payload
    console.debug('Enquiry payload received:', req.body);

    const {
      firstName,
      lastName,
      companyName,
      emailid,
      phone,
      companySize,
      enquiryType,
      message,
    } = req.body;

    // Save enquiry
    const newEnquiry = await Enquiry.create({
      firstName,
      lastName,
      companyName,
      emailid,
      phone,
      companySize,
      enquiryType,
      message,
    });

    // Send response immediately
    res.status(201).json({
      status: "success",
      message: "Enquiry submitted successfully.",
      data: newEnquiry,
    });

    // Send Email in background
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Enquiry Received",
      html: `
        <h3>New Enquiry Received</h3>

        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName || "N/A"}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${emailid}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company Size:</strong> ${companySize}</p>
        <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
      `,
    };

    transporter
      .sendMail(mailOptions)
      .then(() => console.log("📧 Enquiry email sent"))
      .catch((err) =>
        console.error("❌ Enquiry email failed:", err.message)
      );

  } catch (err) {
    console.error("❌ Enquiry controller error:", err.message);

    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get All Enquiries (Admin)
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: enquiries.length,
      data: enquiries,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};