const ChatHistory = require("../models/ChatHistory");

// Demo endpoint: stores user message and returns a stub reply.
const chat = async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ message: "message is required" });

  const userId = req.userId;
  const history = await ChatHistory.findOne({ userId });
  const messages = [
    ...(history?.messages || []),
    { role: "user", content: String(message) },
    {
      role: "assistant",
      content:
        "Thanks! This is a demo response. After integration, I’ll analyze your records + location to recommend doctors and let you book an appointment.",
    },
  ];

  const doc =
    history ||
    new ChatHistory({
      userId,
      messages: [],
    });
  doc.messages = messages.slice(-50);
  await doc.save();

  return res.json({ reply: messages[messages.length - 1].content });
};

module.exports = { chat };
