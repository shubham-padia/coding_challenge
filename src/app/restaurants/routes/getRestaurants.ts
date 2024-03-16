import { FastifyInstance, FastifyRequest } from "fastify";
import { getRestaurants as getRestaurantsRepo } from "../restaurantRepository";
import { Type } from "@sinclair/typebox";
import { VALID_INCLUDES } from "../../constants";

export const getRestaurants = async (fastify: FastifyInstance) => {
  fastify.get(
    "/restaurants",
    {
      schema: {
        querystring: Type.Object({
          date: Type.Optional(Type.String()),
          includes: Type.Optional(Type.String()),
        }),
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: {
          date?: string;
          includes?: string;
        };
      }>,
      reply,
    ) => {
      let date = undefined;
      let limit = 10;
      let offset = 0;
      let includes = undefined;

      if (request.query.date) {
        if (!isNaN(Date.parse(request.query.date))) {
          date = new Date(request.query.date);
        } else {
          // We'll use default fastify error handler for the short project.
          reply.status(400);
          throw new Error("Invalid date in query param");
        }
      }

      if (request.query.includes) {
        const includesArray = request.query.includes.toLowerCase().split(",");
        if (
          Object.values(VALID_INCLUDES).some((element) =>
            includesArray.includes(element),
          )
        ) {
          includes = includesArray;
        } else {
          // We'll use default fastify error handler for the short project.
          reply.status(400);
          throw new Error("Invalid includes clause in query param");
        }
      }
      return await getRestaurantsRepo(date, limit, offset, includes);
    },
  );
};
