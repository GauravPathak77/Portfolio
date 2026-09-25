import { Schema, model, models, type InferSchemaType } from "mongoose";

const timelineItemSchema = new Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, default: "" },
    date: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TimelineItem = InferSchemaType<typeof timelineItemSchema>;

export default models.TimelineItem || model("TimelineItem", timelineItemSchema);
