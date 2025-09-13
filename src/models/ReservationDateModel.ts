import mongoose, { Document, Model } from "mongoose";
import { ReservationDateTypes } from "@/types/types";

interface ReservationDateDocument extends Omit<ReservationDateTypes, "_id">, Document {}

const pickedDateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    clock: { type: String, required: true },
  },
  { _id: false }
);

const schema = new mongoose.Schema<ReservationDateDocument>({
  pickedDate: {
    type: [pickedDateSchema],
    default: [],
  },
});

const model: Model<ReservationDateDocument> = mongoose.models.ReservationDate ?? mongoose.model<ReservationDateDocument>("ReservationDate", schema);

export default model;
