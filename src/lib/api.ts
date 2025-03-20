
import { toast } from "sonner";
import { Character, CharacterDescription, GenerateCharacterResponse } from "@/types";

// API keys would typically be stored in environment variables or fetched securely
// For this demo, we'll handle them through user input
let runwareApiKey = '';
let exaApiKey = '';
let groqApiKey = '';

export const setApiKeys = (keys: { runware?: string; exa?: string; groq?: string }) => {
  if (keys.runware) runwareApiKey = keys.runware;
  if (keys.exa) exaApiKey = keys.exa;
  if (keys.groq) groqApiKey = keys.groq;
};

export const getApiKeysSet = () => ({
  runware: !!runwareApiKey,
  exa: !!exaApiKey,
  groq: !!groqApiKey
});

// Function to extract content from a URL using Exa API
export async function extractUrlContent(url: string): Promise<string> {
  if (!exaApiKey) {
    throw new Error("Exa API key not set");
  }
  
  try {
    const response = await fetch('https://api.exa.ai/contents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${exaApiKey}`
      },
      body: JSON.stringify({
        url,
        extractive_answers: true,
        highlighting: true,
        include_raw_text: true
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to extract content from URL');
    }
    
    const data = await response.json();
    return data.raw_text || '';
  } catch (error) {
    console.error('Error extracting URL content:', error);
    toast.error('Failed to extract content from URL');
    throw error;
  }
}

// Function to generate character details using Groq API
export async function generateCharacter(description: CharacterDescription): Promise<Character> {
  if (!groqApiKey) {
    throw new Error("Groq API key not set");
  }
  
  let enhancedDescription = description.text;
  
  // If URL is provided, extract content and enhance description
  if (description.url) {
    try {
      const urlContent = await extractUrlContent(description.url);
      enhancedDescription += "\n\nAdditional context from URL:\n" + urlContent;
    } catch (error) {
      console.warn('Could not extract URL content, proceeding with base description only');
    }
  }
  
  try {
    const prompt = `
You are a creative assistant helping to create a chatbot character.
Based on the following description, generate a detailed character profile:

${enhancedDescription}

Provide the information in a JSON format with the following structure:
{
  "name": "Character's name",
  "title": "A short, catchy title (max 40 chars)",
  "persona": "A detailed personality description (200-300 words)",
  "greeting": "The first message the character says to users (50-100 words)",
  "scenario": "The setting or context of conversations (100-150 words)",
  "exampleDialogues": ["3-5 example exchanges between the character and a user"]
}

Make the character compelling, consistent, and match the description provided.
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a creative AI assistant that specializes in creating detailed character profiles."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate character');
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse character data from response');
    }
    
    const characterData = JSON.parse(jsonMatch[0]) as GenerateCharacterResponse;
    
    return {
      ...characterData,
      exampleDialogues: characterData.exampleDialogues || []
    };
  } catch (error) {
    console.error('Error generating character:', error);
    toast.error('Failed to generate character');
    throw error;
  }
}

// The RunwareService for image generation
export class RunwareService {
  private ws: WebSocket | null = null;
  private apiKey: string | null = null;
  private connectionSessionUUID: string | null = null;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private isAuthenticated: boolean = false;
  private connectionPromise: Promise<void> | null = null;
  private API_ENDPOINT = "wss://ws-api.runware.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.connectionPromise = this.connect();
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.API_ENDPOINT);
      
      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.authenticate().then(resolve).catch(reject);
      };

      this.ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        const response = JSON.parse(event.data);
        
        if (response.error || response.errors) {
          console.error("WebSocket error response:", response);
          const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
          toast.error(errorMessage);
          return;
        }

        if (response.data) {
          response.data.forEach((item: any) => {
            if (item.taskType === "authentication") {
              console.log("Authentication successful, session UUID:", item.connectionSessionUUID);
              this.connectionSessionUUID = item.connectionSessionUUID;
              this.isAuthenticated = true;
            } else {
              const callback = this.messageCallbacks.get(item.taskUUID);
              if (callback) {
                callback(item);
                this.messageCallbacks.delete(item.taskUUID);
              }
            }
          });
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("Connection error. Please try again.");
        reject(error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket closed, attempting to reconnect...");
        this.isAuthenticated = false;
        setTimeout(() => {
          this.connectionPromise = this.connect();
        }, 1000);
      };
    });
  }

  private authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not ready for authentication"));
        return;
      }
      
      const authMessage = [{
        taskType: "authentication",
        apiKey: this.apiKey,
        ...(this.connectionSessionUUID && { connectionSessionUUID: this.connectionSessionUUID }),
      }];
      
      console.log("Sending authentication message");
      
      // Set up a one-time authentication callback
      const authCallback = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.data?.[0]?.taskType === "authentication") {
          this.ws?.removeEventListener("message", authCallback);
          resolve();
        }
      };
      
      this.ws.addEventListener("message", authCallback);
      this.ws.send(JSON.stringify(authMessage));
    });
  }

  async generateImage(prompt: string): Promise<string> {
    // Wait for connection and authentication before proceeding
    await this.connectionPromise;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isAuthenticated) {
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

    const taskUUID = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      const message = [{
        taskType: "imageInference",
        taskUUID,
        positivePrompt: prompt,
        model: "runware:100@1",
        width: 512,
        height: 512,
        numberResults: 1,
        outputFormat: "WEBP",
        steps: 4,
        CFGScale: 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8,
      }];

      console.log("Sending image generation message:", message);

      this.messageCallbacks.set(taskUUID, (data: any) => {
        if (data.error) {
          reject(new Error(data.errorMessage));
        } else {
          resolve(data.imageURL);
        }
      });

      this.ws.send(JSON.stringify(message));
    });
  }
}

// Function to generate avatar image using RunwareService
export async function generateAvatar(character: Character): Promise<string> {
  if (!runwareApiKey) {
    throw new Error("Runware API key not set");
  }
  
  try {
    const runwareService = new RunwareService(runwareApiKey);
    
    const prompt = `
High-quality portrait of ${character.name}, a ${character.title}. 
Character description: ${character.persona.substring(0, 300)}
Style: Professional, high-quality, detailed, modern, photorealistic avatar.
    `;
    
    const imageUrl = await runwareService.generateImage(prompt);
    return imageUrl;
  } catch (error) {
    console.error('Error generating avatar:', error);
    toast.error('Failed to generate avatar');
    throw error;
  }
}
