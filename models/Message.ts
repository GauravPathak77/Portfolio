import { Schema, model, models, type InferSchemaType } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type Message = InferSchemaType<typeof messageSchema>;

export default models.Message || model("Message", messageSchema);
