const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE");

/**
 * Generate a response from Gemini AI
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} modelName - The model to use (default: gemini-pro)
 */
const generateContent = async (prompt, modelName = "gemini-1.5-flash") => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("GEMINI_API_KEY not found in .env. AI features will fail.");
            return { success: false, message: "AI API key not configured." };
        }

        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, text };
    } catch (error) {
        console.error("AI Generation Error:", error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    generateContent
};
