import { RegisterService } from "@/services/register-service";
import { InMemoryUsersRepository } from "../repositories-test/in-memory-users-repository";
import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { UserAlreadyExistError } from "@/services/errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterService;
describe("register service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterService(usersRepository);
  });
  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "john.doe@example.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
