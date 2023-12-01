import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "tests/repositories-test/in-memory-check-ins-repository";
import { ValidateCheckInService } from "@/services/validate-check-in-service";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { LateCheckInValidationError } from "@/services/errors/late-check-in-validation-error";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe("Validate check-in service", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to validate the check-in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes fo its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
