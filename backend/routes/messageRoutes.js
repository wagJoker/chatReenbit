import express from 'express';
import { getMessages, sendMessage, editMessage } from '../controllers/messageController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.route('/:chatId')
  .get(getMessages)
  .post(sendMessage);

router.route('/:chatId/messages/:messageId')
  .put(editMessage);

export default router;