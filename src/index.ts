import Fastify from 'fastify';
import { getUsers } from './users/user';

const fastify = Fastify();

fastify.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
    done();
});


fastify.get("/users", async (request, reply) => {
    return getUsers();
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

fastify.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});