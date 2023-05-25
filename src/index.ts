import fastify from "fastify";

const logger = { logger: true };

const { ADDRESS = "localhost", PORT = "3000" } = process.env;

const server = fastify(logger);

server.get("/", async (request, reply) => {
  return { message: "Hello world!" };
});

server.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
