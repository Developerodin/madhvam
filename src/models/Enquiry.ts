import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export type EnquiryDoc = InferSchemaType<typeof EnquirySchema> & {
  _id: Schema.Types.ObjectId;
};

export const Enquiry: Model<EnquiryDoc> =
  models.Enquiry || model<EnquiryDoc>("Enquiry", EnquirySchema);
