export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Study Planner REST API',
    version: '1.0.0',
    description:
      'A REST API for managing courses, assignments, and study sessions.\n\n' +
      '**How to authenticate:**\n' +
      '1. Use `POST /auth/login` with one of the seeded credentials below.\n' +
      '2. Copy the `token` from the response.\n' +
      '3. Click the **Authorize** button (top right) and paste the token.\n\n' +
      '**Seeded accounts:**\n' +
      '- `alice@test.com` / `Password123!` — student (owns courses 1 & 2, assignments 1-3, sessions 1-2)\n' +
      '- `bob@test.com` / `Password123!` — student (owns course 3, assignment 4, session 3)\n' +
      '- `admin@test.com` / `Admin123!` — admin (can access all resources)',
  },
  servers: [{ url: '/api', description: 'API Server' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Error message' },
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', example: 'alice@test.com' },
          full_name: { type: 'string', example: 'Alice Smith' },
          role: { type: 'string', example: 'student' },
        },
      },
      SignupRequest: {
        type: 'object',
        required: ['email', 'password', 'full_name'],
        properties: {
          email: { type: 'string', example: 'newuser@example.com' },
          password: { type: 'string', example: 'SecurePass1!' },
          full_name: { type: 'string', example: 'New User' },
          role: { type: 'string', enum: ['student', 'admin'], default: 'student', example: 'student' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'alice@test.com' },
          password: { type: 'string', example: 'Password123!' },
        },
      },
      CourseResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          course_code: { type: 'string', example: 'CSCE 146' },
          title: { type: 'string', example: 'Algorithmic Design I' },
          semester: { type: 'string', example: 'Fall 2026' },
          instructor_name: { type: 'string', nullable: true, example: 'Dr. Smith' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CourseRequest: {
        type: 'object',
        required: ['course_code', 'title', 'semester'],
        properties: {
          course_code: { type: 'string', example: 'CSCE 146' },
          title: { type: 'string', example: 'Algorithmic Design I' },
          semester: { type: 'string', example: 'Fall 2026' },
          instructor_name: { type: 'string', example: 'Dr. Smith' },
        },
      },
      AssignmentResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          course_id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Lab 4' },
          description: { type: 'string', nullable: true, example: 'Implement linked list methods' },
          due_date: { type: 'string', format: 'date-time', example: '2026-10-14T23:59:00.000Z' },
          status: { type: 'string', example: 'pending' },
          priority: { type: 'string', nullable: true, example: 'high' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      AssignmentRequest: {
        type: 'object',
        required: ['course_id', 'title', 'due_date'],
        properties: {
          course_id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Lab 4' },
          description: { type: 'string', example: 'Implement linked list methods' },
          due_date: { type: 'string', format: 'date-time', example: '2026-10-14T23:59:00Z' },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending',
            example: 'pending',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            nullable: true,
            example: 'high',
          },
        },
      },
      StudySessionResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          assignment_id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          session_date: { type: 'string', format: 'date-time', example: '2026-10-12T18:00:00.000Z' },
          duration_minutes: { type: 'integer', example: 90 },
          location: { type: 'string', nullable: true, example: 'Thomas Cooper Library' },
          notes: { type: 'string', nullable: true, example: 'Review recursion and arrays' },
          completed: { type: 'boolean', example: false },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      StudySessionRequest: {
        type: 'object',
        required: ['assignment_id', 'session_date', 'duration_minutes'],
        properties: {
          assignment_id: { type: 'integer', example: 1 },
          session_date: { type: 'string', format: 'date-time', example: '2026-10-12T18:00:00Z' },
          duration_minutes: { type: 'integer', example: 90 },
          location: { type: 'string', example: 'Thomas Cooper Library' },
          notes: { type: 'string', example: 'Review recursion and arrays' },
          completed: { type: 'boolean', default: false, example: false },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Signup and login — no authentication required' },
    { name: 'Courses', description: 'Course management — authentication required' },
    { name: 'Assignments', description: 'Assignment management — authentication required' },
    { name: 'Study Sessions', description: 'Study session management — authentication required' },
  ],
  paths: {
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Create a new user account',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SignupRequest' } } },
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'User created successfully' },
                    user: { $ref: '#/components/schemas/UserResponse' },
                  },
                },
              },
            },
          },
          400: { description: 'Missing required fields or invalid email format', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          409: { description: 'Email already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate and receive a JWT token',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Login successful' },
                    token: { type: 'string', example: '<jwt_token>' },
                    user: { $ref: '#/components/schemas/UserResponse' },
                  },
                },
              },
            },
          },
          400: { description: 'Missing email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Invalid email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/courses': {
      post: {
        tags: ['Courses'],
        summary: 'Create a new course',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseRequest' } } },
        },
        responses: {
          201: { description: 'Course created', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseResponse' } } } },
          400: { description: 'Missing required fields', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      get: {
        tags: ['Courses'],
        summary: 'List all courses owned by the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Array of courses',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    courses: { type: 'array', items: { $ref: '#/components/schemas/CourseResponse' } },
                  },
                },
              },
            },
          },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/courses/{id}': {
      get: {
        tags: ['Courses'],
        summary: 'Get a course by ID (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Course found', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseResponse' } } } },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'User does not own the course', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Course not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Courses'],
        summary: 'Update a course (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseRequest' } } },
        },
        responses: {
          200: { description: 'Course updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseResponse' } } } },
          400: { description: 'Invalid data or ID', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'User does not own the course', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Course not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Courses'],
        summary: 'Delete a course (owner or admin) — cascades to assignments and study sessions',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: {
            description: 'Course deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Course deleted successfully' },
                    id: { type: 'integer', example: 1 },
                  },
                },
              },
            },
          },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'User does not own the course', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Course not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/assignments': {
      post: {
        tags: ['Assignments'],
        summary: 'Create a new assignment for one of the user\'s courses',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentRequest' } } },
        },
        responses: {
          201: { description: 'Assignment created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentResponse' } } } },
          400: { description: 'Missing required fields or invalid values', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'course_id does not belong to the user', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Course not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      get: {
        tags: ['Assignments'],
        summary: 'List all assignments owned by the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Array of assignments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    assignments: { type: 'array', items: { $ref: '#/components/schemas/AssignmentResponse' } },
                  },
                },
              },
            },
          },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/assignments/{id}': {
      get: {
        tags: ['Assignments'],
        summary: 'Get an assignment by ID (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Assignment found', content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentResponse' } } } },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'User does not own the assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Assignment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Assignments'],
        summary: 'Update an assignment (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentRequest' } } },
        },
        responses: {
          200: { description: 'Assignment updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentResponse' } } } },
          400: { description: 'Invalid data or ID', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'User does not own the assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Assignment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Assignments'],
        summary: 'Delete an assignment (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: {
            description: 'Assignment deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    title: { type: 'string', example: 'Lab 4' },
                    status: { type: 'string', example: 'deleted' },
                  },
                },
              },
            },
          },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'User does not own the assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Assignment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/study-sessions': {
      post: {
        tags: ['Study Sessions'],
        summary: 'Create a new study session tied to one of the user\'s assignments',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionRequest' } } },
        },
        responses: {
          201: { description: 'Study session created', content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionResponse' } } } },
          400: { description: 'Missing required fields or invalid values', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'assignment_id does not belong to the user', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Assignment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      get: {
        tags: ['Study Sessions'],
        summary: 'List all study sessions owned by the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Array of study sessions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    study_sessions: { type: 'array', items: { $ref: '#/components/schemas/StudySessionResponse' } },
                  },
                },
              },
            },
          },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/study-sessions/{id}': {
      get: {
        tags: ['Study Sessions'],
        summary: 'Get a study session by ID (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Study session found', content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionResponse' } } } },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'User does not own the study session', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Study session not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Study Sessions'],
        summary: 'Update a study session (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionRequest' } } },
        },
        responses: {
          200: { description: 'Study session updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionResponse' } } } },
          400: { description: 'Invalid data or ID', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'User does not own the study session', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Study session not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Study Sessions'],
        summary: 'Delete a study session (owner or admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: {
            description: 'Study session deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    completed: { type: 'boolean', example: false },
                    status: { type: 'string', example: 'deleted' },
                  },
                },
              },
            },
          },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'User does not own the study session', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Study session not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
};
