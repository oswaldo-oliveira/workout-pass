import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { userRoutes } from "./http/controller/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { gymRoutes } from "./http/controller/gyms/routes";
import { checkInsRoutes } from "./http/controller/check-ins/routes";

export const app = fastify();

app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(userRoutes);
app.register(gymRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(404).send({
      message: "Validation error!",
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.log(error);
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
});
