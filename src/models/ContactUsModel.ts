import mongoose, { Document, Model } from "mongoose";
import type { ContactUsTypes } from "@/types/types";
import { contactUsMessage } from "@/constants/blogValidationErrors";
type ContactUsTypesWithoutId = Omit<ContactUsTypes, "_id">;

interface IContactUs extends ContactUsTypesWithoutId, Document {}

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, contactUsMessage.name],
  },
  last_name: {
    type: String,
    required: [true, contactUsMessage.last_name],
  },
  phone_number: {
    type: String,
    required: [true, contactUsMessage.phone_number],
  },
  message: {
    type: String,
    required: [true, contactUsMessage.message],
  },
});

const model: Model<IContactUs> = mongoose.models.ContactUs ?? mongoose.model<IContactUs>("ContactUs", schema);
export default model;
