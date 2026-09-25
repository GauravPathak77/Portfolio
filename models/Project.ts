import { Schema, model, models, type InferSchemaType } from "mongoose";
import { PROJECT_ICONS, PROJECT_TYPES } from "../lib/types";

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    projectType: { type: String, enum: PROJECT_TYPES, default: "Personal Project" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    role: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    architecture: { type: [String], default: [] },
    icon: { type: String, enum: PROJECT_ICONS, default: "code" },
    image: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type Project = InferSchemaType<typeof projectSchema>;

export default models.Project || model("Project", projectSchema);
