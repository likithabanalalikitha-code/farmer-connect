const { chatWithGroq } = require('../services/groqService');
const AIConversation = require('../models/AIConversation');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const handleChat = async (req, res, next) => {
  try {
    const { message, history = [], sessionId } = req.body;

    if (!message || message.trim() === '') {
      return errorResponse(res, 400, 'Message prompt cannot be empty.');
    }

    // Format conversation history for Groq
    const conversationMessages = [
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message.trim() }
    ];

    const result = await chatWithGroq(conversationMessages, req.user || null);

    // Save to database if user is authenticated
    if (req.user) {
      let conversation = await AIConversation.findOne({ user: req.user._id });
      if (!conversation) {
        conversation = new AIConversation({
          user: req.user._id,
          title: `Chat with ${req.user.name}`,
          messages: []
        });
      }

      conversation.messages.push(
        { role: 'user', content: message.trim(), timestamp: new Date() },
        { role: 'assistant', content: result.message, timestamp: new Date() }
      );

      // Keep recent 50 messages to prevent unbounded document size
      if (conversation.messages.length > 50) {
        conversation.messages = conversation.messages.slice(-50);
      }

      await conversation.save();
    }

    return successResponse(res, 200, 'AI response generated', {
      reply: result.message,
      products: result.products || []
    });
  } catch (error) {
    logger.error('AI chat endpoint error:', error.message);
    return errorResponse(res, 500, 'The AI assistant is temporarily unavailable. Please try again.');
  }
};

const getHistory = async (req, res, next) => {
  try {
    const conversation = await AIConversation.findOne({ user: req.user._id }).lean();
    return successResponse(res, 200, 'Conversation history fetched', {
      messages: conversation ? conversation.messages : []
    });
  } catch (error) {
    next(error);
  }
};

const clearHistory = async (req, res, next) => {
  try {
    await AIConversation.findOneAndDelete({ user: req.user._id });
    return successResponse(res, 200, 'Chat history cleared successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleChat,
  getHistory,
  clearHistory
};
