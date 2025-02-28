import { PrismaClient, ContentType } from '@prisma/client';
import { Router, Response, Request } from 'express';
import { auth } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
const router = Router();

router.get('/content', auth, async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized - No userId found' });
    return;
  }

  try {
    const contents = await prisma.user.findMany({
      where: {
        id: Number(userId),
      },
      select: {
        username: true,
        password: false,
        id: true,
        Content: {
          include: {
            Tags: true,
          },
        },
      },
    });

    if (!contents || contents.length === 0) {
      res.status(404).json({ error: 'No contents found' });
      return;
    }

    res.json({ message: 'Contents fetched successfully', contents });
  } catch (err) {
    console.error('Error during getting contents:', err);
    res
      .status(500)
      .json({ error: 'Internal Server Error during adding contents' });
  }
});

router.post('/content', auth, async (req: Request, res: Response) => {
  const userId = req.userId;
  const { type, link, title, tags } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized - No userId found' });
    return;
  }

  // Validate required fields
  if (!type || !link || !title) {
    res
      .status(400)
      .json({ error: 'Missing required fields: type, link, or title' });
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.content.create({
        data: {
          type,
          link,
          title,
          userId: Number(userId),
          Tags: {
            connectOrCreate:
              tags?.map((tag: string) => ({
                where: { tags: tag },
                create: { tags: tag },
              })) || [],
          },
        },
      });

      res.status(201).json({
        message: 'Content added successfully',
      });
    });
  } catch (err) {
    console.error('Error during adding content:', err);
    res
      .status(500)
      .json({ error: 'Internal Server Error while creating content' });
  }
});

router.delete('/content/:id', auth, async (req: Request, res: Response) => {
  const userId = req.userId;
  const id = req.params['id'];

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized - No userId found' });
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // First check if the content exists and belongs to the user
      const existingContent = await tx.content.findFirst({
        where: {
          id: Number(id),
          userId: Number(userId),
        },
      });

      if (!existingContent) {
        res.status(404).json({
          error: 'Content not found or you do not have permission to delete it',
        });
        return;
      }

      await tx.content.delete({
        where: {
          id: Number(id),
          userId: Number(userId),
        },
      });

      res.json({
        message: 'Content successfully deleted',
        deletedContentId: id,
      });
    });
  } catch (err) {
    console.error('Error during deleting content:', err);
    res
      .status(500)
      .json({ error: 'Internal Server Error error while deleting content' });
  }
});

export default router;
