import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "tests/utils/create-and-authenticate-user";

describe("Nearby gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym",
        description: null,
        phone: "21977777777",
        latitude: -22.7466256,
        longitude: -43.3933842,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Jym",
        description: null,
        phone: "21977777777",
        latitude: -22.663032,
        longitude: -44.5403816,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: -22.663032, longitude: -44.5403816 })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Jym",
      }),
    ]);
  });
});
