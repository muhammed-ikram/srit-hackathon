const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Generate a response from Gemini AI
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} modelName - The model to use (default: gemini-1.5-flash)
 */
const generateContent = async (prompt, modelName = "gemini-flash-latest") => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY not found in .env. AI features will fail.");
            return { success: false, message: "AI API key not configured." };
        }

        const modelIdentifier = modelName.startsWith("models/") ? modelName : `models/${modelName}`;
        console.log(`[AI] Initializing SDK with key: ${apiKey.substring(0, 6)}...`);
        const genAI = new GoogleGenerativeAI(apiKey);

        console.log(`[AI] Attempting generation with model: ${modelIdentifier}`);

        const model = genAI.getGenerativeModel({ model: modelIdentifier });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`[AI] Generation successful!`);
        return { success: true, text };
    } catch (error) {
        console.error("AI Generation Error:", error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    generateContent
};
