import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface CreateGymServiceRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymServiceResponse {
  gym: Gym;
}

export class CreateGymService {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {
    const gym = await this.gymRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
