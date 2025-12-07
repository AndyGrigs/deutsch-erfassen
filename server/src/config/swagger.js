const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Deutsch Erfassen API',
      version: '1.0.0',
      description: 'API for Deutsch Erfassen application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ], // files containing annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;