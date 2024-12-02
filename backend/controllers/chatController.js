import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('lastMessage')
      .populate('participants', 'name avatar');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const chat = await Chat.create({
      firstName,
      lastName,
      participants: [req.user._id]
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateChat = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, participants: req.user._id },
      { firstName, lastName },
      { new: true }
    );
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      participants: req.user._id
    });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    await Message.deleteMany({ chatId: req.params.id });
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};