"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const user_1 = require("./users/user");
const fastify = (0, fastify_1.default)();
fastify.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*'); // อนุญาตทุกโดเมน
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // กำหนดวิธีที่อนุญาต
    reply.header('Access-Control-Allow-Headers', 'Content-Type'); // กำหนด header ที่อนุญาต
    done();
});
fastify.get("/users", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, user_1.getUsers)();
}));
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
