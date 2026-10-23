import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const PlotSchema = new Schema(
  {
    number: { type: Schema.Types.Mixed, required: true, unique: true },
    sizeSqYd: Number,
    sizeSqM: Number,
    sizeSqFt: Number,
    facing: String,
    tags: [String],
    ratePerSqYd: Number,
    totalPrice: Schema.Types.Mixed,
    status: { type: String, default: "Available" },
    bandKey: String,
    rect: { type: Schema.Types.Mixed },
    dimensions: String,
    amountMonth: Number,
    mortgage: { type: Boolean, default: false },
    isCommercial: Boolean,
    label: String,
    clickable: Boolean,
  },
  { timestamps: true },
);

export type PlotDoc = InferSchemaType<typeof PlotSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Plot: Model<PlotDoc> =
  models.Plot || model<PlotDoc>("Plot", PlotSchema);
