import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "tests/repositories-test/in-memory-check-ins-repository";
import { CheckInService } from "@/services/check-in-service";
import { InMemoryGymsRepository } from "tests/repositories-test/in-memory-gym-repository";
import { MaxNumberOfCheckInsError } from "@/services/errors/max-number-of-check-ins";
import { MaxDistanceError } from "@/services/errors/max-distance-error";

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;
describe("Check-in service", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "gym",
      description: "",
      phone: "",
      latitude: -22.7466256,
      longitude: -43.3933842,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to check-in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.7466256,
      userLongitude: -43.3933842,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it("should not be to check-in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 10, 27, 5, 20, 0));
    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.7466256,
      userLongitude: -43.3933842,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -22.7466256,
        userLongitude: -43.3933842,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be to check-in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 10, 27, 5, 20, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.7466256,
      userLongitude: -43.3933842,
    });

    vi.setSystemTime(new Date(2023, 10, 28, 5, 20, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.7466256,
      userLongitude: -43.3933842,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check-in on distant gym", async () => {
    gymsRepository.create({
      id: "gym-02",
      title: "gym",
      description: "",
      phone: "",
      latitude: -22.6311317,
      longitude: -43.592097,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -22.7466256,
        userLongitude: -43.3933842,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
