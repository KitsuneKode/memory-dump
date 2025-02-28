import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

router.post('/brain/share', auth, async (req, res) => {
  const userId = req.userId;
  const { share } = req.body;

  if (share === null || share === undefined) {
    res.status(401).json({ error: 'No options to operate on' });
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (!share) {
        await tx.link.delete({
          where: {
            userId: Number(userId),
          },
        });

        res
          .status(200)
          .json({ message: 'Shareable link removed successfully' });
        return;
      }

      const existingLink = await tx.link.findFirst({
        where: {
          userId: Number(userId),
        },
      });

      if (existingLink) {
        res.status(200).json({ link: `$share/{existingLink.hash}` });
        return;
      }

      const shareableLink = await tx.link.create({
        data: {
          hash: uuidv4(),
          userId: Number(userId),
        },
      });
      res.status(200).json({ hash: shareableLink.hash });
    });
  } catch (err) {
    console.error('Error during creating shareable link', err);
    res
      .status(500)
      .json({ error: 'Internal Server Error during creating shareable link' });
  }
});

router.get('/brain/:link', async (req, res) => {
  const { link } = req.params;

  if (!link) {
    res.status(401).json({ error: 'No link provided' });
    return;
  }

  const contents = await prisma.link.findFirst({
    where: {
      hash: link,
    },
    include: {
      user: {
        select: {
          username: true,
          id: true,
          Content: {
            select: {
              link: true,
              title: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (!contents) {
    res.status(404).json({ message: 'No contents found' });
    return;
  }
  res.status(200).json(contents);
});

export default router;
