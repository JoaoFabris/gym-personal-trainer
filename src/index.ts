import 'dotenv/config';

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import fastifyApiReference from "@scalar/fastify-api-reference";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from './lib/auth.js';
import fastifyCors from '@fastify/cors';

const app = Fastify({
    logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Bootcamp Treinos API",
            description: "API para o bootcamp de treinos do FSC",
            version: "1.0.0",
        },
        servers: [
            {
                description: "Localhost",
                url: "http://localhost:8080",
            },
        ],
    },
    transform: jsonSchemaTransform,
});

await app.register(fastifyApiReference, {
    routePrefix: "/docs",
    configuration: {
        sources: [
            {
                title: "Bootcamp Treinos API",
                slug: "bootcamp-treinos-api",
                url: "/swagger.json",
            },
            {
                title: "Auth API",
                slug: "auth-api",
                url: "/api/auth/open-api/generate-schema",
            },
        ],
    },
});


app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/swagger.json",
  schema: {
    hide: true,
  },
  handler: async () => {
    return app.swagger();
  },
});


app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
        description: "Hello World",
        tags: ["Hello World"],
        response: {
            200: z.object({
                message: z.string(),
            })
        }
    },
    handler: () => {
        return {
            message: 'Hello World'
        }
    }
});


await app.register(fastifyCors, {
    origin: ["http://localhost:3000"],
    credentials: true
})



app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
        try {
            // Construct request URL
            const url = new URL(request.url, `http://${request.headers.host}`);

            // Convert Fastify headers to standard Headers object
            const headers = new Headers();
            Object.entries(request.headers).forEach(([key, value]) => {
                if (value) headers.append(key, value.toString());
            });
            // Create Fetch API-compatible request
            const req = new Request(url.toString(), {
                method: request.method,
                headers,
                ...(request.body ? { body: JSON.stringify(request.body) } : {}),
            });
            // Process authentication request
            const response = await auth.handler(req);
            // Forward response to client
            reply.status(response.status);
            response.headers.forEach((value, key) => reply.header(key, value));
            reply.send(response.body ? await response.text() : null);
        } catch (error) {
            app.log.error(error);
            reply.status(500).send({
                error: "Internal authentication error",
                code: "AUTH_FAILURE",
            });
        }
    },
});


try {
    await app.listen({ port: Number(process.env.PORT) || 8081 });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}