import express from 'express';
import { prisma } from '../utils/dbSetup';

const router = express.Router();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { category, type, language } = req.query;

    const where: Record<string, unknown> = {};
    if (category) where['category'] = category;
    if (type) where['type'] = type;
    if (language) where['language'] = language;

    const resources = await prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: resources,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
    });
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: req.params.id },
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }

    return res.json({
      success: true,
      data: resource,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resource',
    });
  }
});

export default router; 