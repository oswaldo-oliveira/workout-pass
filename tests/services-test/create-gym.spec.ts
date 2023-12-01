import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "tests/repositories-test/in-memory-gym-repository";
import { CreateGymService } from "@/services/create-gym-service";

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymService;
describe("Create gym service", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymRepository);
  });
  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "Gym",
      description: null,
      phone: null,
      latitude: -22.7466256,
      longitude: -43.3933842,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
