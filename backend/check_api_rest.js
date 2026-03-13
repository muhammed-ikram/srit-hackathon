require('dotenv').config();
const axios = require('axios');

async function checkApi() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("API KEY MISSING");
        return;
    }
    
    const versions = ['v1', 'v1beta'];
    for (const v of versions) {
        try {
            console.log(`--- Checking ${v} ---`);
            const url = `https://generativelanguage.googleapis.com/${v}/models?key=${key}`;
            const res = await axios.get(url);
            console.log(`${v} SUCCESS: Found ${res.data.models.length} models`);
            res.data.models.forEach(m => console.log(`  - ${m.name}`));
        } catch (err) {
            console.error(`${v} FAILED: ${err.response?.status} ${err.response?.statusText}`);
            if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
        }
    }
}

checkApi();
