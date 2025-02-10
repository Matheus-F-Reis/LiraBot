const express = require("express");
const cors = require("cors");

const app = express();  // Initialize app first

app.use(cors()); // Then use cors

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use the API key from the .env file
const genAI = new GoogleGenerativeAI(AIzaSyCy4MLhxdfKqD3FoFY8aWkeY1Djk8xKAtg);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
    const conversation = req.body.history || "";
    try {
        const result = await model.generateContent(conversation);
        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("Erro na IA:", error);
        res.status(500).json({ reply: "Erro ao processar a resposta." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em https://lirabot.onrender.com`));

//AIzaSyCy4MLhxdfKqD3FoFY8aWkeY1Djk8xKAtg