const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

// Use the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
    const conversation = req.body.history || [];
    const personalityPrompt = req.body.personalityPrompt || "";

    if (conversation.length === 0) {
        return res.status(400).json({ error: "Conversation history is required." });
    }

    try {
        // Create the full AI prompt by combining personality and conversation
        let prompt = personalityPrompt + "\n" + 
            conversation.map(msg => `${msg.role === "user" ? "Usuário" : "Assistente"}: ${msg.content}`).join("\n") + "\nAssistente:";

        console.log("Prompt enviado para IA:", prompt);  // Debugging

        // Generate AI response
        const result = await model.generateContent(prompt);

        console.log("Resposta da IA:", result.response.text());  // Debugging

        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("Erro na IA:", error);
        res.status(500).json({ reply: "Erro ao processar a resposta." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando em https://lirabot.onrender.com`));
