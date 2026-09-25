export type CollectionName = "projects" | "certificates" | "timeline" | "reviews" | "messages";

export type Doc = Record<string, unknown> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type SortMode = "order" | "newest";

export interface Repo {
  list(collection: CollectionName, sort?: SortMode): Promise<Doc[]>;
  create(collection: CollectionName, data: Record<string, unknown>): Promise<Doc>;
  update(collection: CollectionName, id: string, data: Record<string, unknown>): Promise<Doc | null>;
  remove(collection: CollectionName, id: string): Promise<void>;
  upsertByField(
    collection: CollectionName,
    field: string,
    value: string,
    data: Record<string, unknown>
  ): Promise<void>;
  getProfile(): Promise<Doc | null>;
  saveProfile(data: Record<string, unknown>): Promise<Doc>;
}
