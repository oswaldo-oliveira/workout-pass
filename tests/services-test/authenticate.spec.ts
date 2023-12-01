import { AuthenticateService } from "@/services/authenticate-service";
import { InvalidCredentialError } from "@/services/errors/invalid-credentials-error";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "tests/repositories-test/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe("Authenticate Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(usersRepository);
  });
  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "1234565",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });
});
