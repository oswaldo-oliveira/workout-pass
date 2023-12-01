import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { FastifyInstance } from "fastify";

import { search } from "./search-controller";
import { fetchNearby } from "./nearby-controller";
import { create } from "./create-controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/gyms/search", search);
  app.get("/gyms/nearby", fetchNearby);

  app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, create);
}
