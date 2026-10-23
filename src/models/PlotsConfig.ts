import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const PlotsConfigSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    updated: String,
    pricing: { type: Schema.Types.Mixed },
    paymentPlanHighlights: [String],
    notes: [String],
    unusedNumbers: [Schema.Types.Mixed],
    bandColors: { type: Schema.Types.Mixed },
    bands: { type: Schema.Types.Mixed },
    viewBox: { type: Schema.Types.Mixed },
    layoutBounds: { type: Schema.Types.Mixed },
    roads: { type: Schema.Types.Mixed },
    amenitiesVoid: { type: Schema.Types.Mixed },
    commercial: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export type PlotsConfigDoc = InferSchemaType<typeof PlotsConfigSchema> & {
  _id: Schema.Types.ObjectId;
};

export const PlotsConfig: Model<PlotsConfigDoc> =
  models.PlotsConfig ||
  model<PlotsConfigDoc>("PlotsConfig", PlotsConfigSchema);
