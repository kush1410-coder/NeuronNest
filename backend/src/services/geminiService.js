const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

const proModel = genAI.getGenerativeModel({
    model: "gemini-2.5-pro"
});

// High-quality local fallback stories for offline/rate-limited states
const FALLBACK_STORIES = {
  english: {
    happy: {
      animals: "Once upon a time, a cheerful little puppy named Buster lived in a sunny valley. Buster loved running around chasing colorful butterflies. Today, he met a shy rabbit named Pip who was afraid of crossing a small stream. Buster smiled warmly and said, 'Don't worry, Pip! We can jump together!' With a big leap, they crossed the stream and laughed happily. Educational Lesson: True happiness comes from helping and sharing adventures with others. Takeaway: Be a kind friend and spread joy wherever you go!",
      space: "A brave young astronaut named Nova strapped into her shiny rocket ship, ready to explore the glittery nebula. As the engines roared, she felt so excited to see the twinkling stars closer! She zoomed past a purple planet and met a friendly green space-pup named Cosmo. Cosmo guided Nova to a planet made entirely of bouncing bubbles! Educational Lesson: Curiosity and courage let us discover amazing new worlds. Takeaway: Never stop exploring and dreaming big!",
      default: "A happy adventurer set out on a journey today. Along the way, they met a wise old owl who showed them that laughter is the best medicine. They laughed all day long, discovering magic in the trees. Educational Lesson: Kindness is free and makes the world brighter. Takeaway: Keep smiling and spreading good vibes!"
    },
    excited: {
      space: "A brave young astronaut named Nova strapped into her shiny rocket ship, ready to explore the glittery nebula. As the engines roared, she felt so excited to see the twinkling stars closer! She zoomed past a purple planet and met a friendly green space-pup named Cosmo. Cosmo guided Nova to a planet made entirely of bouncing bubbles! Educational Lesson: Curiosity and courage let us discover amazing new worlds. Takeaway: Never stop exploring and dreaming big!",
      default: "An excited explorer climbed the highest mountain in the kingdom. At the top, they found a glowing crystal that changed colors! It was the most exciting day ever. Educational Lesson: Curiosity leads to wonderful new discoveries. Takeaway: Be adventurous and follow your dreams!"
    },
    calm: {
      default: "Deep in the green Whisper Woods, the giant oak trees gently swayed in the cool afternoon breeze. A little girl named Lily sat by a crystal clear stream, listening to the soft murmur of the water. She watched a ladybug slowly crawl along a green leaf. Breathing in the fresh scent of pine, she felt peaceful and completely calm. Educational Lesson: Nature teaches us to slow down, listen carefully, and appreciate quiet moments. Takeaway: Peace is found in the simple beauty around us."
    },
    default: {
      animals: "In a quiet forest, a gentle deer taught a little squirrel how to collect acorns. They worked together and made a big cozy nest for the winter. Educational Lesson: Cooperation makes hard work easy and fun. Takeaway: Help others whenever you can and make friends.",
      default: "Deep in the Whispering Woods, a friendly guide showed the travelers a secret pathway. They learned to listen to the sounds of nature and feel calm. Educational Lesson: Mindfulness and breathing bring peace to our minds. Takeaway: Take a deep breath and stay positive."
    }
  },
  hindi: {
    happy: {
      animals: "एक समय की बात है, एक खुशमिजाज छोटा शेर का बच्चा जिसका नाम शेरू था, वह हरे-भरे जंगल में रहता था। शेरू को तितलियों के पीछे दौड़ना बहुत पसंद था। आज उसे एक घबराया हुआ खरगोश मिला जो नदी पार करने से डर रहा था। शेरू मुस्कुराया और बोला, 'डरो मत दोस्त, हम साथ मिलकर कूदेंगे!' उन्होंने एक बड़ी छलांग लगाई और खुशी-खुशी नदी पार कर ली। सीख: दूसरों की मदद करने से सच्ची खुशी मिलती है। संदेश: हमेशा दयालु बनें और खुशियाँ फैलाएँ!",
      space: "एक साहसी युवा अंतरिक्ष यात्री जिसका नाम नील था, वह अपने अंतरिक्ष यान में बैठकर तारों की सैर पर निकला। नील बहुत खुश था क्योंकि वह पहली बार चांद को पास से देखने जा रहा था। वहां उसने एक प्यारे रोबोट दोस्त को देखा। सीख: नई चीजों को जानने की इच्छा ही हमें आगे बढ़ाती है। संदेश: हमेशा खुश रहें और सीखते रहें!",
      default: "एक खुशमिजाज नन्हे बालक ने अपनी जादुई यात्रा शुरू की। रास्ते में उसे एक समझदार तोता मिला जिसने उसे मीठी वाणी बोलना सिखाया। सीख: मीठे बोल बोलने से सब मित्र बन जाते हैं। संदेश: हमेशा खुश रहें और प्यार से बात करें।"
    },
    default: {
      animals: "एक जंगल में एक दयालु हिरण और एक नटखट बंदर रहते थे। दोनों साथ मिलकर भोजन की तलाश करते थे और एक-दूसरे की रक्षा करते थे। सीख: एकता में ही असली शक्ति होती है। संदेश: हमेशा अपने दोस्तों का साथ दें और मिलकर काम करें।",
      default: "एक सुंदर पहाड़ी के पास एक शांत गांव था। वहां के बच्चे रोज सुबह पक्षियों के गीतों के साथ जागते थे और शांति से पढ़ाई करते थे। सीख: शांत मन से हर समस्या का समाधान मिल जाता है। संदेश: हमेशा शांत रहें और मन लगाकर काम करें।"
    }
  }
};

exports.generateStory = async (
    age,
    emotion,
    topic,
    learningLevel,
    language = "English"
) => {
    const prompt = `
You are an expert children's storyteller.

Child Age: ${age}
Current Emotion: ${emotion}
Topic: ${topic}
Learning Level: ${learningLevel}
Story Language: ${language}

Requirements:
- Write the entire story in the specified language (if Hindi, write it in Hindi using standard Devanagari script).
- Personalize the story for the emotion.
- Teach one educational lesson.
- Keep vocabulary suitable for the age.
- End with a positive takeaway.
`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (apiError) {
        console.warn("Gemini API call failed (likely quota limit 429). Using high-quality local fallback story generator...", apiError.message);
        
        // Select fallback story based on parameters
        const langKey = (language && language.toLowerCase() === "hindi") ? "hindi" : "english";
        const emotionKey = (emotion && emotion.toLowerCase()) || "default";
        const topicKey = (topic && topic.toLowerCase()) || "default";
        
        const langLibrary = FALLBACK_STORIES[langKey] || FALLBACK_STORIES.english;
        const emotionLibrary = langLibrary[emotionKey] || langLibrary.default;
        
        let storyText = emotionLibrary[topicKey] || emotionLibrary.default || langLibrary.default.default;
        
        // Quick personalization replacement
        storyText = `[AI Offline Companion Story]\n\n` + storyText.replace(/adventurer/g, `explorer (Age ${age})`);
        
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