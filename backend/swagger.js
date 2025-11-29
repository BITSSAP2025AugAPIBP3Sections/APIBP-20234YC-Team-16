const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Badminton Booking API',
      version: '1.0.0',
      description: 'A comprehensive API for managing badminton court bookings, user authentication, and court availability',
      contact: {
        name: 'API Support',
        email: 'support@badmintonbooking.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: '1701234567890'
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password (minimum 6 characters)',
              example: 'password123'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'password123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT authentication token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Court: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Court ID',
              example: 'court-1'
            },
            name: {
              type: 'string',
              description: 'Court name',
              example: 'Premium Court A'
            },
            pricePerHour: {
              type: 'number',
              description: 'Price per hour in rupees',
              example: 500
            }
          }
        },
        SlotsResponse: {
          type: 'object',
          properties: {
            slots: {
              type: 'array',
              items: {
                type: 'string',
                example: '06:00-07:00'
              },
              description: 'Available time slots for the selected date and court'
            }
          }
        },
        Player: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Player name',
              example: 'Alice Smith'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Player email',
              example: 'alice@example.com'
            }
          }
        },
        BookingRequest: {
          type: 'object',
          required: ['courtId', 'date', 'slot', 'players'],
          properties: {
            courtId: {
              type: 'string',
              description: 'ID of the court to book',
              example: 'court-1'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Booking date (YYYY-MM-DD)',
              example: '2024-12-01'
            },
            slot: {
              type: 'string',
              description: 'Time slot for booking',
              example: '18:00-19:00'
            },
            players: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Player'
              },
              description: 'List of players participating',
              minItems: 1
            }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Booking ID',
              example: '1701234567890'
            },
            userId: {
              type: 'string',
              description: 'ID of the user who made the booking',
              example: '1701234567890'
            },
            courtId: {
              type: 'string',
              description: 'Court ID',
              example: 'court-1'
            },
            courtName: {
              type: 'string',
              description: 'Court name',
              example: 'Premium Court A'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Booking date',
              example: '2024-12-01'
            },
            slot: {
              type: 'string',
              description: 'Booked time slot',
              example: '18:00-19:00'
            },
            players: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Player'
              },
              description: 'List of players'
            },
            totalCost: {
              type: 'number',
              description: 'Total cost of booking',
              example: 500
            },
            costPerPlayer: {
              type: 'number',
              description: 'Cost per player',
              example: 125
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid credentials'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User registration and login endpoints'
      },
      {
        name: 'Courts',
        description: 'Court management and availability endpoints'
      },
      {
        name: 'Bookings',
        description: 'Court booking management endpoints'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
