import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';
import { signInObject, userObject } from '../schema/user.schema';
import { getValidationErrors, validate } from '../util';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, NODE_ENV } from '../config';

const router = Router();
const { user } = new PrismaClient();

router.post('/signup', async (req: Request, res: Response) => {
  // try {
  const { username, password, email } = req.body;

  const result = validate(userObject, { username, password, email });
  if (!result.success) {
    res.status(411).json({
      message: 'Errors in Input',
      error: getValidationErrors(result),
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const response = await user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });
    console.log(response);

    res.json({
      message: 'Sign up Successful',
    });
  } catch (err: any) {
    if (NODE_ENV! === 'dev') console.log('Error at Prisma');

    if (err.code === 'P2002') {
      res.status(403).json({
        message: 'User already exists',
      });
      return;
    }
    res.status(403).json({
      message: 'Error during signup',
      errorCode: err.code,
    });
  }
  // } catch (err) {
  //   if (NODE_ENV! === 'dev') console.log(err);

  //   res.status(500).json({
  //     message: 'Internal Server Error',
  //   });
  // }
});

router.post('/signin', async (req: Request, res: Response) => {
  // try {
  const { email, password } = req.body;

  const result = validate(signInObject, { password, email });
  if (!result.success) {
    res.status(411).json({
      message: 'Input not Valid',
      error: getValidationErrors(result),
    });
    return;
  }

  try {
    const response = await user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    console.log(response);

    if (!response || !(await bcrypt.compare(password, response.password))) {
      res.status(403).json({
        message: 'Invalid Email or Password',
      });
      return;
    }
    const id = response.id;
    const token = jwt.sign({ id }, JWT_SECRET!);
    res.json({
      message: 'Log in Successful',
      token,
    });
  } catch (err) {
    if (NODE_ENV! === 'dev') console.log(err);

    res.status(403).json({
      message: 'Something went wrong',
    });
  }
  // }
  // catch (err) {
  //   if (NODE_ENV! === 'dev') console.log(err);

  //   res.status(500).json({
  //     message: 'Internal Server Error',
  //   });
  // }
});

export default router;
