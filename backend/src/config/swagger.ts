import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import type { Express } from "express"


const BASE_URL = process.env.BASE_URL || "http://localhost:3000"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tenovate: Multi-Tenant SaaS API",
      version: "1.0.0",
      description: "Backend infrastructure for multi-tenant SaaS platforms"
    },
    servers: [
      {
        url: `${BASE_URL}/api/v1`
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