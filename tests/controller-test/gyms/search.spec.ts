import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "tests/utils/create-and-authenticate-user";

describe("Search gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to search gyms by title", async () => {
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
        latitude: -22.7466256,
        longitude: -43.3933842,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({ q: "Jym" })
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
