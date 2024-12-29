import { createModuleLogger } from '../logger';
import { analytics } from '../analytics';

const logger = createModuleLogger('ai-service');

interface CompletionOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

interface ImageGenerationOptions {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
  n?: number;
}

class AIService {
  private static instance: AIService;
  private apiKey: string;

  private constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async fetchOpenAI(endpoint: string, options: RequestInit) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
  }

  public async getCompletion(options: CompletionOptions) {
    try {
      logger.info('Requesting AI completion', { prompt: options.prompt });
      analytics.track('ai_completion_requested', { prompt: options.prompt });

      const response = await this.fetchOpenAI('completions', {
        method: 'POST',
        body: JSON.stringify({
          model: options.model || 'gpt-3.5-turbo',
          prompt: options.prompt,
          max_tokens: options.maxTokens || 100,
          temperature: options.temperature || 0.7,
        }),
      });

      analytics.track('ai_completion_received', { success: true });
      return response.choices[0].text;
    } catch (error) {
      logger.error('AI completion failed', { error, options });
      analytics.track('ai_completion_received', { success: false, error });
      throw error;
    }
  }

  public async generateImage(options: ImageGenerationOptions) {
    try {
      logger.info('Requesting image generation', { prompt: options.prompt });
      analytics.track('ai_image_requested', { prompt: options.prompt });

      const response = await this.fetchOpenAI('images/generations', {
        method: 'POST',
        body: JSON.stringify({
          prompt: options.prompt,
          n: options.n || 1,
          size: options.size || '1024x1024',
        }),
      });

      analytics.track('ai_image_received', { success: true });
      return response.data[0].url;
    } catch (error) {
      logger.error('Image generation failed', { error, options });
      analytics.track('ai_image_received', { success: false, error });
      throw error;
    }
  }

  public async analyzePrescription(text: string) {
    return this.getCompletion({
      prompt: `Analyze this prescription and extract key information:\n\n${text}`,
      maxTokens: 200,
      temperature: 0.3,
    });
  }

  public async getSideEffects(medication: string) {
    return this.getCompletion({
      prompt: `List common side effects of ${medication}:`,
      maxTokens: 150,
      temperature: 0.3,
    });
  }
}

export const aiService = AIService.getInstance();