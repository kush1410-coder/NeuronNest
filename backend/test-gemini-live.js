// test-gemini-live.js
require('dotenv').config({ path: './.env' });
const { generateStory } = require('./src/services/geminiService');

console.log("Testing service generateStory with fallback logic...");
generateStory(6, 'happy', 'animals', 'intermediate', 'English')
  .then(story => {
    console.log("Service call returned successfully!");
    console.log("--- STORY START ---");
    console.log(story);
    console.log("--- STORY END ---");
  })
  .catch(err => {
    console.error("Critical Failure:", err);
  });
