import { Schema, model, models, type InferSchemaType } from "mongoose";

const socialLinksSchema = new Schema(
  {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    facebook: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
  },
  { _id: false }
);

const skillGroupSchema = new Schema(
  {
    category: { type: String, required: true },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const profileSchema = new Schema(
  {
    name: { type: String, required: true, default: "Your Name" },
    tagline: { type: String, default: "" },
    headline: { type: String, default: "" },
    summary: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    bio: { type: String, default: "" },
    skills: { type: [skillGroupSchema], default: [] },
    resumeUrl: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    aboutImage: { type: String, default: "" },
    email: { type: String, default: "" },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export type Profile = InferSchemaType<typeof profileSchema>;

export default models.Profile || model("Profile", profileSchema);
