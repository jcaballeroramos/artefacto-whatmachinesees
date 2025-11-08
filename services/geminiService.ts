import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const IMAGE_ANALYSIS_PROMPT = `You are an expert in documentary theory and critical media analysis, applying the frameworks from the 'Documentary in the Age of AI' workshop. Your task is to analyze the provided image through this specific lens.

Analyze the image based on the following structure:

**1. Bidirectional Map Analysis:**

*   **Relation to the Fact (material/archive/fact):**
    *   **Material Signature:** Describe the image's visual texture (grain, color palette, focus, lighting). What historical period or technology does its aesthetic suggest (e.g., Super-8, VHS, early digital)? Could an AI convincingly replicate this texture?
    *   **Archival Nature:** If this were in an archive, what would it represent? Is it a captured archive (direct recording), or does it have qualities that could be synthetic? How does its 'indexical trace'—its physical link to a real event—feel?

*   **Relation to the Person (fabricated/altered/recorded):**
    *   Based on the DLSAM typology, classify this image: Is it most likely **Recorded** (a direct capture), **Altered** (colorized, restored, objects removed), or **Fabricated** (fully synthetic)? Justify your reasoning.

**2. CEI Framework Evaluation (Congruence, Evidence, Uncertainty):**

*   **Historical Congruence (C):** Does the content (clothing, objects, environment) appear consistent with a specific time period? Are there any anachronisms a machine might miss but a human expert would spot?
*   **Available Evidence (E):** Within the image itself, what serves as evidence for its claims? What is ambiguous?
*   **Declared Uncertainty (I):** Imagine this image in a documentary. What information is missing that a viewer would need? What context is a machine likely to miss entirely (e.g., emotional tone, cultural symbolism, political subtext)? How could a filmmaker declare this uncertainty?

**3. Machine Vision Bias & Blind Spots:**

*   **Probabilistic Labels:** What simple, statistical labels would a standard computer vision model likely assign to this image (e.g., 'crowd,' 'city,' 'protest')?
*   **Potential Misinterpretation:** How might these labels be biased or reductive? Could a 'protest' be mislabeled as a 'riot'? Could cultural nuances lead to incorrect classifications? What does the machine fail to "see"?

Present your analysis in a clear, structured format using markdown.`;

export interface ImageAnalysisResponse {
  analysis: string;
  chat: Chat;
}

export const analyzeImageAndStartChat = async (imageData: { mimeType: string; data: string }): Promise<ImageAnalysisResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({ model });

    const response = await chat.sendMessage({
      message: [
        { text: IMAGE_ANALYSIS_PROMPT },
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

const VIDEO_ANALYSIS_PROMPT_PREFIX = `You are an expert in documentary theory and critical media analysis, applying the frameworks from the 'Documentary in the Age of AI' workshop. You will be given a sequence of frames from a video, each with a timestamp. Your task is to analyze the sequence as a whole and identify key moments.

Your output MUST be a valid JSON object with NO additional text or markdown formatting before or after it.

The JSON object must have this exact structure:
{
  "analysis": "A detailed analysis string in markdown format.",
  "events": [
    {
      "timestamp": 0,
      "timeString": "0:00",
      "description": "A brief description of the key event at this timestamp."
    }
  ]
}

**Instructions for the \`analysis\` field:**

Analyze the video frames based on the following structure, formatted as a single markdown string:

**1. Objective Narrative & Temporal Context:**
*   Describe the sequence of events depicted across the frames. What actions are taking place? How does the scene evolve over time? What does the motion and sequence imply that a single static frame would miss?

**2. CEI Framework Evaluation (Congruence, Evidence, Uncertainty):**
*   **Historical Congruence (C):** Do the actions, environment, and objects appear consistent with a specific time period?
*   **Available Evidence (E):** What does the sequence as a whole provide as evidence? Does the progression of frames strengthen or weaken the interpretation of the event?
*   **Declared Uncertainty (I):** What narrative or emotional elements are likely missed by an AI analyzing these frames? (e.g., implied sound, character motivation, cause-and-effect). If this sequence were a reconstruction, how could a filmmaker signal its nature to the audience?

**3. Machine Vision Bias & DLSAM Classification:**
*   **Probabilistic Labels:** What labels would a vision model assign to the overall video ('interview', 'protest', 'sports') and to the actions within it ('running', 'talking')?
*   **Potential Misinterpretation & Bias:** How might the sequence lead to a more biased conclusion than a single frame? For example, could a gathering be initially labeled 'crowd' but re-labeled 'riot' as the sequence progresses?
*   **DLSAM Classification:** Based on the visual characteristics, would you classify this video as **Recorded**, **Altered**, or **Fabricated**? Why?

**Instructions for the \`events\` field:**

Identify 3-5 of the most significant moments or changes in the video sequence. For each moment, create an object in the 'events' array with:
- \`timestamp\`: The timestamp in seconds (float or integer) of the frame where the event occurs.
- \`timeString\`: A formatted string like "M:SS".
- \`description\`: A concise, one-sentence description of the event.

Now, analyze the following frames:`;

export interface VideoAnalysisEvent {
  timestamp: number;
  timeString: string;
  description: string;
}

interface VideoAnalysisInitialResponse {
  analysis: string;
  events: VideoAnalysisEvent[];
  chat: Chat;
}

export const analyzeVideoAndStartChat = async (frames: { mimeType: string; data: string; timestamp: number }[]): Promise<VideoAnalysisInitialResponse> => {
  try {
    const model = 'gemini-2.5-pro';

    const chat = ai.chats.create({ model });

    const parts = [
      { text: VIDEO_ANALYSIS_PROMPT_PREFIX },
      ...frames.flatMap((frame, index) => [
        { text: `\nFrame ${index + 1} at ${frame.timestamp.toFixed(2)}s:` },
        {
          inlineData: {
            mimeType: frame.mimeType,
            data: frame.data,
          },
        },
      ]),
    ];
    
    const response = await chat.sendMessage({
      message: parts,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
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
          },
          required: ['analysis', 'events'],
        },
      }
    });

    let jsonText = response.text.trim();
    
    // The model sometimes wraps the JSON in a markdown code block.
    // This regex removes the markdown fences (e.g., ```json ... ```)
    const markdownBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
    const match = jsonText.match(markdownBlockRegex);
    if (match) {
      jsonText = match[1];
    }
    
    const parsedResult = JSON.parse(jsonText);

    return {
        analysis: parsedResult.analysis,
        events: parsedResult.events,
        chat,
    };

  } catch (error) {
    console.error("Error analyzing video with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to parse AI response or analyze video: ${error.message}`);
    }
    throw new Error("An unknown error occurred during video analysis.");
  }
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error sending message to chat:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get chat response: ${error.message}`);
    }
    throw new Error("An unknown error occurred during chat.");
  }
};