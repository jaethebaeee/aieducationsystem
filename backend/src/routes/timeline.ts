import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Timeline Endpoints
// POST /api/timeline - create timeline for user
// GET /api/timeline?userId=... - get user's timeline
// PATCH /api/timeline/:id - update timeline title
// DELETE /api/timeline/:id - delete timeline

// Task Endpoints
// POST /api/timeline/:timelineId/tasks - add task
// PATCH /api/timeline/tasks/:taskId - update task
// DELETE /api/timeline/tasks/:taskId - delete task
// POST /api/timeline/tasks/:taskId/complete - mark as complete/incomplete

// POST /api/timeline
router.post('/', async (req, res) => {
  try {
    const { userId, title } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'Missing userId' });
    // Only one timeline per user
    const existing = await prisma.applicationTimeline.findUnique({ where: { userId } });
    if (existing) return res.status(409).json({ success: false, message: 'Timeline already exists for this user' });
    const timeline = await prisma.applicationTimeline.create({ data: { userId, title: title || 'My Application Timeline' } });
    return res.status(201).json({ success: true, data: timeline });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create timeline' });
  }
});

// GET /api/timeline?userId=...
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ success: false, message: 'Missing userId' });
    const timeline = await prisma.applicationTimeline.findUnique({
      where: { userId },
      include: { tasks: { orderBy: { dueDate: 'asc' } } },
    });
    if (!timeline) return res.status(404).json({ success: false, message: 'Timeline not found' });
    return res.json({ success: true, data: timeline });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch timeline' });
  }
});

// PATCH /api/timeline/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Missing title' });
    const updated = await prisma.applicationTimeline.update({ where: { id }, data: { title } });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update timeline' });
  }
});

// DELETE /api/timeline/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.applicationTimeline.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete timeline' });
  }
});

// POST /api/timeline/:timelineId/tasks
router.post('/:timelineId/tasks', async (req, res) => {
  try {
    const { timelineId } = req.params;
    const { type, label, description, dueDate, reminderAt } = req.body;
    if (!type || !label || !dueDate) return res.status(400).json({ success: false, message: 'Missing required fields' });
    // Prevent duplicate label for the same dueDate in the same timeline
    const existing = await prisma.timelineTask.findFirst({ where: { timelineId, label, dueDate: new Date(dueDate) } });
    if (existing) return res.status(409).json({ success: false, message: 'Task already exists for this date' });
    const task = await prisma.timelineTask.create({
      data: { timelineId, type, label, description, dueDate: new Date(dueDate), reminderAt: reminderAt ? new Date(reminderAt) : null },
    });
    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create task' });
  }
});

// PATCH /api/timeline/tasks/:taskId
router.patch('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { label, description, dueDate, reminderAt, type, completed } = req.body;
    const data: Partial<{
      label: string;
      description: string | null;
      dueDate: Date;
      reminderAt: Date | null;
      type: string;
      completed: boolean;
    }> = {};
    if (label) data.label = label;
    if (description !== undefined) data.description = description;
    if (dueDate) data.dueDate = new Date(dueDate);
    if (reminderAt) data.reminderAt = new Date(reminderAt);
    if (type) data.type = type;
    if (completed !== undefined) data.completed = completed;
    if (Object.keys(data).length === 0) return res.status(400).json({ success: false, message: 'Nothing to update' });
    const updated = await prisma.timelineTask.update({ where: { id: taskId }, data });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update task' });
  }
});

// DELETE /api/timeline/tasks/:taskId
router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    await prisma.timelineTask.delete({ where: { id: taskId } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
});

export default router; 