
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { TAXONOMY } from './taxonomy';

// This function creates a new client instance for each call.
// This is necessary to ensure the latest API key from the environment is used.
const getGenAIClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        // This error will be caught by the calling components.
        throw new Error("API key not found. Please select an API key to proceed.");
    }
    return new GoogleGenAI({ apiKey });
};


const IMAGE_ANALYSIS_PROMPT = `You are an expert in documentary theory and critical media analysis, applying the frameworks from the 'Documentary in the Age of AI' workshop. Your task is to analyze the provided image through this specific lens, focusing on how credibility now rests on making the process legible.

Analyze the image based on the following structure, providing your analysis in markdown:

**1. Bidirectional map: relation to the fact**
*   **Material signature:** Describe the image's visual texture (grain, color palette, focus, lighting). What historical period or technology does its aesthetic suggest (e.g., Super-8, VHS, early digital)? How does this texture, which can now be synthetically replicated, function as 'style' rather than a 'trace' of reality?
*   **Archival nature:** If this image were found in an archive, what might it represent? Distinguish between its potential as a *captured archive* (a direct recording of an event) versus a *synthetic archive* (generated from a dataset). What is its relationship to a physical event, and how can we know?

**2. Taxonomy classification (Mililiere framework)**
*   **Classification Path:** Based on the detailed media taxonomy provided at the end of this prompt, determine the most accurate classification for this image. Provide the full path to the most specific category (e.g., 'Machine-made > Synthetic > Partially Synthetic > Local > DL-BASED > Visual > Static').
*   **Justification:** Briefly explain why you chose this path, referencing specific visual evidence from the image and ruling out other plausible categories.

**3. CEI framework evaluation (Congruence, Evidence, Uncertainty)**
*   **Historical congruence (C):** Does the content (e.g., clothing, objects, environment) appear consistent with a specific time period? Are there any anachronisms a machine might miss but a human expert would spot?
*   **Available evidence (E):** Within the image itself, what serves as evidence for its claims? What is ambiguous or requires external verification?
*   **Declared uncertainty (I):** Imagine this image in a documentary. What context is a machine likely to miss entirely (e.g., emotional tone, cultural symbolism, political subtext)? How could a filmmaker declare the uncertainty or contested nature of this image rather than presenting it as fact?

**4. Machine vision bias & blind spots**
*   **Probabilistic labels:** What simple, statistical labels would a standard computer vision model likely assign to this image (e.g., 'crowd,' 'city,' 'protest')?
*   **Potential misinterpretation:** How might these labels be reductive or biased? For example, could a 'protest' be mislabeled as a 'riot'? Could cultural nuances lead to incorrect classifications? What does the machine fail to "see," and why does that matter for documentary ethics?`;


export interface ImageAnalysisResponse {
  analysis: string;
  chat: Chat;
}

