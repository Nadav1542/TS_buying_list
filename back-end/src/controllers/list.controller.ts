import { randomBytes } from 'crypto';
import { type Request, type Response } from 'express';
import prisma from '../utils/prisma.js';
import { catchAsync } from '../utils/catchAsync.js';

const DEFAULT_LIST_NAME = 'My List';

export const createList = catchAsync(async (req: Request, res: Response) => {
  const nameInput = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const name = nameInput.length > 0 ? nameInput : DEFAULT_LIST_NAME;
  const token = randomBytes(16).toString('hex');

  const list = await prisma.list.create({
    data: { name, token }
  });

  return res.status(201).json({
    success: true,
    data: {
      listId: list.id,
      name: list.name,
      token: list.token
    }
  });
});
