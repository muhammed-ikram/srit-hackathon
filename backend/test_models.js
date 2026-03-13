require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Note: The SDK doesn't have a direct 'listModels' on genAI, usually we check docs.
    // But we can try to hit the endpoint manually or check the error suggestion.
    console.log("Checking API key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

    // Testing specific known working models for this SDK version
    const modelsToTest = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-pro"];

    for (const m of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("hello");
        console.log(`Model ${m}: SUCCESS`);
      } catch (e) {
        console.log(`Model ${m}: FAILED - ${e.message}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

listModels();
