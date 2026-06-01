const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
});

const proModel = genAI.getGenerativeModel({
    model: "gemini-1.5-pro"
});

// High-quality local fallback stories for offline/rate-limited states
const DYNAMIC_STORY_COMPONENTS = {
  english: {
    characters: {
      animals: [
        { name: "Sheru the little lion cub", desc: "who had a shiny golden mane and loved running around" },
        { name: "Pip the bouncy rabbit", desc: "who wore tiny green boots and loved eating carrots" },
        { name: "Bella the wise baby owl", desc: "who had big round eyes and a soft feather coat" }
      ],
      space: [
        { name: "Nova the brave young astronaut", desc: "who wore a shiny silver suit and helmet" },
        { name: "Cosmo the friendly green space-pup", desc: "who wagged his tail whenever a meteor zoomed past" },
        { name: "Zog the purple alien child", desc: "who had three kind eyes and loved floating in zero gravity" }
      ],
      magic: [
        { name: "Toby the little wizard", desc: "who carried a sparkly wand that smelled like lavender" },
        { name: "Lily the forest fairy", desc: "who had transparent wings and spread glowing dust" },
        { name: "Barnaby the talking kitten", desc: "who wore a tiny velvet wizard hat and knew secret spells" }
      ],
      dinosaurs: [
        { name: "Rexy the baby T-Rex", desc: "who was small but had a giant friendly smile" },
        { name: "Tops the little Triceratops", desc: "who loved collecting glowing colorful stones" },
        { name: "Dino the flying Pterodactyl", desc: "who loved playing hide-and-seek in the giant fern leaves" }
      ],
      ocean: [
        { name: "Ollie the baby octopus", desc: "who loved juggling shiny pearls under the blue sea" },
        { name: "Finley the cheerful dolphin", desc: "who loved doing high flips over the ocean waves" },
        { name: "Coral the little mermaid", desc: "who had a sparkling emerald tail and loved singing to seashells" }
      ],
      science: [
        { name: "Dexter the kid scientist", desc: "who wore giant safety goggles and loved mixing bubbly liquids" },
        { name: "Robo the cute helper robot", desc: "who had clicking gears and a heart shaped light-up screen" },
        { name: "Ada the curious inventor", desc: "who built a machine that turned grey clouds into colorful candy" }
      ],
      default: [
        { name: "Sam the young adventurer", desc: "who carried a bright yellow backpack full of maps" },
        { name: "Joy the smiling explorer", desc: "who walked with a bouncy step and a magnifying glass" }
      ]
    },
    emotions: {
      happy: "feeling super happy and singing a sweet song",
      excited: "jumping up and down with absolute excitement",
      curious: "wondering about the mysteries of the universe",
      calm: "feeling peaceful and listening to the quiet wind",
      sad: "feeling a bit down because they missed their favorite toy",
      angry: "feeling frustrated because things were not going their way",
      silly: "making funny faces and giggling at everything",
      bored: "looking around for something fun to do",
      sleepy: "yawning slowly and ready for a cozy rest",
      surprised: "staring with wide, amazed eyes at the glowing surroundings",
      proud: "smiling proudly after completing a challenging puzzle"
    },
    settings: {
      animals: ["in a lush green jungle full of whispering trees", "near a sparkling crystal stream in Sunny Valley", "inside a hidden meadow covered in wildflowers"],
      space: ["on a planet made of bouncy pink bubbles", "near a twinkling stardust nebula", "on a tiny friendly moon that smelled like cheese"],
      magic: ["in the magical Whisper Woods", "inside a castle made of sweet gingerbread and icing", "at the top of a fluffy cloud kingdom"],
      dinosaurs: ["in a warm volcanic valley full of giant green ferns", "near a hot spring surrounded by colorful crystals", "under the shade of giant ancient palm trees"],
      ocean: ["near a sparkling coral reef deep in the warm ocean", "inside an ancient shipwreck filled with friendly fish", "in a hidden underwater city made of shiny shells"],
      science: ["in a neat laboratory filled with bubbling test tubes", "inside a workshop full of spinning gears and neon lights", "near a high-tech science dome under the stars"],
      default: ["in a peaceful, quiet neighborhood", "at the edge of a magical golden forest"]
    },
    adventures: {
      beginner: [
        "They found a big box. It had a key. They opened it. Inside was a bright glowing star! It made them smile.",
        "They saw a high hill. A little bird sat on top. They walked up. The bird sang a happy tune. They sang back.",
        "They met a new friend. The friend wanted to play. They played tag. They ran fast and laughed."
      ],
      intermediate: [
        "They discovered a secret path marked with glowing stones. Following it, they found a lost treasure chest. Inside, a magical crystal shined brightly, lighting up the whole pathway!",
        "They climbed to the peak of a high mountain to see the beautiful sunset. Along the way, they helped a tiny bird fix its nest. The bird chirped a sweet melody as a thank you.",
        "They encountered a friendly creature who wanted to play a game of riddles. They solved the riddle together and celebrated with a funny dance under the warm sun."
      ],
      advanced: [
        "They uncovered an ancient, moss-covered archway inscribed with glowing glyphs. By deciphering the patterns, they unlocked a hidden sanctuary where starlight danced on the walls. It was a breathtaking sight that left them in complete awe.",
        "They navigated a challenging labyrinth of whispery pathways, utilizing their clever problem-solving skills to find the way out. At the center, they discovered a legendary golden tree whose leaves chimed like musical bells whenever the wind blew.",
        "They engaged in a creative experiment to build a flying balloon ship. Balancing the elements, they successfully launched it into the sky, witnessing the beautiful landscape expand beneath them in a glorious display of color."
      ]
    },
    lessons: {
      animals: "Educational Lesson: We must protect and love all creatures, big and small.",
      space: "Educational Lesson: The universe is vast, and curiosity helps us learn new things.",
      magic: "Educational Lesson: The truest magic is the kindness we share with others.",
      dinosaurs: "Educational Lesson: History teaches us how beautiful and diverse our Earth is.",
      ocean: "Educational Lesson: Keeping our waters clean keeps all our ocean friends safe and healthy.",
      science: "Educational Lesson: Science is all about asking questions and testing new ideas.",
      default: "Educational Lesson: Cooperation and patience make every challenge easier."
    },
    takeaways: [
      "Takeaway: Always keep a kind heart and help those around you!",
      "Takeaway: Never stop exploring and asking wonderful questions!",
      "Takeaway: You are capable of amazing things when you believe in yourself!"
    ]
  },
  hindi: {
    characters: {
      animals: [
        { name: "शेरू, एक छोटा शेर का बच्चा", desc: "जिसके पास सुनहरे घने बाल थे और उसे दौड़ना बहुत पसंद था" },
        { name: "चीकू, एक नटखट बंदर", desc: "जो पेड़ों पर कूदता था और हमेशा खुश रहता था" },
        { name: "मीनू, एक प्यारी गिलहरी", desc: "जिसकी पूंछ बहुत सुंदर थी और वह मीठे फल खाती थी" }
      ],
      space: [
        { name: "नील, एक साहसी अंतरिक्ष यात्री", desc: "जो चमकीला सूट पहनकर तारों की सैर करता था" },
        { name: "चिंटू, एक रोबोट कुत्ता", desc: "जिसकी पूंछ में से सुंदर रंग-बिरंगी रोशनी निकलती थी" }
      ],
      magic: [
        { name: "आर्यन, एक छोटा जादूगर", desc: "जिसके पास एक जादुई छड़ी थी जो चॉकलेट की खुशबू देती थी" },
        { name: "परी, एक सुंदर वन-अप्सरा", desc: "जिसके पंख चमकते थे और वह खुशियां बांटती थी" }
      ],
      default: [
        { name: "रामू, एक नन्हा खोजी", desc: "जो हमेशा अपने हाथ में एक जादुई नक्शा रखता था" }
      ]
    },
    emotions: {
      happy: "बहुत खुश था और एक प्यारा सा गीत गा रहा था",
      excited: "खुशी से उछल-कूद कर रहा था और नई खोज के लिए तैयार था",
      curious: "मन में नए सवाल लिए इधर-उधर देख रहा था",
      calm: "बिल्कुल शांत और आरामदायक महसूस कर रहा था",
      sad: "थोड़ा उदास था क्योंकि उसका खिलौना खो गया था",
      angry: "गुस्से में था क्योंकि काम उसकी पसंद से नहीं हुआ था",
      silly: "अजीब-अजीब चेहरे बनाकर सबको हंसा रहा था",
      bored: "सोच रहा था कि अब क्या नया और मजेदार किया जाए",
      sleepy: "धीरे-धीरे जम्हाई ले रहा था और सोने की तैयारी में था",
      surprised: "आश्चर्य से अपनी आंखें बड़ी करके देख रहा था",
      proud: "अपनी सफलता पर गर्व से मुस्कुरा रहा था"
    },
    settings: {
      animals: ["एक सुंदर हरे-भरे जंगल में", "नदी के किनारे ठंडी हवा के बीच", "रंगीन फूलों से सजी एक घाटी में"],
      space: ["एक चमकीले नीले ग्रह पर", "टिमटिमाते तारों के पास", "चांद की ठंडी छांव में"],
      magic: ["जादुई जंगलों के बीच", "एक सुंदर महल में जो मिठाई से बना था", "बादलों के ऊपर एक जादुई दुनिया में"],
      default: ["एक प्यारे और शांत गांव में", "एक सुंदर बगीचे में"]
    },
    adventures: {
      beginner: [
        "उसे एक जादुई चमकता हुआ पत्थर मिला। उसने उसे छुआ। पत्थर में से सुंदर रोशनी निकली। वह खुश हो गया।",
        "उसने एक बड़ा पेड़ देखा। पेड़ पर मीठे फल थे। उसने फल खाए। उसे बहुत मज़ा आया।"
      ],
      intermediate: [
        "उसने जंगल में एक नया रास्ता देखा। उस रास्ते पर सुंदर रंग-बिरंगे फूल खिले थे। वहां उसे एक नया दोस्त मिला और दोनों ने मिलकर खेला।",
        "उसने एक छोटी चिड़िया की मदद की जो उड़ नहीं पा रही थी। चिड़िया ने उसे धन्यवाद दिया और एक मीठा गीत सुनाया।"
      ],
      advanced: [
        "उसे एक प्राचीन जादुई संदूक मिला। संदूक को खोलने के लिए उसने एक कठिन पहेली को सुलझाया। संदूक के खुलते ही उसमें से चारों ओर ज्ञान की रोशनी फैल गई और सब कुछ सुंदर हो गया।",
        "उसने एक नया उपकरण बनाया जो हवा में तैर सकता था। उसने अपने दोस्तों को भी उस पर बिठाया और सबने मिलकर आसमान की सैर की।"
      ]
    },
    lessons: {
      animals: "सीख: हमें सभी पशु-पक्षियों से प्यार करना चाहिए और उनकी रक्षा करनी चाहिए।",
      space: "सीख: ब्रह्मांड बहुत बड़ा है और नई चीजें सीखने से ज्ञान बढ़ता है।",
      magic: "सीख: सबसे बड़ा जादू हमारे दिल की दयालुता और प्यार है।",
      default: "सीख: हमेशा मिलकर काम करना चाहिए, एकता में ही असली ताकत है।"
    },
    takeaways: [
      "संदेश: हमेशा खुश रहें और दूसरों की मदद करें!",
      "संदेश: कभी भी नई चीज़ें सीखने से पीछे न हटें!",
      "संदेश: खुद पर विश्वास रखें, आप बहुत खास हैं!"
    ]
  }
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

exports.generateStory = async (
    age,
    emotion,
    topic,
    learningLevel,
    language = "English"
) => {
    const prompt = `
You are an expert children's storyteller and child development coach.
Generate a captivating, age-appropriate story for a child based on these settings:
- **Child's Age**: ${age} years old (ensure vocabulary, sentence structure, and story complexity are perfect for this age)
- **Current Emotion/Mood**: ${emotion} (the story should gently address, match, or help guide this emotion in a positive way)
- **Story Theme/Topic**: ${topic}
- **Learning Level/Complexity**: ${learningLevel} (beginner: simple short sentences; intermediate: engaging story with some new words; advanced: richer vocabulary and descriptive plot)
- **Language**: ${language} (write the entire story, including lessons/takeaways, in this language. If Hindi, use Devanagari script)

Requirements:
1. Make it a fun, engaging, and imaginative story.
2. Weave in an educational/moral lesson naturally related to the theme.
3. End with a clear and inspiring "Takeaway: [message]" sentence for the child.
4. Do not include any introduction, formatting labels, or excessive markdown like '**' (keep punctuation clean for text-to-speech engines).
`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (apiError) {
        console.warn("Gemini API call failed. Using local fallback story generator...", apiError.message);
        
        const langKey = (language && language.toLowerCase() === "hindi") ? "hindi" : "english";
        const emotionKey = (emotion && emotion.toLowerCase()) || "default";
        const topicKey = (topic && topic.toLowerCase()) || "default";
        const levelKey = (learningLevel && learningLevel.toLowerCase()) || "intermediate";
        
        const langDb = DYNAMIC_STORY_COMPONENTS[langKey] || DYNAMIC_STORY_COMPONENTS.english;
        
        // Pick components, falling back to default key if specific topic key doesn't exist
        const chars = langDb.characters[topicKey] || langDb.characters.default;
        const char = getRandomElement(chars);
        
        const emoStr = langDb.emotions[emotionKey] || langDb.emotions.happy;
        
        const settings = langDb.settings[topicKey] || langDb.settings.default;
        const setting = getRandomElement(settings);
        
        const advList = langDb.adventures[levelKey] || langDb.adventures.intermediate;
        const adventure = getRandomElement(advList);
        
        const lesson = langDb.lessons[topicKey] || langDb.lessons.default;
        const takeaway = getRandomElement(langDb.takeaways);
        
        // Construct story based on details
        let storyText = "";
        
        if (langKey === "english") {
          const intro = `Once upon a time, ${setting}, lived ${char.name}, ${char.desc}. Today, ${char.name} was ${emoStr}.`;
          const mainStory = adventure;
          
          storyText = `[AI Offline Companion Story]\n\n${intro}\n\n${mainStory}\n\n${lesson}\n\n${takeaway}`;
          
          // Adjust length and complexity slightly for Age
          if (age && age < 5) {
            // Simplify / shorten for younger kids
            storyText = storyText.replace(/\n\n/g, "\n");
          }
        } else {
          // Hindi template
          const intro = `एक समय की बात है, ${setting}, ${char.name} रहता था, ${char.desc}। आज, ${char.name} ${emoStr}।`;
          const mainStory = adventure;
          
          storyText = `[AI ऑफ़लाइन साथी कहानी]\n\n${intro}\n\n${mainStory}\n\n${lesson}\n\n${takeaway}`;
        }
        
        return storyText;
    }
};

exports.detectEmotion = async (base64Image) => {
    try {
        // Strip any base64 headers if present (e.g. data:image/jpeg;base64,)
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const prompt = `Analyze the facial expression of the person in this image very carefully. 
        
        CRITICAL VALIDATION RULE:
        - If the image is completely black, blank, extremely dark, blurred, or DOES NOT clearly contain a visible human face, you MUST respond with the exact word: 'noface'.
        
        CRITICAL CLASSIFICATION RULES:
        - DO NOT default to 'happy' or 'calm' unless the face is genuinely smiling or completely resting neutral.
        - If the lips are slightly down-turned, the eyes are heavy, or the face looks slightly solemn/gloomy, classify it as 'sad'.
        - If there is even a slight forehead wrinkle, furrowed eyebrows, or tightened lips, classify it as 'angry'.
        - If the eyes look droopy or half-closed, classify it as 'sleepy'.
        - If the expression is blank, eyes are unfocused, or chin is resting, classify it as 'bored'.
        - If there is a wink, a smirk, or a playful tongue-out/crooked smile, classify it as 'silly'.
        - If the eyes are slightly widened or mouth is open/pursed, classify it as 'surprised' or 'excited'.
        
        Classify their mood/emotion as exactly one of these lowercase terms:
        - 'happy' (smiling, bright eyes, cheeks raised)
        - 'calm' (relaxed, neutral face, steady expression)
        - 'excited' (wide smile, open mouth, very bright raised eyebrows)
        - 'curious' (tilted head, raised single eyebrow, squinting eyes)
        - 'sad' (frowning, down-turned lip corners, droopy eyelids, gloomy or solemn face)
        - 'angry' (furrowed eyebrows, glaring eyes, tight lips, annoyed look)
        - 'silly' (winking, tongue out, playful look)
        - 'bored' (blank gaze, resting jaw, slight droop)
        - 'sleepy' (half-closed heavy eyes, relaxed eyelids)
        - 'surprised' (gasped open mouth, raised high eyebrows, wide rounded eyes)
        - 'proud' (confident slight smirk, raised chin, pleasant expression)

        Provide ONLY the single lowercase word from that list that fits best. No other words, no explanation.`;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg"
                }
            },
            prompt
        ]);

        const rawText = result.response.text().trim().toLowerCase();
        console.log("Raw emotion classification result from Gemini:", rawText);

        if (rawText.includes("noface")) {
            console.log("No human face detected in image.");
            return "noface";
        }

        const validEmotions = ["happy", "calm", "excited", "curious", "sad", "angry", "silly", "bored", "sleepy", "surprised", "proud"];
        
        // Robust regex check: find the first matching emotion word anywhere in the response text
        for (const emotion of validEmotions) {
            if (rawText.includes(emotion)) {
                console.log("Parsed emotion:", emotion);
                return emotion;
            }
        }

        return "happy"; // default fallback
    } catch (error) {
        console.error("Error in detectEmotion service:", error);
        return "happy"; // fallback on failure
    }
};
