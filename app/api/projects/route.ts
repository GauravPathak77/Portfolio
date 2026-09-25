import { collectionRoutes } from "@/lib/crudRoutes";

export const { GET, POST } = collectionRoutes("projects", { publicRead: true });
