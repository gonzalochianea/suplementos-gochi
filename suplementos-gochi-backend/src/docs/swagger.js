import swaggerJSDoc from "swagger-jsdoc"
import { API_URL } from "../utils/config.js"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Suplementos Gochi",
            version: "1.0.0",
            description: "API REST de Suplementos Gochi (TP Final Backend UTN)"
        },
        servers: [
            { url: API_URL }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./src/routes/*.js"]
}

export const specs = swaggerJSDoc(options)
