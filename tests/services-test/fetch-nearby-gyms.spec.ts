import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "tests/repositories-test/in-memory-gym-repository";
import { FetchNearbyGymsService } from "@/services/fetch-nearby-gyms-service";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;
describe("Fetch nearby gyms service", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(gymsRepository);
  });

  it("should be able to search for gyms.", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -22.7466256,
      longitude: -43.3933842,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -22.663032,
      longitude: -44.5403816,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.7466256,
      userLongitude: -43.3933842,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
