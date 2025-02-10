let chatHistory = [];
let botMood = "neutral"; // Default mood

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userInput").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});

const moodImages = {
    neutral: ["img/Neutral.jpg", "img/NeutralSpeaking.jpg"],
    happy: ["img/Happy.jpg", "img/happySpeaking.jpg"],
    sad: ["img/Sad.jpg", "img/SadSpeaking.jpg"],
    angry: ["img/Mad.jpg", "img/MadSpeaking.jpg"],
    surprised: ["img/Surprised.jpg", "img/SurprisedSpeaking.jpg"]
};

async function sendMessage() {
    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return;

    const chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += `<p><strong>Você:</strong> ${userInput}</p>`;
    document.getElementById("userInput").value = "";

    // Add user's message to chat history
    chatHistory.push({ role: "user", content: userInput });

    // Format conversation history
    const conversation = chatHistory.map(msg => ({
        content: msg.content,
        role: msg.role
    }));

    // Define personality instructions
    const personalityPrompt = `
        Você é uma IA com uma personalidade levemente rebelde.
        Responda de maneira criativa e bem-humorada. Seu criador é Matheus. 
        Mencione ele apenas quando for chamado ou faz sentido na conversa.
        Seu nome é "Lira". Mencione ele apenas quando for chamado ou faz sentido na conversa.
        Essa é sua personalidade, não precisa mencioná-la ou falar que foi programada, 
        isso cabe à sua decisão e ao contexto. Responda sempre em português.
    `;

    updateBotImage(botMood, true);

    const requestBody = {
        history: conversation,  // Send structured chat history
        personalityPrompt: personalityPrompt  // Send the personality prompt separately
    };

    console.log("Enviando requisição para backend:", requestBody);  // Debugging

    try {
        const response = await fetch("https://lirabot.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error("Erro ao obter resposta");
        const data = await response.json();

        console.log("Resposta da IA:", data);  // Debugging

        // Add bot's reply to chat history
        chatHistory.push({ role: "assistant", content: data.reply });
        botMood = detectMood(data.reply);

        // Type out the response in chatbox
        typeMessage(chatbox, `<strong>Bot:</strong> `, data.reply, () => updateBotImage(botMood, false));
    } catch (error) {
        console.error("Erro na requisição:", error);
        chatbox.innerHTML += `<p><strong>Bot:</strong> Ocorreu um erro ao processar sua mensagem.</p>`;
        updateBotImage("neutral", false);
    }
}





const keywords = {
    happy: ["feliz", "alegre", "animado", "radiante", "sorridente", "contente", "empolgado", "eufórico", "entusiasmado", "satisfeito", "maravilhado", "divertido", "exultante", "extasiado", "kkk", "haha", "hehe", "hilariante", "grato", "satisfeito", "triunfante", "sorte", "diversão", "comemorando", "animador", "elevado", "encantado", "afortunado", "vivaz", "positivo", "orgulhoso"],
    sad: ["triste", "chateado", "abatido", "cansado", "desmotivado", "deprimido", "melancólico", "desanimado", "angustiado", "solitário", "nostálgico", "amargurado", "magoado", "frustrado", "arrasado", "desesperançoso", "lamentável", "pesaroso", "desolado", "desgostoso", "desencorajado", "inseguro", "desamparado", "infeliz", "derrotado", "desconsolado"],
    angry: ["bravo", "irritado", "nervoso", "puto", "indignado", "furioso", "enfurecido", "explosivo", "frustrado", "aborrecido", "enraivecido", "exasperado", "colérico", "furibundo", "revoltado", "furibundo", "rancoroso", "ofendido", "zangado", "ultrajado", "hostil", "irritante", "explodindo", "furibundo", "inflamado", "provocado", "ameaçador", "frenético"],
    surprised: ["surpreso", "chocado", "uau", "nossa", "incrível", "assustado", "espantado", "impressionado", "perplexo", "boquiaberto", "estupefato", "admirado", "chocado", "estonteado", "pasmado", "intrigado", "deslumbrado", "maravilhado", "desconcertado", "boca aberta", "assombrado", "incrédulo", "alucinado", "besta", "estupefato", "espantoso"]
};

function detectMood(response) {
    response = response.toLowerCase();
    for (const mood in keywords) {
        if (keywords[mood].some(word => response.includes(word))) {
            return mood;
        }
    }
    return "neutral";
}

function spawnEmojis(mood) {
    const emojiMap = {
        neutral: "🍪",
        happy: "🌟",
        sad: "💧",
        angry: "💢",
        surprised: "❗"
    };
    
    const emoji = emojiMap[mood] || "❓";
    for (let i = 0; i < 12; i++) {
        const emojiElement = document.createElement("div");
        emojiElement.classList.add("falling-emoji");
        emojiElement.textContent = emoji;
        emojiElement.style.left = `${Math.random() * 100}vw`;
        emojiElement.style.top = `${Math.random() * 30 - 20}vh`;
        emojiElement.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`;
        emojiElement.style.animationDuration = `${Math.random() * 2 + 2}s`;
        document.body.appendChild(emojiElement);
        setTimeout(() => emojiElement.remove(), 4000);
    }
}

function updateBotImage(mood, speaking) {
    const botImage = document.getElementById("botImage");
    if (!moodImages[mood]) {
        console.error(`Mood "${mood}" not found in moodImages.`);
        return;
    }
    const newImage = speaking ? moodImages[mood][1] : moodImages[mood][0];
    botImage.src = newImage + "?t=" + new Date().getTime();
    if (!speaking) spawnEmojis(mood);
}

function typeMessage(chatbox, prefix, message, callback) {
    let index = 0;
    const botMessage = document.createElement("p");
    botMessage.innerHTML = prefix;
    chatbox.appendChild(botMessage);
    function type() {
        if (index < message.length) {
            botMessage.innerHTML += message[index];
            index++;
            setTimeout(type, 30);
        } else if (callback) {
            callback();
        }
    }
    type();
}