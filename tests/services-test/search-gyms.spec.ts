import { expect, describe, it, beforeEach } from "vitest";
import { SearchGymsService } from "@/services/search-gyms-service";
import { InMemoryGymsRepository } from "tests/repositories-test/in-memory-gym-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;
describe("Search gyms service", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(gymsRepository);
  });

  it("should be able to search for gyms.", async () => {
    await gymsRepository.create({
      title: "Gym 1",
      description: null,
      phone: null,
      latitude: -22.7466256,
      longitude: -43.3933842,
    });

    await gymsRepository.create({
      title: "Gym 2",
      description: null,
      phone: null,
      latitude: -22.7466256,
      longitude: -43.3933842,
    });

    const { gyms } = await sut.execute({
      query: "1",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Gym 1" })]);
  });

  it("should be able to fetch paginated gym search.", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: null,
        phone: null,
        latitude: -22.7466256,
        longitude: -43.3933842,
      });
    }

    const { gyms } = await sut.execute({
      query: "Gym",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Gym 21" }),
      expect.objectContaining({ title: "Gym 22" }),
    ]);
  });
});
