import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

function parseId(param) {
  const id = parseInt(param, 10);
  return isNaN(id) || id <= 0 ? null : id;
}

function canAccess(req, resource) {
  return req.user.role === 'admin' || resource.user_id === req.user.id;
}

// POST /api/courses
router.post('/', authenticate, async (req, res) => {
  const { course_code, title, semester, instructor_name } = req.body;

  if (!course_code || !title || !semester) {
    return res.status(400).json({ error: 'course_code, title, and semester are required' });
  }

  const course = await prisma.course.create({
    data: {
      user_id: req.user.id,
      course_code,
      title,
      semester,
      instructor_name: instructor_name || null,
    },
  });

  return res.status(201).json(course);
});

// GET /api/courses
router.get('/', authenticate, async (req, res) => {
  const where = req.user.role === 'admin' ? {} : { user_id: req.user.id };
  const courses = await prisma.course.findMany({ where });
  return res.status(200).json({ courses });
});

// GET /api/courses/:id
router.get('/:id', authenticate, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID must be a positive integer' });

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (!canAccess(req, course)) return res.status(403).json({ error: 'Access forbidden' });

  return res.status(200).json(course);
});

// PUT /api/courses/:id
router.put('/:id', authenticate, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID must be a positive integer' });

  const { course_code, title, semester, instructor_name } = req.body;

  if (
    course_code === undefined &&
    title === undefined &&
    semester === undefined &&
    instructor_name === undefined
  ) {
    return res.status(400).json({ error: 'At least one field must be provided to update' });
  }

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (!canAccess(req, course)) return res.status(403).json({ error: 'Access forbidden' });

  const updated = await prisma.course.update({
    where: { id },
    data: {
      ...(course_code !== undefined && { course_code }),
      ...(title !== undefined && { title }),
      ...(semester !== undefined && { semester }),
      ...(instructor_name !== undefined && { instructor_name }),
    },
  });

  return res.status(200).json(updated);
});

// DELETE /api/courses/:id
router.delete('/:id', authenticate, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID must be a positive integer' });

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (!canAccess(req, course)) return res.status(403).json({ error: 'Access forbidden' });

  await prisma.course.delete({ where: { id } });

  return res.status(200).json({ message: 'Course deleted successfully', id });
});

export default router;
