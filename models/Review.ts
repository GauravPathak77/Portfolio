import { Schema, model, models, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    clientName: { type: String, required: true },
    clientRole: { type: String, default: "" },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    project: { type: String, default: "" },
    published: { type: Boolean, default: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type Review = InferSchemaType<typeof reviewSchema>;

export default models.Review || model("Review", reviewSchema);
