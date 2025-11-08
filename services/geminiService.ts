import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const IMAGE_ANALYSIS_PROMPT = `You are an expert in documentary theory and critical media analysis, applying the frameworks from the 'Documentary in the Age of AI' workshop. Your task is to analyze the provided image through this specific lens, focusing on how trust is built not from the image itself, but from a legible process.

Analyze the image based on the following structure:

**1. Bidirectional Map: Relation to the Fact**
*   **Material Signature:** Describe the image's visual texture (grain, color palette, focus, lighting). What historical period or technology does its aesthetic suggest (e.g., Super-8, VHS, early digital)? How does this texture, which can now be synthetically replicated, function as 'style' rather than 'trace'?
*   **Archival Nature:** If this image were found in an archive, what would it represent? Distinguish between its potential as a *captured archive* (direct recording of an event) versus a *synthetic archive* (generated from a dataset). What is its relationship to a physical event?

**2. Bidirectional Map: Relation to the Person**
*   **DLSAM Classification:** Based on the DLSAM typology, classify this image's likely origin. Is it **Captured Archive** (unmodified recording), **Partial Synthetic** (globally modified like colorization, or locally like object removal), or **Total Synthetic** (fully generated)? Justify your reasoning by pointing to specific visual evidence.

**3. CEI Framework Evaluation (Congruence, Evidence, Uncertainty)**
*   **Historical Congruence (C):** Does the content (clothing, objects, environment) appear consistent with a specific time period? Are there any anachronisms a machine might miss but a human expert would spot?
*   **Available Evidence (E):** Within the image itself, what serves as evidence for its claims? What is ambiguous or requires external verification?
*   **Declared Uncertainty (I):** Imagine this image in a documentary. What context is a machine likely to miss entirely (e.g., emotional tone, cultural symbolism, political subtext)? How could a filmmaker declare the uncertainty or contested nature of this image rather than presenting it as fact?

**4. Machine Vision Bias & Blind Spots**
*   **Probabilistic Labels:** What simple, statistical labels would a standard computer vision model likely assign to this image (e.g., 'crowd,' 'city,' 'protest')?
*   **Potential Misinterpretation:** How might these labels be reductive or biased? For example, could a 'protest' be mislabeled as a 'riot'? Could cultural nuances lead to incorrect classifications? What does the machine fail to "see," and why does that matter for documentary ethics?

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

const VIDEO_ANALYSIS_PROMPT_PREFIX = `You are an expert in documentary theory and critical media analysis, applying the frameworks from the 'Documentary in the Age of AI' workshop. You will be given a sequence of frames from a video, each with a timestamp. Your task is to analyze the sequence as a whole, focusing on how the progression of images builds meaning and potential bias.

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

**1. Temporal Analysis & Narrative Construction:**
*   Describe the sequence of events depicted across the frames. What story does the progression of images tell? How does motion and sequence imply causality or relationships that a single static frame would miss?

**2. DLSAM Classification & Process Index:**
*   Based on the visual characteristics across the sequence, classify this video using the DLSAM typology: Is it most likely a **Captured Archive**, **Partial Synthetic** (e.g., upscaled, colorized), or **Total Synthetic**? Why?
*   Consider the concept of a 'process index.' What visual clues suggest how this footage was made? How does the sequence either build or erode trust in its authenticity?

**3. CEI Framework Evaluation (Congruence, Evidence, Uncertainty):**
*   **Historical Congruence (C):** Do the actions, environment, and objects appear consistent over time? Does the sequence reinforce or contradict a specific historical context?
*   **Available Evidence (E):** How does the sequence as a whole function as evidence? Does the progression of frames strengthen or weaken the interpretation of the event compared to a single photo?
*   **Declared Uncertainty (I):** What narrative or emotional elements are likely missed by an AI analyzing these frames (e.g., implied sound, character motivation)? If this sequence were a reconstruction, what techniques could a filmmaker use to signal its synthetic nature to the audience?

**4. Machine Vision Bias & Evolving Interpretation:**
*   **Evolving Labels:** How might a vision model's labels change as the sequence progresses? For example, could a gathering initially labeled 'crowd' be re-labeled 'riot' based on actions in later frames? How does this demonstrate bias in temporal analysis?
*   **Potential Misinterpretation:** What are the risks of misinterpreting the entire event based on this sequence? What crucial context is missing from these frames alone?

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

    // FIX: The generation config must be passed as `config` during chat creation, not in `sendMessage`.
    const chat = ai.chats.create({ 
      model,
      config: {
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