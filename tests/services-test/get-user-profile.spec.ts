import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { GetUserProfileService } from "@/services/get-user-profile-service";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "tests/repositories-test/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get USer Profile Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });
  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual("John Doe");
  });

  it("should not be able to get user profile with wrong id", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
