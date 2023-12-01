import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchUserCheckInsHistoryService } from "@/services/factories/make-fetch-user-check-ins-history-service";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = createCheckInParamsSchema.parse(request.query);

  const fetchUserCheckInsHistoryService = makeFetchUserCheckInsHistoryService();
  const { checkIns } = await fetchUserCheckInsHistoryService.execute({
    page,
    userId: request.user.sub,
  });

  return reply.status(200).send({
    checkIns,
  });
}
