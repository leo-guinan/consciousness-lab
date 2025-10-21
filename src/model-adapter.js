/**
 * Universal Model Adapter
 * Supports OpenRouter, Ollama, and direct API calls
 */

import axios from 'axios';

export class ModelAdapter {
  constructor(config = {}) {
    this.openrouterKey = config.openrouterKey || process.env.OPENROUTER_API_KEY;
    this.anthropicKey = config.anthropicKey || process.env.ANTHROPIC_API_KEY;
    this.openaiKey = config.openaiKey || process.env.OPENAI_API_KEY;
    this.ollamaHost = config.ollamaHost || process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.timeout = config.timeout || 30000;
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  /**
   * Determine provider from model string
   */
  getProvider(modelString) {
    if (modelString.includes('/')) {
      // Format: provider/model or just model with slash
      return 'openrouter';
    }
    // Local model format (no slash)
    return 'ollama';
  }

  /**
   * Call a model with retry logic
   */
  async call(modelString, prompt, options = {}) {
    const provider = this.getProvider(modelString);
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this._callProvider(provider, modelString, prompt, options);
        return response;
      } catch (error) {
        if (attempt === this.retryAttempts) {
          throw error;
        }
        console.warn(`Attempt ${attempt} failed, retrying in ${this.retryDelay}ms...`);
        await this.sleep(this.retryDelay * attempt);
      }
    }
  }

  /**
   * Route to correct provider
   */
  async _callProvider(provider, modelString, prompt, options) {
    switch (provider) {
      case 'openrouter':
        return await this._callOpenRouter(modelString, prompt, options);
      case 'ollama':
        return await this._callOllama(modelString, prompt, options);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * OpenRouter API call
   */
  async _callOpenRouter(model, prompt, options = {}) {
    if (!this.openrouterKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        ...options.additionalParams
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openrouterKey}`,
          'HTTP-Referer': options.referer || 'https://github.com/yourusername/consciousness-lab',
          'X-Title': 'Consciousness Lab'
        },
        timeout: this.timeout
      }
    );

    if (!response.data.choices || !response.data.choices[0]) {
      throw new Error('Invalid response from OpenRouter');
    }

    return {
      text: response.data.choices[0].message.content,
      model: model,
      provider: 'openrouter',
      usage: response.data.usage,
      raw: response.data
    };
  }

  /**
   * Ollama API call (local models)
   */
  async _callOllama(model, prompt, options = {}) {
    const response = await axios.post(
      `${this.ollamaHost}/api/generate`,
      {
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          num_predict: options.maxTokens || 1000,
          ...options.additionalParams
        }
      },
      {
        timeout: this.timeout
      }
    );

    if (!response.data.response) {
      throw new Error('Invalid response from Ollama');
    }

    return {
      text: response.data.response,
      model: model,
      provider: 'ollama',
      usage: {
        prompt_tokens: response.data.prompt_eval_count || 0,
        completion_tokens: response.data.eval_count || 0,
        total_tokens: (response.data.prompt_eval_count || 0) + (response.data.eval_count || 0)
      },
      raw: response.data
    };
  }

  /**
   * Test connection to provider
   */
  async testConnection(modelString) {
    try {
      const response = await this.call(modelString, 'Hello! Please respond with "OK"', {
        maxTokens: 10
      });
      return {
        success: true,
        model: modelString,
        response: response.text
      };
    } catch (error) {
      return {
        success: false,
        model: modelString,
        error: error.message
      };
    }
  }

  /**
   * Estimate cost for a model call
   */
  estimateCost(modelString, promptTokens, completionTokens, modelConfig = null) {
    if (this.getProvider(modelString) === 'ollama') {
      return 0; // Local models are free
    }

    // Use provided config or default estimates
    const costPer1k = modelConfig?.cost_per_1k_tokens || 0.01; // Default estimate
    const totalTokens = promptTokens + completionTokens;
    return (totalTokens / 1000) * costPer1k;
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * List available Ollama models
   */
  async listOllamaModels() {
    try {
      const response = await axios.get(`${this.ollamaHost}/api/tags`, {
        timeout: 5000
      });
      return response.data.models || [];
    } catch (error) {
      console.warn('Could not connect to Ollama:', error.message);
      return [];
    }
  }
}

export default ModelAdapter;

