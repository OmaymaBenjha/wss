import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import cors from "@fastify/cors"

// Creating the app instance (server instance)
const fastify = Fastify({
	logger: true,
});
// ==> Registring the necessary plugins onto our server.

// Register cors to allow all connections.
// Ofc, in production env, we should narrow domains that should be able to access ou server
fastify.register(cors);

// Register the Fastify Websockets plugin.
fastify.register(fastifyWebsocket);

// Rgister a new handler to listen for websocket messages.
fastify.register(async function (fastify){
	fastify.get(
		"/online-status",
		{
			websocket: true,
		},
		(connection, req) => {
			connection.socket.on("message", msg => {
				connection.socket.send(`Hello from Fastify. Your msg is ${msg}`);
			});
		}
	);
});

fastify.get("/", async (request, reply) =>{
	return { hello: "world" };
});

try {
	await fastify.listen({ port: 3000 });
	fastify.log.info(`Server is running on port ${3000}`);
} catch (error) {
	fastify.log.error(error);
	process.exit(1);

}
