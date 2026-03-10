import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import type { Express } from "express"

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
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app: Express) => {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}