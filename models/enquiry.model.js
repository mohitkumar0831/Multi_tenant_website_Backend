// models/enquiry.model.js
import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      trim: true
    },

    companyName: {
      type: String,
      required: true,
      trim: true
    },

    emailid: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    companySize: {
      type: String,
      enum: ["1-50", "51-200", "201+"],
      required: true
    },

    enquiryType: {
      type: String,
      enum: ["demo", "inquiry"],
      default: "inquiry"
    },

    message: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);