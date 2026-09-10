const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const aiConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    sessionId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Marketplace Assistant Chat'
    },
    messages: [messageSchema]
  },
  {
    timestamps: true
  }
);

aiConversationSchema.index({ user: 1, updatedAt: -1 });
aiConversationSchema.index({ sessionId: 1 });

const AIConversation = mongoose.model('AIConversation', aiConversationSchema);

module.exports = AIConversation;
