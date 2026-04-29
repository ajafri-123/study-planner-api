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

function parseDate(str) {
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// POST /api/study-sessions
router.post('/', authenticate, async (req, res) => {
  const { assignment_id, session_date, duration_minutes, location, notes, completed } = req.body;

  if (!assignment_id || !session_date || !duration_minutes) {
    return res
      .status(400)
      .json({ error: 'assignment_id, session_date, and duration_minutes are required' });
  }

  const assignmentId = parseInt(assignment_id, 10);
  if (isNaN(assignmentId) || assignmentId <= 0) {
    return res.status(400).json({ error: 'assignment_id must be a positive integer' });
  }

  const durationMins = parseInt(duration_minutes, 10);
  if (isNaN(durationMins) || durationMins <= 0) {
    return res.status(400).json({ error: 'duration_minutes must be a positive integer' });
  }

  const parsedDate = parseDate(session_date);
  if (!parsedDate) {
    return res.status(400).json({ error: 'session_date must be a valid ISO date string' });
  }

  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  if (assignment.user_id !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ error: 'assignment_id does not belong to the authenticated user' });
  }

  const session = await prisma.studySession.create({
    data: {
      assignment_id: assignmentId,
      user_id: req.user.id,
      session_date: parsedDate,
      duration_minutes: durationMins,
      location: location || null,
      notes: notes || null,
      completed: completed === true || completed === 'true' ? true : false,
    },
  });

  return res.status(201).json(session);
});

// GET /api/study-sessions
router.get('/', authenticate, async (req, res) => {
  const where = req.user.role === 'admin' ? {} : { user_id: req.user.id };
  const study_sessions = await prisma.studySession.findMany({ where });
  return res.status(200).json({ study_sessions });
});

// GET /api/study-sessions/:id
router.get('/:id', authenticate, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID must be a positive integer' });

  const session = await prisma.studySession.findUnique({ where: { id } });
  if (!session) return res.status(404).json({ error: 'Study session not found' });
  if (!canAccess(req, session)) return res.status(403).json({ error: 'Access forbidden' });

  return res.status(200).json(session);
});

// PUT /api/study-sessions/:id
router.put('/:id', authenticate, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID must be a positive integer' });

  const { session_date, duration_minutes, location, notes, completed } = req.body;

  if (duration_minutes !== undefined) {
    const d = parseInt(duration_minutes, 10);
    if (isNaN(d) || d <= 0) {
      return res.status(400).json({ error: 'duration_minutes must be a positive integer' });
    }
  }

  if (session_date !== undefined && !parseDate(session_date)) {
    return res.status(400).json({ error: 'session_date must be a valid ISO date string' });
  }

  const session = await prisma.studySession.findUnique({ where: { id } });
  if (!session) return res.status(404).json({ error: 'Study session not found' });
  if (!canAccess(req, session)) return res.status(403).json({ error: 'Access forbidden' });

  const updated = await prisma.studySession.update({
    where: { id },
    data: {
      ...(session_date !== undefined && { session_date: new Date(session_date) }),
      ...(duration_minutes !== undefined && {
        duration_minutes: parseInt(duration_minutes, 10),
      }),
      ...(location !== undefined && { location }),
      ...(notes !== undefined && { notes }),
      ...(completed !== undefined && {
        completed: completed === true || completed === 'true',
      }),
    },
  });

  return res.status(200).json(updated);
});

// DELETE /api/study-sessions/:id
router.delete('/:id', authenticate, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID must be a positive integer' });

  const session = await prisma.studySession.findUnique({ where: { id } });
  if (!session) return res.status(404).json({ error: 'Study session not found' });
  if (!canAccess(req, session)) return res.status(403).json({ error: 'Access forbidden' });

  await prisma.studySession.delete({ where: { id } });

  return res.status(200).json({ id, completed: session.completed, status: 'deleted' });
});

export default router;
