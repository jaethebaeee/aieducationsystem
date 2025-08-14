import express from 'express';
import { aiService } from '../services/aiService';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Story Block Endpoints
// POST /api/story-blocks
// GET /api/story-blocks?userId=...
// PATCH /api/story-blocks/:id
// DELETE /api/story-blocks/:id

// Story Draft Endpoints
// POST /api/story-drafts
// GET /api/story-drafts?userId=...
// PATCH /api/story-drafts/:id
// DELETE /api/story-drafts/:id

// AI Feedback Endpoints
// POST /api/story-blocks/:id/feedback
// POST /api/story-drafts/:id/cultural-fit

router.get('/story-blocks', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }
    const blocks = await prisma.storyBlock.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
    return res.json({ success: true, data: blocks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch story blocks' });
  }
});

router.patch('/story-blocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { prompt, response } = req.body;
    if (!prompt && !response) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }
    const block = await prisma.storyBlock.findUnique({ where: { id } });
    if (!block) {
      return res.status(404).json({ success: false, message: 'Story block not found' });
    }
    const updated = await prisma.storyBlock.update({
      where: { id },
      data: {
        ...(prompt && { prompt }),
        ...(response && { response }),
      },
    });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update story block' });
  }
});

router.delete('/story-blocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.storyBlock.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete story block' });
  }
});

router.post('/story-blocks/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const block = await prisma.storyBlock.findUnique({ where: { id } });
    if (!block) {
      return res.status(404).json({ success: false, message: 'Story block not found' });
    }
    // Use AI to generate feedback for the response
    const feedback = await aiService.generateCulturalContextSuggestions(block.response);
    const updated = await prisma.storyBlock.update({
      where: { id },
      data: { feedback },
    });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate feedback' });
  }
});

// POST /api/story-drafts
router.post('/story-drafts', async (req, res) => {
  try {
    const { userId, title, blockIds, fullText } = req.body;
    if (!userId || !title || !Array.isArray(blockIds) || !fullText) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    // Prevent duplicate title for the same user
    const existing = await prisma.storyDraft.findFirst({ where: { userId, title } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Draft title already exists for this user' });
    }
    const draft = await prisma.storyDraft.create({
      data: {
        userId,
        title,
        blockIds: JSON.stringify(blockIds),
        fullText,
      },
    });
    return res.status(201).json({ success: true, data: draft });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create story draft' });
  }
});

router.get('/story-drafts', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }
    const drafts = await prisma.storyDraft.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    // Parse blockIds for each draft
    const parsedDrafts = drafts.map((d: { blockIds: string }) => ({ ...(d as any), blockIds: JSON.parse(d.blockIds) }));
    return res.json({ success: true, data: parsedDrafts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch story drafts' });
  }
});

router.patch('/story-drafts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, blockIds, fullText } = req.body;
    if (!title && !blockIds && !fullText) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }
    const draft = await prisma.storyDraft.findUnique({ where: { id } });
    if (!draft) {
      return res.status(404).json({ success: false, message: 'Story draft not found' });
    }
    const updated = await prisma.storyDraft.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(blockIds && { blockIds: JSON.stringify(blockIds) }),
        ...(fullText && { fullText }),
      },
    });
    return res.json({ success: true, data: { ...updated, blockIds: JSON.parse(updated.blockIds) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update story draft' });
  }
});

router.delete('/story-drafts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.storyDraft.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete story draft' });
  }
});

// POST /api/story-drafts/:id/cultural-fit
router.post('/story-drafts/:id/cultural-fit', async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await prisma.storyDraft.findUnique({ where: { id } });
    if (!draft) {
      return res.status(404).json({ success: false, message: 'Story draft not found' });
    }
    // Use AI to generate cultural fit feedback for the fullText
    const feedback = await aiService.generateCulturalContextSuggestions(draft.fullText);
    const updated = await prisma.storyDraft.update({
      where: { id },
      data: { culturalFitFeedback: feedback },
    });
    return res.json({ success: true, data: { ...updated, blockIds: JSON.parse(updated.blockIds) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate cultural fit feedback' });
  }
});

export default router; 