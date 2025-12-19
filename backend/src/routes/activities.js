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

// GET / - fetch activity logs (admin only)
router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Invalid limit (1-100)' });
    }

    const skip = (pageNum - 1) * limitNum;

    const logs = await prisma.activityLog.findMany({
      skip,
      take: limitNum,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, role: true }
        }
      }
    });

    // Get task titles for task-related activities 
    const taskIds = logs
      .filter(log => log.entityType === 'Task')
      .map(log => log.entityId);

    const tasks = taskIds.length > 0 ? await prisma.task.findMany({
      where: { id: { in: taskIds } },
      select: { id: true, title: true }
    }) : [];

    const taskMap = tasks.reduce((map, task) => {
      map[task.id] = task.title;
      return map;
    }, {});

    // Add task title to logs
    const logsWithTaskTitles = logs.map(log => {
      let taskTitle = null;

      if (log.entityType === 'Task') {
        // First try to get from database
        taskTitle = taskMap[log.entityId];

        // If not found in database, try to extract from details
        if (!taskTitle && log.details) {
          // Extract from DELETE logs: "Deleted task "Title""
          const deleteMatch = log.details.match(/Deleted task "(.+)"/);
          if (deleteMatch) {
            taskTitle = deleteMatch[1];
          }
          // Extract from CREATE logs: "Created task "Title""
          else {
            const createMatch = log.details.match(/Created task "(.+)"/);
            if (createMatch) {
              taskTitle = createMatch[1];
            }
          }
          // Extract from UPDATE logs: "Task "Title": changes..."
          if (!taskTitle) {
            const updateMatch = log.details.match(/Task "(.+)":/);
            if (updateMatch) {
              taskTitle = updateMatch[1];
            }
          }
        }

        // Fallback if nothing found
        if (!taskTitle) {
          taskTitle = 'Unknown Task';
        }
      }

      return {
        ...log,
        taskTitle
      };
    });

    const total = await prisma.activityLog.count();

    res.json({
      logs: logsWithTaskTitles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Fetch activity logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;