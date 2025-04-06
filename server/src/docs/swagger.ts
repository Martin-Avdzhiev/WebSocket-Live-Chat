import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Chat App API',
      version: '1.0.0',
      description: 'API Documentation for Chat App',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'API Users'
      },
      {
        name: 'Chat Rooms',
        description: 'API Chat Rooms'
      }
    ]
  };

const options = {
  swaggerDefinition,
  // Using absolute route path
  apis: [path.join(__dirname, '../routes/*.ts')],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwaggerDocs = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};