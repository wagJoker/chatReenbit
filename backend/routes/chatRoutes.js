import express from 'express';
import { getChats, createChat, updateChat, deleteChat } from '../controllers/chatController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.route('/')
  .get(getChats)
  .post(createChat);

router.route('/:id')
  .put(updateChat)
  .delete(deleteChat);

export default router;