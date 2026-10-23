import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const GalleryItemSchema = new Schema(
  {
    order: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    also: Schema.Types.Mixed,
    title: { type: String, required: true },
    lines: [String],
    caption: String,
    feature: Boolean,
    png: String,
    webp: String,
    placeholder: Boolean,
    contain: Boolean,
  },
  { timestamps: true },
);

const GalleryFiltersSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    filters: [
      {
        id: String,
        label: String,
        icon: String,
      },
    ],
  },
  { timestamps: true },
);

export type GalleryItemDoc = InferSchemaType<typeof GalleryItemSchema> & {
  _id: Schema.Types.ObjectId;
};

export type GalleryFiltersDoc = InferSchemaType<typeof GalleryFiltersSchema> & {
  _id: Schema.Types.ObjectId;
};

export const GalleryItem: Model<GalleryItemDoc> =
  models.GalleryItem ||
  model<GalleryItemDoc>("GalleryItem", GalleryItemSchema);

export const GalleryFilters: Model<GalleryFiltersDoc> =
  models.GalleryFilters ||
  model<GalleryFiltersDoc>("GalleryFilters", GalleryFiltersSchema);
