const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");  // Add body-parser to handle JSON in the request body
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();  // Initialize app first

app.use(cors());  // Then use cors
app.use(bodyParser.json());  // Parse JSON request bodies

// Use the API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);  // Correct way to use environment variables

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
    // Get conversation history from the request body, default to an empty string if not provided
    const conversation = req.body.history || "";

    if (!conversation) {
        return res.status(400).json({ error: "Conversation history is required." });
    }

    try {
        // Generate AI response using the conversation history
        const result = await model.generateContent(conversation);

        // Send the AI-generated response back to the frontend
        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("Erro na IA:", error);
        res.status(500).json({ reply: "Erro ao processar a resposta." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em https://lirabot.onrender.com`));
