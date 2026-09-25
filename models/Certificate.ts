import { Schema, model, models, type InferSchemaType } from "mongoose";

const certificateSchema = new Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: String, default: "" },
    image: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type Certificate = InferSchemaType<typeof certificateSchema>;

export default models.Certificate || model("Certificate", certificateSchema);
