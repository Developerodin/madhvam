import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const NavItemSchema = new Schema(
  {
    href: { type: String, required: true },
    label: { type: String, required: true },
    mobileOnly: { type: Boolean, default: false },
  },
  { _id: false },
);

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    name: String,
    canonical: String,
    themeColor: String,
    rera: String,
    reraUrl: String,
    gstin: String,
    company: String,
    brand: String,
    enquiryEmail: String,
    salesEmail: String,
    phone: String,
    phoneTel: String,
    whatsapp: String,
    ivr: String,
    ivrTel: String,
    generalPhone: String,
    generalTel: String,
    companyUrl: String,
    siteAddress: String,
    corporateAddress: String,
    logoLight: String,
    logoDark: String,
    ogImage: String,
    hero: {
      kicker: String,
      titleLead: String,
      titleAccent: String,
      line: String,
      ctaPrimary: String,
      ctaSecondary: String,
      poster: String,
      videoWebm: String,
      videoMp4: String,
    },
    nav: [NavItemSchema],
    seo: {
      homeTitle: String,
      homeDescription: String,
    },
  },
  { timestamps: true },
);

export type SiteSettingsDoc = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: Schema.Types.ObjectId;
};

export const SiteSettings: Model<SiteSettingsDoc> =
  models.SiteSettings ||
  model<SiteSettingsDoc>("SiteSettings", SiteSettingsSchema);
