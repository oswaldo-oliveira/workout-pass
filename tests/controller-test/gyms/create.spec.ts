import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "tests/utils/create-and-authenticate-user";

describe("Create gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym",
        description: null,
        phone: "21977777777",
        latitude: -22.7466256,
        longitude: -43.3933842,
      });

    expect(response.statusCode).toEqual(201);
  });
});
