import express from 'express';
import { prisma } from '../utils/dbSetup';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all community posts
router.get('/posts', async (req, res) => {
  try {
    const { category, authorId } = req.query;

    const where: Record<string, unknown> = {};
    if (category) where['category'] = category;
    if (authorId) where['authorId'] = authorId;

    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: posts,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch community posts',
    });
  }
});

// Create new post
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    const { title, content, category, tags } = req.body;

    const post = await prisma.communityPost.create({
      data: {
        authorId: req.user.id,
        title,
        content,
        category,
        tags: tags || [],
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: post,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to create community post',
    });
  }
});

// Add comment to post
router.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    const { content } = req.body;
    const postId = req.params['postId'];

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    const comment = await prisma.communityComment.create({
      data: {
        postId,
        authorId: req.user.id,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to create comment',
    });
  }
});

export default router; 