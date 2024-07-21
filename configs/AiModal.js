// AiModal.js

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "Generate a workout plan for location: Australia, for Burn calories and lose goal and for the body part, Shoulders and for training level Beginner, with gym name, gym address, price, nearby gym, gym image url, geo coordinates. I want all in JSON format." },
      ],
    },
    {
      role: "model",
      parts: [
        { text: `{
          "workout_plan": {
            "location": "Australia",
            "goal": "Burn calories and lose weight",
            "body_part": "Shoulders",
            "training_level": "Beginner",
            "gym": {
              "name": "Fitness First",
              "address": "Level 1, 480 George St, Sydney NSW 2000",
              "price": "From $20 per week",
              "nearby_gym": "Anytime Fitness",
              "gym_image_url": "https://www.fitnessfirst.com.au/media/1634/sydney-city-gym.jpg",
              "geo_coordinates": "-33.8736, 151.2069"
            },
            "workout_schedule": [
              {
                "day": "Monday",
                "exercises": [
                  {
                    "name": "Dumbbell Lateral Raises",
                    "sets": 3,
                    "reps": "10-12",
                    "rest": "60 seconds"
                  },
                  {
                    "name": "Dumbbell Front Raises",
                    "sets": 3,
                    "reps": "10-12",
                    "rest": "60 seconds"
                  },
                  {
                    "name": "Dumbbell Shoulder Press",
                    "sets": 3,
                    "reps": "8-10",
                    "rest": "90 seconds"
                  }
                ]
              },
              {
                "day": "Wednesday",
                "exercises": [
                  {
                    "name": "Barbell Shoulder Press",
                    "sets": 3,
                    "reps": "8-10",
                    "rest": "90 seconds"
                  },
                  {
                    "name": "Seated Dumbbell Shoulder Press",
                    "sets": 3,
                    "reps": "10-12",
                    "rest": "60 seconds"
                  },
                  {
                    "name": "Lateral Raise Machine",
                    "sets": 3,
                    "reps": "12-15",
                    "rest": "60 seconds"
                  }
                ]
              },
              {
                "day": "Friday",
                "exercises": [
                  {
                    "name": "Arnold Press",
                    "sets": 3,
                    "reps": "10-12",
                    "rest": "60 seconds"
                  },
                  {
                    "name": "Upright Row",
                    "sets": 3,
                    "reps": "8-10",
                    "rest": "90 seconds"
                  },
                  {
                    "name": "Rear Delt Fly Machine",
                    "sets": 3,
                    "reps": "12-15",
                    "rest": "60 seconds"
                  }
                ]
              }
            ]
          }
        }` },
      ],
    },
  ],
});