export const analyzeImageAndStartChat = async (imageData: { mimeType: string; data: string }): Promise<ImageAnalysisResponse> => {
  try {
    const ai = getGenAIClient();
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({ 
      model,
      config: {
        systemInstruction: "You are an expert in documentary theory and critical media analysis. Continue the conversation, answering the user's follow-up questions about the media they provided, always maintaining this persona."
      }
    });

    const fullPrompt = `${IMAGE_ANALYSIS_PROMPT}\n\n---\n**MEDIA TAXONOMY FOR CLASSIFICATION:**\n${JSON.stringify(TAXONOMY, null, 2)}`;

    const response = await chat.sendMessage({
      message: [
        { text: fullPrompt },
        {
          inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.data,
          },
        },
      ],
    });

    return {
      analysis: response.text,
      chat,
    };
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred during analysis: ${error.message}`);
    }
    throw new Error("An unknown error occurred during analysis.");
  }
};

const VIDEO_ANALYSIS_PROMPT_PREFIX = `You are an expert in documentary theory and critical media analysis, applying the frameworks from the 'Documentary in the Age of AI' workshop. You will be given a sequence of frames from a video, each with a timestamp. Your task is to analyze the sequence as a whole, focusing on how the progression of images builds meaning and potential bias.

Your output MUST be a valid JSON object with NO additional text or markdown formatting before or after it.

The JSON object must have this exact structure:
{
  "synopsis": "A concise, one-paragraph summary of the video's content and narrative, based on visual analysis.",
  "suggestedTitle": "A creative and relevant title for this video sequence.",
  "technicalDescription": {
    "duration": "The total duration of the provided clip, in M:SS format.",
    "estimatedShotCount": "An estimation of the number of distinct shots or camera angles (e.g., '1-2 shots', 'Multiple quick cuts').",
    "estimatedYear": "An estimation of the decade the footage was likely filmed (e.g., '1980s', '2010s').",
    "estimatedOrigin": "An estimation of the production context (e.g., 'Amateur home video', 'Professional news report', 'Artistic short film').",
    "formatAesthetic": "A description of the visual style (e.g., 'Grainy 16mm film', 'Low-resolution VHS', 'Crisp 4K digital')."
  },
  "taxonomyClassification": {
    "path": "The full path to the most specific and relevant category from the provided taxonomy.",
    "reasoning": "A detailed justification for the chosen classification path, referencing visual evidence from the frames."
  },
  "analysis": "A detailed analysis string in markdown format.",
  "events": [
    {
      "timestamp": 0,
      "timeString": "0:00",
      "description": "A brief description of the key event at this timestamp."
    }
  ],
  "keyPeople": [
    {
        "timestamp": 0,
        "timeString": "0:00",
        "name": "Person's name or a brief description (e.g., 'Person in red hat')",
        "description": "A brief description of the person's significance or first notable action."
    }
  ]
}

**Instructions for the \`analysis\` field:**

Analyze the video frames based on the following structure, formatting the entire analysis as a single markdown string:

**1. Temporal analysis & narrative construction**
*   Describe the sequence of events depicted across the frames. What story does the progression of images tell? How does motion and the sequence of frames imply causality or relationships that a single static image would miss?

**2. Process index**
*   Consider the concept of a 'process index.' What visual clues suggest how this footage was made? How does the sequence either build or erode trust in its authenticity?

**3. CEI framework evaluation (Congruence, Evidence, Uncertainty)**
*   **Historical congruence (C):** Do the actions, environment, and objects appear consistent over time? Does the sequence reinforce or contradict a specific historical context?
*   **Available evidence (E):** How does the sequence as a whole function as evidence? Does the progression of frames strengthen or weaken the interpretation of the event compared to a single photo?
*   **Declared uncertainty (I):** What narrative or emotional elements are likely missed by an AI analyzing these frames (e.g., implied sound, character motivation)? If this sequence were a reconstruction, what techniques could a filmmaker use to signal its synthetic nature to the audience?

**4. Machine vision bias & evolving interpretation**
*   **Evolving labels:** How might a vision model's labels change as the sequence progresses? For example, could a gathering initially labeled 'crowd' be re-labeled 'riot' based on actions in later frames? How does this demonstrate bias in temporal analysis?
*   **Potential misinterpretation:** What are the risks of misinterpreting the entire event based on this sequence? What crucial context is missing from these frames alone?

**Instructions for the \`taxonomyClassification\` field:**
Use the detailed media taxonomy (Mililiere framework) provided at the end of this prompt to classify the video. Select the most specific path that accurately describes the footage.

**Instructions for the \`events\` field:**
Identify 3-5 of the most significant moments or changes in the video sequence. For each moment, create an object in the 'events' array with:
- \`timestamp\`: The timestamp in seconds (float or integer) of the frame where the event occurs.
- \`timeString\`: A formatted string like "M:SS".
- \`description\`: A concise, one-sentence description of the event.

**Instructions for the \`keyPeople\` field:**
Identify up to 3 key individuals who appear in the video. For each person, provide the timestamp of their first clear appearance.
- \`timestamp\`: The timestamp in seconds (float or integer) of their first appearance.
- \`timeString\`: A formatted string like "M:SS".
- \`name\`: The person's name if identifiable, otherwise a descriptive label (e.g., "Woman in blue jacket").
- \`description\`: A concise, one-sentence description of their role or significance.
If no specific individuals are noteworthy, return an empty array [].

Now, analyze the following frames, which span a total duration of [VIDEO_DURATION]:`;

const VIDEO_ANALYSIS_PROMPT_SUFFIX = `
---
**MEDIA TAXONOMY FOR CLASSIFICATION:**
${JSON.stringify(TAXONOMY, null, 2)}
`;


export interface VideoAnalysisEvent {
  timestamp: number;
  timeString: string;
  description: string;
}

export interface KeyPerson {
    timestamp: number;
    timeString: string;
    name: string;
    description: string;
}

export interface TechnicalDescription {
    duration: string;
    estimatedShotCount: string;
    estimatedYear: string;
    estimatedOrigin: string;
    formatAesthetic: string;
}

export interface TaxonomyClassification {
    path: string;
    reasoning: string;
}

interface VideoAnalysisInitialResponse {
  analysis: string;
  events: VideoAnalysisEvent[];
  keyPeople: KeyPerson[];
  synopsis: string;
  suggestedTitle: string;
  technicalDescription: TechnicalDescription;
  taxonomyClassification: TaxonomyClassification;
  chat: Chat;
}

export const analyzeVideoAndStartChat = async (frames: { mimeType: string; data: string; timestamp: number }[]): Promise<VideoAnalysisInitialResponse> => {
  try {
    const ai = getGenAIClient();
    const model = 'gemini-2.5-pro';

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
          synopsis: { type: Type.STRING },
          suggestedTitle: { type: Type.STRING },
          technicalDescription: {
            type: Type.OBJECT,
            properties: {
              duration: { type: Type.STRING },
              estimatedShotCount: { type: Type.STRING },
              estimatedYear: { type: Type.STRING },
              estimatedOrigin: { type: Type.STRING },
              formatAesthetic: { type: Type.STRING },
            },
            required: ['duration', 'estimatedShotCount', 'estimatedYear', 'estimatedOrigin', 'formatAesthetic'],
          },
          taxonomyClassification: {
            type: Type.OBJECT,
            properties: {
              path: { type: Type.STRING },
              reasoning: { type: Type.STRING },
            },
            required: ['path', 'reasoning'],
          },
          analysis: { type: Type.STRING },
          events: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.NUMBER },
                timeString: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['timestamp', 'timeString', 'description'],
            },
          },
          keyPeople: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.NUMBER },
                timeString: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['timestamp', 'timeString', 'name', 'description'],
            },
          },
        },
        required: ['synopsis', 'suggestedTitle', 'technicalDescription', 'taxonomyClassification', 'analysis', 'events', 'keyPeople'],
      };
    
    const durationSeconds = frames[frames.length - 1]?.timestamp || 0;
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = Math.round(durationSeconds % 60);
    const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const promptWithDuration = VIDEO_ANALYSIS_PROMPT_PREFIX.replace('[VIDEO_DURATION]', durationString);

    const parts = [
      { text: promptWithDuration },
      ...frames.flatMap((frame, index) => [
        { text: `\nFrame ${index + 1} at ${frame.timestamp.toFixed(2)}s:` },
        {
          inlineData: {
            mimeType: frame.mimeType,
            data: frame.data,
          },
        },
      ]),
      { text: VIDEO_ANALYSIS_PROMPT_SUFFIX }
    ];
    
    // Step 1: Use a one-shot `generateContent` call for the initial structured JSON analysis.
    const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
    });

    let jsonText = response.text.trim();
    
    const markdownBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
    const match = jsonText.match(markdownBlockRegex);
    if (match) {
      jsonText = match[1];
    }
    
    const parsedResult = JSON.parse(jsonText);

    // Step 2: Create a new, clean chat session for the follow-up conversation.
    const history = [
        {
            role: 'user' as const,
            parts: [{ text: `I've provided a video, and you've generated an initial analysis. Now, please answer my follow-up questions about it.` }]
        },
        {
            role: 'model' as const,
            // Provide the detailed analysis as context for the model's first turn.
            parts: [{ text: `Of course. Here is the analysis I generated for your reference. I am ready for your questions.\n\n${parsedResult.analysis}` }]
        }
    ];

    const chat = ai.chats.create({
        model,
        history,
        config: {
          systemInstruction: "You are an expert in documentary theory and critical media analysis. You have already provided an initial analysis of a video. Continue the conversation by answering the user's follow-up questions about it, using the initial analysis as context provided in the first turn.",
        }
      });

    return {
        analysis: parsedResult.analysis,
        events: parsedResult.events,
        keyPeople: parsedResult.keyPeople || [],
        synopsis: parsedResult.synopsis,
        suggestedTitle: parsedResult.suggestedTitle,
        technicalDescription: parsedResult.technicalDescription,
        taxonomyClassification: parsedResult.taxonomyClassification,
        chat, // Return the new, conversational chat session.
    };

  } catch (error) {
    console.error("Error analyzing video with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to parse AI response or analyze video: ${error.message}`);
    }
    throw new Error("An unknown error occurred during video analysis.");
  }
};

export const sendMessageToChatStream = async (chat: Chat, message: string) => {
    try {
      return chat.sendMessageStream({ message });
    } catch (error) {
      console.error("Error sending message to chat:", error);
      if (error instanceof Error) {
          throw new Error(`Failed to get chat response: ${error.message}`);
      }
      throw new Error("An unknown error occurred during chat.");
    }
  };
