const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Allow all origins (CORS) and parse incoming JSON data
app.use(cors()); 
app.use(express.json());

// Use the API key from the environment variable
const genAI = new GoogleGenerativeAI(AIzaSyCy4MLhxdfKqD3FoFY8aWkeY1Djk8xKAtg);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST route for chat
app.post("/chat", async (req, res) => {
    const conversation = req.body.history || "";
    console.log("Received conversation:", conversation);  // Log incoming conversation

    try {
        const result = await model.generateContent(conversation);
        console.log("Generated response:", result.response.text());  // Log generated response
        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("Erro na IA:", error);
        res.status(500).json({ reply: "Erro ao processar a resposta." });
    }
});

// Server listening on the correct port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em https://lirabot.onrender.com`));
