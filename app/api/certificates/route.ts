import { collectionRoutes } from "@/lib/crudRoutes";

export const { GET, POST } = collectionRoutes("certificates", { publicRead: true });
