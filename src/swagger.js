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
      '3. Click the **Authorize** 🔓 button (top right) and enter: `<paste token here>`\n\n' +
      '**Seeded accounts:**\n' +
      '| Email | Password | Role | Owns |\n' +
      '|---|---|---|---|\n' +
      '| `alice@test.com` | `Password123!` | student | courses 1-2, assignments 1-3, sessions 1-2 |\n' +
      '| `bob@test.com` | `Password123!` | student | course 3, assignment 4, session 3 |\n' +
      '| `admin@test.com` | `Admin123!` | admin | full access to all resources |',
  },
  servers: [{ url: '/api', description: 'API base path' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter the JWT token returned by POST /auth/login',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'string', example: 'Error message' } },
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', example: 'alice@test.com' },
          full_name: { type: 'string', example: 'Alice Smith' },
          role: { type: 'string', enum: ['student', 'admin'], example: 'student' },
        },
      },
      SignupRequest: {
        type: 'object',
        required: ['email', 'password', 'full_name'],
        properties: {
          email: { type: 'string', example: 'newuser@example.com' },
          password: { type: 'string', example: 'SecurePass1!', minLength: 6 },
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
          created_at: { type: 'string', format: 'date-time', example: '2026-04-28T19:50:01.000Z' },
          updated_at: { type: 'string', format: 'date-time', example: '2026-04-28T19:50:01.000Z' },
        },
      },
      CourseCreateRequest: {
        type: 'object',
        required: ['course_code', 'title', 'semester'],
        properties: {
          course_code: { type: 'string', example: 'CSCE 146' },
          title: { type: 'string', example: 'Algorithmic Design I' },
          semester: { type: 'string', example: 'Fall 2026' },
          instructor_name: { type: 'string', example: 'Dr. Smith' },
        },
      },
      CourseUpdateRequest: {
        type: 'object',
        description: 'At least one field must be provided.',
        properties: {
          course_code: { type: 'string', example: 'CSCE 146' },
          title: { type: 'string', example: 'Algorithmic Design I (Updated)' },
          semester: { type: 'string', example: 'Spring 2027' },
          instructor_name: { type: 'string', example: 'Dr. Adams' },
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
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], example: 'pending' },
          priority: { type: 'string', nullable: true, enum: ['low', 'medium', 'high', null], example: 'high' },
          created_at: { type: 'string', format: 'date-time', example: '2026-04-28T19:50:01.000Z' },
          updated_at: { type: 'string', format: 'date-time', example: '2026-04-28T19:50:01.000Z' },
        },
      },
      AssignmentCreateRequest: {
        type: 'object',
        required: ['course_id', 'title', 'due_date'],
        properties: {
          course_id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Lab 4' },
          description: { type: 'string', example: 'Implement linked list methods' },
          due_date: { type: 'string', format: 'date-time', example: '2026-10-14T23:59:00Z' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], default: 'pending', example: 'pending' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], nullable: true, example: 'high' },
        },
      },
      AssignmentUpdateRequest: {
        type: 'object',
        description: 'All fields optional — only provided fields are updated.',
        properties: {
          title: { type: 'string', example: 'Lab 4 (Updated)' },
          description: { type: 'string', example: 'Updated description' },
          due_date: { type: 'string', format: 'date-time', example: '2026-10-20T23:59:00Z' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], example: 'in_progress' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], nullable: true, example: 'medium' },
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
          created_at: { type: 'string', format: 'date-time', example: '2026-04-28T19:50:01.000Z' },
          updated_at: { type: 'string', format: 'date-time', example: '2026-04-28T19:50:01.000Z' },
        },
      },
      StudySessionCreateRequest: {
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
      StudySessionUpdateRequest: {
        type: 'object',
        description: 'All fields optional — only provided fields are updated.',
        properties: {
          session_date: { type: 'string', format: 'date-time', example: '2026-10-15T10:00:00Z' },
          duration_minutes: { type: 'integer', example: 120 },
          location: { type: 'string', example: 'Home Office' },
          notes: { type: 'string', example: 'Updated notes' },
          completed: { type: 'boolean', example: true },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Signup and login — no authentication required' },
    { name: 'Courses', description: 'Course management — JWT required' },
    { name: 'Assignments', description: 'Assignment management — JWT required' },
    { name: 'Study Sessions', description: 'Study session management — JWT required' },
  ],
  paths: {
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user account',
        security: [],
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
                example: {
                  message: 'User created successfully',
                  user: { id: 4, email: 'newuser@example.com', full_name: 'New User', role: 'student' },
                },
              },
            },
          },
          400: { description: 'Missing required fields, invalid email, or password < 6 chars', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'email, password, and full_name are required' } } } },
          409: { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Email already exists' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive a JWT token',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: {
            description: 'Login successful — copy the token and use the Authorize button',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Login successful' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    user: { $ref: '#/components/schemas/UserResponse' },
                  },
                },
                example: {
                  message: 'Login successful',
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  user: { id: 1, email: 'alice@test.com', full_name: 'Alice Smith', role: 'student' },
                },
              },
            },
          },
          400: { description: 'Missing email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'email and password are required' } } } },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Invalid email or password' } } } },
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
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseCreateRequest' } } },
        },
        responses: {
          201: { description: 'Course created', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseResponse' }, example: { id: 4, user_id: 1, course_code: 'CSCE 146', title: 'Algorithmic Design I', semester: 'Fall 2026', instructor_name: 'Dr. Smith', created_at: '2026-04-28T20:00:00.000Z', updated_at: '2026-04-28T20:00:00.000Z' } } } },
          400: { description: 'Missing required fields', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'course_code, title, and semester are required' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
        },
      },
      get: {
        tags: ['Courses'],
        summary: 'List all courses for the authenticated user (admin sees all)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of courses',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { courses: { type: 'array', items: { $ref: '#/components/schemas/CourseResponse' } } } },
                example: { courses: [{ id: 1, user_id: 1, course_code: 'CSCE 146', title: 'Algorithmic Design I', semester: 'Fall 2026', instructor_name: 'Dr. Smith', created_at: '2026-04-28T19:50:01.000Z', updated_at: '2026-04-28T19:50:01.000Z' }] },
              },
            },
          },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
        },
      },
    },
    '/courses/{id}': {
      get: {
        tags: ['Courses'],
        summary: 'Get a course by ID (owner or admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, description: 'Course ID (positive integer)', schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Course found', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseResponse' }, example: { id: 1, user_id: 1, course_code: 'CSCE 146', title: 'Algorithmic Design I', semester: 'Fall 2026', instructor_name: 'Dr. Smith', created_at: '2026-04-28T19:50:01.000Z', updated_at: '2026-04-28T19:50:01.000Z' } } } },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'ID must be a positive integer' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'Authenticated user does not own this course', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Access forbidden' } } } },
          404: { description: 'Course not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Course not found' } } } },
        },
      },
      put: {
        tags: ['Courses'],
        summary: 'Update a course (owner or admin only) — at least one field required',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseUpdateRequest' } } },
        },
        responses: {
          200: { description: 'Course updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseResponse' }, example: { id: 1, user_id: 1, course_code: 'CSCE 146', title: 'Algorithmic Design I (Updated)', semester: 'Spring 2027', instructor_name: 'Dr. Adams', created_at: '2026-04-28T19:50:01.000Z', updated_at: '2026-04-29T10:00:00.000Z' } } } },
          400: { description: 'No fields provided or invalid ID', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'At least one field must be provided to update' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'Authenticated user does not own this course', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Access forbidden' } } } },
          404: { description: 'Course not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Course not found' } } } },
        },
      },
      delete: {
        tags: ['Courses'],
        summary: 'Delete a course (owner or admin only) — cascades to assignments and sessions',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Course deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, id: { type: 'integer' } } }, example: { message: 'Course deleted successfully', id: 1 } } } },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'ID must be a positive integer' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'Authenticated user does not own this course', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Access forbidden' } } } },
          404: { description: 'Course not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Course not found' } } } },
        },
      },
    },
    '/assignments': {
      post: {
        tags: ['Assignments'],
        summary: 'Create a new assignment under one of your courses',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentCreateRequest' } } },
        },
        responses: {
          201: { description: 'Assignment created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentResponse' }, example: { id: 5, course_id: 1, user_id: 1, title: 'Lab 4', description: 'Implement linked list methods', due_date: '2026-10-14T23:59:00.000Z', status: 'pending', priority: 'high', created_at: '2026-04-28T20:00:00.000Z', updated_at: '2026-04-28T20:00:00.000Z' } } } },
          400: { description: 'Missing required fields or invalid values', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'course_id, title, and due_date are required' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'course_id does not belong to the authenticated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'course_id does not belong to the authenticated user' } } } },
          404: { description: 'Course not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Course not found' } } } },
        },
      },
      get: {
        tags: ['Assignments'],
        summary: 'List all assignments for the authenticated user (admin sees all)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of assignments',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { assignments: { type: 'array', items: { $ref: '#/components/schemas/AssignmentResponse' } } } },
                example: { assignments: [{ id: 1, course_id: 1, user_id: 1, title: 'Lab 4', description: 'Implement linked list methods', due_date: '2026-10-14T23:59:00.000Z', status: 'pending', priority: 'high', created_at: '2026-04-28T19:50:01.000Z', updated_at: '2026-04-28T19:50:01.000Z' }] },
              },
            },
          },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
        },
      },
    },
    '/assignments/{id}': {
      get: {
        tags: ['Assignments'],
        summary: 'Get an assignment by ID (owner or admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Assignment found', content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentResponse' }, example: { id: 1, course_id: 1, user_id: 1, title: 'Lab 4', description: 'Implement linked list methods', due_date: '2026-10-14T23:59:00.000Z', status: 'pending', priority: 'high', created_at: '2026-04-28T19:50:01.000Z', updated_at: '2026-04-28T19:50:01.000Z' } } } },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'ID must be a positive integer' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'Authenticated user does not own this assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Access forbidden' } } } },
          404: { description: 'Assignment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Assignment not found' } } } },
        },
      },
      put: {
        tags: ['Assignments'],
        summary: 'Update an assignment (owner or admin only) — all fields optional',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentUpdateRequest' } } },
        },
        responses: {
          200: { description: 'Assignment updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignmentResponse' }, example: { id: 1, course_id: 1, user_id: 1, title: 'Lab 4 (Updated)', description: 'Implement linked list methods', due_date: '2026-10-20T23:59:00.000Z', status: 'in_progress', priority: 'medium', created_at: '2026-04-28T19:50:01.000Z', updated_at: '2026-04-29T10:00:00.000Z' } } } },
          400: { description: 'Invalid values', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'status must be one of: pending, in_progress, completed' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'Authenticated user does not own this assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Access forbidden' } } } },
          404: { description: 'Assignment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Assignment not found' } } } },
        },
      },
      delete: {
        tags: ['Assignments'],
        summary: 'Delete an assignment (owner or admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Assignment deleted', content: { 'application/json': { schema: { type: 'object' }, example: { id: 1, title: 'Lab 4', status: 'deleted' } } } },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'ID must be a positive integer' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'Authenticated user does not own this assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Access forbidden' } } } },
          404: { description: 'Assignment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Assignment not found' } } } },
        },
      },
    },
    '/study-sessions': {
      post: {
        tags: ['Study Sessions'],
        summary: 'Log a new study session tied to one of your assignments',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionCreateRequest' } } },
        },
        responses: {
          201: { description: 'Study session created', content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionResponse' }, example: { id: 4, assignment_id: 1, user_id: 1, session_date: '2026-10-12T18:00:00.000Z', duration_minutes: 90, location: 'Thomas Cooper Library', notes: 'Review recursion and arrays', completed: false, created_at: '2026-04-28T20:00:00.000Z', updated_at: '2026-04-28T20:00:00.000Z' } } } },
          400: { description: 'Missing required fields or invalid values', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'assignment_id, session_date, and duration_minutes are required' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'assignment_id does not belong to the authenticated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'assignment_id does not belong to the authenticated user' } } } },
          404: { description: 'Assignment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Assignment not found' } } } },
        },
      },
      get: {
        tags: ['Study Sessions'],
        summary: 'List all study sessions for the authenticated user (admin sees all)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of study sessions',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { study_sessions: { type: 'array', items: { $ref: '#/components/schemas/StudySessionResponse' } } } },
                example: { study_sessions: [{ id: 1, assignment_id: 1, user_id: 1, session_date: '2026-10-12T18:00:00.000Z', duration_minutes: 90, location: 'Thomas Cooper Library', notes: 'Review recursion and arrays', completed: false, created_at: '2026-04-28T19:50:01.000Z', updated_at: '2026-04-28T19:50:01.000Z' }] },
              },
            },
          },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
        },
      },
    },
    '/study-sessions/{id}': {
      get: {
        tags: ['Study Sessions'],
        summary: 'Get a study session by ID (owner or admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Study session found', content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionResponse' }, example: { id: 1, assignment_id: 1, user_id: 1, session_date: '2026-10-12T18:00:00.000Z', duration_minutes: 90, location: 'Thomas Cooper Library', notes: 'Review recursion and arrays', completed: false, created_at: '2026-04-28T19:50:01.000Z', updated_at: '2026-04-28T19:50:01.000Z' } } } },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'ID must be a positive integer' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'Authenticated user does not own this session', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Access forbidden' } } } },
          404: { description: 'Study session not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Study session not found' } } } },
        },
      },
      put: {
        tags: ['Study Sessions'],
        summary: 'Update a study session (owner or admin only) — all fields optional',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionUpdateRequest' } } },
        },
        responses: {
          200: { description: 'Study session updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/StudySessionResponse' }, example: { id: 1, assignment_id: 1, user_id: 1, session_date: '2026-10-15T10:00:00.000Z', duration_minutes: 120, location: 'Home Office', notes: 'Updated notes', completed: true, created_at: '2026-04-28T19:50:01.000Z', updated_at: '2026-04-29T10:00:00.000Z' } } } },
          400: { description: 'Invalid values', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'duration_minutes must be a positive integer' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'Authenticated user does not own this session', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Access forbidden' } } } },
          404: { description: 'Study session not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Study session not found' } } } },
        },
      },
      delete: {
        tags: ['Study Sessions'],
        summary: 'Delete a study session (owner or admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Study session deleted', content: { 'application/json': { schema: { type: 'object' }, example: { id: 1, completed: false, status: 'deleted' } } } },
          400: { description: 'ID is not a positive integer', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'ID must be a positive integer' } } } },
          401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'No token provided' } } } },
          403: { description: 'Authenticated user does not own this session', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Access forbidden' } } } },
          404: { description: 'Study session not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Study session not found' } } } },
        },
      },
    },
  },
};
