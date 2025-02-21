import { PrismaClient, ContentType } from '@prisma/client';
import { Router, Response, Request } from 'express';
import { auth } from '../middleware/auth.middleware';

const { content } = new PrismaClient();

const router = Router();
router.get('/content', auth, async (req: Request, res: Response) => {
  const userId = req.userId;

  //TODO prisma fetch

  const contents = await content.findMany();

  // const contents = [{ id: 1, type: 'document', link: 'link' }];

  res.json({ message: 'Contents fetched successfully', contents });
});

router.post('/content', auth, async (req: Request, res: Response) => {
  const userId = req.userId;
  const { type, link, title, tags } = req.body;
  if (!userId) {
    throw Error('No userId found');
  }

  //TODO
  // const contentId = 1; ///id

  await content.create({
    data: {
      type: type,
      link,
      title,
      userId: Number(userId),
      tags: {
        connectOrCreate: tags.map((tag: string) => ({
          where: { tags: tag },
          create: { tags: tag },
        })),
      },
    },
  });

  res.json({
    message: 'Content added successfully',
  });
});

router.delete('/content/:id', auth, async (req: Request, res: Response) => {
  const userId = req.userId;
  const id = req.params['id'];

  console.log(id, userId);

  //TODO

  // res.status(403).json({
  //   meesage: "Trying to delete content you don't own",
  // });

  // res.status(404).json({
  //   meesage: 'Content not Available',
  // });

  res.json({
    message: 'Content successfully deleted',
  });
});

export default router;
