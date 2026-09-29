import { GoogleGenAI } from '@google/genai';

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private isAvailable: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
      try {
        this.ai = new GoogleGenAI({ apiKey });
        this.isAvailable = true;
        console.log('[GeminiService] Initialized GoogleGenAI successfully.');
      } catch (err) {
        // Fall back gracefully
      }
    }
  }

  public async generateReasoning(prompt: string, systemInstruction?: string): Promise<string | null> {
    if (!this.ai || !this.isAvailable) return null;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || 'You are OpsMind, an expert enterprise SRE and incident intelligence agent.',
          temperature: 0.2,
        }
      });
      return response.text || null;
    } catch (err: any) {
      return null;
    }
  }

  public isEnabled(): boolean {
    return this.isAvailable;
  }
}

export const geminiService = new GeminiService();
