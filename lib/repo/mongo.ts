import type { Model } from "mongoose";
import { connectDB } from "../db";
import ProfileModel from "../../models/Profile";
import ProjectModel from "../../models/Project";
import CertificateModel from "../../models/Certificate";
import TimelineItemModel from "../../models/TimelineItem";
import ReviewModel from "../../models/Review";
import MessageModel from "../../models/Message";
import type { CollectionName, Doc, Repo } from "./types";

const modelFor: Record<CollectionName, Model<any>> = {
  projects: ProjectModel,
  certificates: CertificateModel,
  timeline: TimelineItemModel,
  reviews: ReviewModel,
  messages: MessageModel,
};

function toDoc(raw: unknown): Doc {
  const { __v: _v, ...rest } = JSON.parse(JSON.stringify(raw));
  return rest as Doc;
}

function stripMeta(data: Record<string, unknown>) {
  const { _id: _a, createdAt: _b, updatedAt: _c, __v: _d, ...rest } = data;
  return rest;
}

export const mongoRepo: Repo = {
  async list(collection, sort = "order") {
    await connectDB();
    const docs = await modelFor[collection]
      .find()
      .sort(sort === "newest" ? { createdAt: -1 } : { order: 1, createdAt: 1 })
      .lean();
    return docs.map(toDoc);
  },

  async create(collection, data) {
    await connectDB();
    const doc = await modelFor[collection].create(stripMeta(data));
    return toDoc(doc.toObject());
  },

  async update(collection, id, data) {
    await connectDB();
    const doc = await modelFor[collection]
      .findByIdAndUpdate(id, stripMeta(data), { new: true })
      .lean();
    return doc ? toDoc(doc) : null;
  },

  async remove(collection, id) {
    await connectDB();
    await modelFor[collection].findByIdAndDelete(id);
  },

  async upsertByField(collection, field, value, data) {
    await connectDB();
    await modelFor[collection].findOneAndUpdate({ [field]: value }, stripMeta(data), {
      upsert: true,
    });
  },

  async getProfile() {
    await connectDB();
    const doc = await ProfileModel.findOne().lean();
    return doc ? toDoc(doc) : null;
  },

  async saveProfile(data) {
    await connectDB();
    const doc = await ProfileModel.findOneAndUpdate({}, stripMeta(data), {
      new: true,
      upsert: true,
    }).lean();
    return toDoc(doc);
  },
};
