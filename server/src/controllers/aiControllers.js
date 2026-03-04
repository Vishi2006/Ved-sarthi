const ChatHistory = require("../models/ChatHistory");
const tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");

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

const uploadReport = async (req, res) => {
  try {
    console.log("Upload report endpoint called");
    console.log("User authenticated:", !!req.userId);
    console.log("File received:", req.file ? { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : "No file");
    
    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({ message: "No report uploaded" });
    }

    const { mimetype, buffer, originalname } = req.file;

    console.log(`Processing file: ${originalname} (${mimetype})`);
    let extractedText = "";

    if (mimetype === "application/pdf") {
      console.log("Processing PDF...");
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
      console.log(`Extracted ${extractedText.length} characters from PDF`);
    } else if (mimetype.startsWith("image/")) {
      console.log("Processing image with Tesseract...");
      const result = await tesseract.recognize(buffer, "eng");
      extractedText = result.data.text;
      console.log(`Extracted ${extractedText.length} characters from image`);
    } else {
      console.error(`Unsupported file type: ${mimetype}`);
      return res.status(400).json({ message: "Unsupported file type. Please upload a PDF or an Image." });
    }

    if (!extractedText || extractedText.trim() === "") {
      console.error("No text extracted from file");
      return res.status(400).json({ message: "Could not extract text from the report. Please try another file." });
    }

    // Only save to chat history if user is authenticated
    if (req.userId) {
      console.log(`Saving to chat history for user: ${req.userId}`);
      const history = await ChatHistory.findOne({ userId: req.userId });
      const messages = [
        ...(history?.messages || []),
        { role: "user", content: `[User uploaded a report]\nFile: ${originalname}\nExtracted text:\n${extractedText.substring(0, 3000)}` },
        { role: "assistant", content: "I have read the uploaded report. What would you like to know about it?" },
      ];

      const doc =
        history ||
        new ChatHistory({
          userId: req.userId,
          messages: [],
        });
      doc.messages = messages.slice(-50);
      await doc.save();
      console.log("Report successfully saved to chat history");
    } else {
      console.log("Guest upload - not saving to chat history");
    }

    return res.json({
      message: "Report processed successfully",
      reply: "I have read the uploaded report. What would you like to know about it?",
      extractedText: extractedText.substring(0, 5000),
      isGuest: !req.userId
    });
  } catch (err) {
    console.error("Error processing report:", err.message, err.stack);
    return res.status(500).json({ message: "Failed to process the report", error: err.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(`Fetching chat history for user: ${userId}`);
    
    const history = await ChatHistory.findOne({ userId });
    
    if (!history) {
      console.log("No chat history found for user");
      return res.json({ messages: [] });
    }

    console.log(`Found ${history.messages.length} messages`);
    return res.json({ messages: history.messages });
  } catch (err) {
    console.error("Error fetching chat history:", err.message);
    return res.status(500).json({ message: "Failed to fetch chat history", error: err.message });
  }
};

module.exports = { chat, uploadReport, getChatHistory };
