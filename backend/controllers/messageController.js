import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import { getRandomQuote } from '../utils/quotable.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('senderId', 'name avatar');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const chatId = req.params.chatId;

    const message = await Message.create({
      content,
      chatId,
      senderId: req.user._id
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    // Emit the message through socket.io
    req.io.to(chatId).emit('newMessage', message);

    // Auto-response
    setTimeout(async () => {
      const quote = await getRandomQuote();
      const autoMessage = await Message.create({
        content: quote.content,
        chatId,
        senderId: 'bot'
      });
      
      await Chat.findByIdAndUpdate(chatId, { lastMessage: autoMessage._id });
      req.io.to(chatId).emit('newMessage', autoMessage);
    }, 3000);

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findOneAndUpdate(
      { _id: req.params.messageId, senderId: req.user._id },
      { content, isEdited: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    req.io.to(message.chatId).emit('messageUpdated', message);
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};