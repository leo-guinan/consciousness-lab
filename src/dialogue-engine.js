/**
 * Dialogue Engine
 * Orchestrates multi-agent conversations
 */

import { ModelAdapter } from './model-adapter.js';
import { CharacterSystem } from './character-system.js';

export class DialogueEngine {
  constructor(config = {}) {
    this.modelAdapter = new ModelAdapter(config.modelAdapter || {});
    this.characterSystem = new CharacterSystem(config.charactersPath);
    this.config = {
      exchanges: config.exchanges || 12,
      exchangesPerCharacter: config.exchangesPerCharacter || 3,
      delayBetweenExchanges: config.delayBetweenExchanges || 1000,
      characterOrder: config.characterOrder || ['sonnet', 'llama', 'llava', 'haiku'],
      ...config
    };
    this.listeners = [];
  }

  /**
   * Initialize the engine
   */
  async initialize() {
    await this.characterSystem.loadCharacters();
    return this;
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    this.listeners.push({ event, callback });
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    this.listeners
      .filter(l => l.event === event)
      .forEach(l => l.callback(data));
  }

  /**
   * Generate a complete dialogue
   */
  async generateDialogue(topic, modelConfig, options = {}) {
    const startTime = Date.now();
    
    // Emit start event
    this.emit('dialogue:start', { topic, modelConfig });

    // Initialize dialogue state
    const dialogue = {
      topic,
      modelConfig,
      exchanges: [],
      metadata: {
        startTime,
        characters: {},
        costs: {}
      }
    };

    // Setup character order
    const characterOrder = options.characterOrder || this.config.characterOrder;
    const rounds = options.rounds || this.config.exchangesPerCharacter;

    // Generate exchanges
    for (let round = 1; round <= rounds; round++) {
      this.emit('round:start', { round, total: rounds });

      for (const characterId of characterOrder) {
        const character = this.characterSystem.getCharacter(characterId);
        const model = modelConfig[characterId];

        if (!model) {
          throw new Error(`No model configured for character: ${characterId}`);
        }

        // Create prompt with full history
        const dialogueHistory = this._formatHistory(dialogue.exchanges);
        const prompt = this.characterSystem.createDialoguePrompt(
          characterId,
          topic,
          dialogueHistory
        );

        // Emit exchange start
        this.emit('exchange:start', {
          round,
          character: character.name,
          characterId,
          model
        });

        try {
          // Get response from model
          const response = await this.modelAdapter.call(model, prompt);

          // Validate response
          const validation = this.characterSystem.validateResponse(
            characterId,
            response.text
          );

          // Record exchange
          const exchange = {
            round,
            character: character.name,
            characterId,
            characterLevel: character.level,
            model,
            prompt,
            response: response.text,
            validation,
            usage: response.usage,
            timestamp: Date.now()
          };

          dialogue.exchanges.push(exchange);

          // Update metadata
          if (!dialogue.metadata.characters[characterId]) {
            dialogue.metadata.characters[characterId] = {
              name: character.name,
              level: character.level,
              model,
              exchanges: 0,
              tokens: 0
            };
          }
          dialogue.metadata.characters[characterId].exchanges++;
          dialogue.metadata.characters[characterId].tokens += response.usage.total_tokens;

          // Track costs
          const provider = this.modelAdapter.getProvider(model);
          if (!dialogue.metadata.costs[provider]) {
            dialogue.metadata.costs[provider] = 0;
          }
          // Cost calculation would go here with proper model config

          // Emit exchange complete
          this.emit('exchange:complete', {
            round,
            character: character.name,
            characterId,
            response: response.text,
            validation
          });

          // Delay between exchanges
          if (this.config.delayBetweenExchanges > 0) {
            await this.sleep(this.config.delayBetweenExchanges);
          }

        } catch (error) {
          this.emit('exchange:error', {
            round,
            character: character.name,
            characterId,
            model,
            error: error.message
          });
          throw error;
        }
      }

      this.emit('round:complete', { round, total: rounds });
    }

    // Finalize metadata
    dialogue.metadata.endTime = Date.now();
    dialogue.metadata.duration = dialogue.metadata.endTime - dialogue.metadata.startTime;
    dialogue.metadata.totalExchanges = dialogue.exchanges.length;

    // Emit completion
    this.emit('dialogue:complete', dialogue);

    return dialogue;
  }

  /**
   * Format dialogue history for prompts
   */
  _formatHistory(exchanges) {
    if (exchanges.length === 0) {
      return '(Starting the conversation)';
    }

    return exchanges
      .map(ex => `**${ex.character}:**\n${ex.response}`)
      .join('\n\n');
  }

  /**
   * Generate markdown output
   */
  formatAsMarkdown(dialogue) {
    const lines = [];

    // Header
    lines.push(`# Recursive Dialogue: ${dialogue.topic}`);
    lines.push('');
    lines.push('**Participants:**');
    
    Object.values(dialogue.metadata.characters).forEach(char => {
      lines.push(`- **${char.name}** (Level ${char.level}) - Model: \`${char.model}\``);
    });

    lines.push('');
    lines.push('---');
    lines.push('');

    // Exchanges
    dialogue.exchanges.forEach(ex => {
      lines.push(`**${ex.character}:**`);
      lines.push(ex.response);
      lines.push('');
    });

    // Footer
    lines.push('---');
    lines.push('');
    lines.push('## Metadata');
    lines.push('');
    lines.push(`**Topic:** ${dialogue.topic}`);
    lines.push(`**Total Exchanges:** ${dialogue.metadata.totalExchanges}`);
    lines.push(`**Duration:** ${(dialogue.metadata.duration / 1000).toFixed(2)}s`);
    lines.push('');
    lines.push('**Character Participation:**');
    Object.values(dialogue.metadata.characters).forEach(char => {
      lines.push(`- ${char.name}: ${char.exchanges} exchanges, ${char.tokens} tokens`);
    });

    return lines.join('\n');
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default DialogueEngine;

