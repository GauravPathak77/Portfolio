import { collectionRoutes } from "@/lib/crudRoutes";

export const { GET, POST } = collectionRoutes("timeline", { publicRead: true });
