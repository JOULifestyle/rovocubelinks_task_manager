import express from 'express';
import { PrismaClient } from '../generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper function to log activity
const logActivity = async (userId, action, entityType, entityId, details = null) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        details
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// GET / - fetch all tasks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        creator: {
          select: { id: true, email: true }
        }
      }
    });
    res.json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST / - create task (admin only)
router.post('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: 'pending',
        createdBy: req.user.id
      },
      include: {
        creator: {
          select: { id: true, email: true }
        }
      }
    });

    await logActivity(req.user.id, 'CREATE', 'Task', task.id, `Created task: ${title}`);

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /:id - update task (users can edit, mark complete)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const taskId = parseInt(id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only allow updates to title, description, status (if marking complete)
    const updateData = {};
    const changes = [];

    if (title !== undefined && title !== existingTask.title) {
      updateData.title = title;
      changes.push(`renamed to "${title}"`);
    }
    if (description !== undefined && description !== existingTask.description) {
      updateData.description = description;
      changes.push(`updated description`);
    }
    if (status !== undefined) {
      if (status === 'completed' && existingTask.status !== 'completed') {
        updateData.status = status;
        changes.push('marked as completed');
      } else if (req.user.role === 'admin' && status !== existingTask.status) {
        updateData.status = status;
        changes.push(`changed status to ${status}`);
      } else if (status !== existingTask.status) {
        return res.status(403).json({ error: 'Only admins can change status except to completed' });
      }
    }

    // If no changes were made, return early
    if (Object.keys(updateData).length === 0) {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          creator: { select: { id: true, email: true } }
        }
      });
      return res.json(task);
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        creator: {
          select: { id: true, email: true }
        }
      }
    });

    const changeDescription = changes.length > 0 ? changes.join(', ') : 'updated task';
    await logActivity(req.user.id, 'UPDATE', 'Task', task.id, `${changeDescription}`);

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /:id - delete task (admin only)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    await logActivity(req.user.id, 'DELETE', 'Task', taskId, `Deleted task: ${task.title}`);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;