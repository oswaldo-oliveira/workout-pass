import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterService } from "../register-service";

export function makeRegisterService() {
  const usersRepository = new PrismaUsersRepository();
  const registerUser = new RegisterService(usersRepository);

  return registerUser;
}
