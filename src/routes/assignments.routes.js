import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function parseId(param) {
  const id = parseInt(param, 10);
  return isNaN(id) || id <= 0 ? null : id;
}

function canAccess(req, resource) {
  return req.user.role === 'admin' || resource.user_id === req.user.id;
}

function parseDate(str) {
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// POST /api/assignments
router.post('/', authenticate, async (req, res) => {
  const { course_id, title, description, due_date, status, priority } = req.body;

  if (!course_id || !title || !due_date) {
    return res.status(400).json({ error: 'course_id, title, and due_date are required' });
  }

  const courseId = parseInt(course_id, 10);
  if (isNaN(courseId) || courseId <= 0) {
    return res.status(400).json({ error: 'course_id must be a positive integer' });
  }

  const parsedDate = parseDate(due_date);
  if (!parsedDate) {
    return res.status(400).json({ error: 'due_date must be a valid ISO date string' });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
    });
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (course.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'course_id does not belong to the authenticated user' });
  }

  const assignment = await prisma.assignment.create({
    data: {
      course_id: courseId,
      user_id: req.user.id,
      title,
      description: description || null,
      due_date: parsedDate,
      status: status || 'pending',
      priority: priority || null,
    },
  });

  return res.status(201).json(assignment);
});

// GET /api/assignments
router.get('/', authenticate, async (req, res) => {
  const where = req.user.role === 'admin' ? {} : { user_id: req.user.id };
  const assignments = await prisma.assignment.findMany({ where });
  return res.status(200).json({ assignments });
});

// GET /api/assignments/:id
router.get('/:id', authenticate, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID must be a positive integer' });

  const assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  if (!canAccess(req, assignment)) return res.status(403).json({ error: 'Access forbidden' });

  return res.status(200).json(assignment);
});

// PUT /api/assignments/:id
router.put('/:id', authenticate, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID must be a positive integer' });

  const { title, description, due_date, status, priority } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
    });
  }

  if (due_date !== undefined) {
    const parsed = parseDate(due_date);
    if (!parsed) return res.status(400).json({ error: 'due_date must be a valid ISO date string' });
  }

  const assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  if (!canAccess(req, assignment)) return res.status(403).json({ error: 'Access forbidden' });

  const updated = await prisma.assignment.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(due_date !== undefined && { due_date: new Date(due_date) }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
    },
  });

  return res.status(200).json(updated);
});

// DELETE /api/assignments/:id
router.delete('/:id', authenticate, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID must be a positive integer' });

  const assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  if (!canAccess(req, assignment)) return res.status(403).json({ error: 'Access forbidden' });

  await prisma.assignment.delete({ where: { id } });

  return res.status(200).json({ id, title: assignment.title, status: 'deleted' });
});

export default router;
