import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { getRestaurants } from "./app/restaurants/routes/getRestaurants";

const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.register(getRestaurants).withTypeProvider<TypeBoxTypeProvider>();

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
