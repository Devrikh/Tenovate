import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Multi-Tenant SaaS API",
            version: "1.0.0",
            description: "Backend infrastructure for multi-tenant SaaS platforms"
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        }
    },
    apis: ["./src/modules/**/*.ts"]
};
const swaggerSpec = swaggerJsdoc(options);
export const setupSwagger = (app) => {
    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
//# sourceMappingURL=swagger.js.map