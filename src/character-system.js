/**
 * Character System
 * Manages character personalities, prompts, and consistency
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

export class CharacterSystem {
  constructor(charactersPath = null) {
    this.charactersPath = charactersPath;
    this.characters = null;
  }

  /**
   * Load characters from JSON file
   */
  async loadCharacters(path = null) {
    const filePath = path || this.charactersPath || join(process.cwd(), 'characters', 'default.json');
    
    try {
      const data = await readFile(filePath, 'utf-8');
      const config = JSON.parse(data);
      this.characters = config.characters;
      return this.characters;
    } catch (error) {
      throw new Error(`Failed to load characters from ${filePath}: ${error.message}`);
    }
  }

  /**
   * Get character by ID
   */
  getCharacter(id) {
    if (!this.characters) {
      throw new Error('Characters not loaded. Call loadCharacters() first.');
    }

    const character = this.characters.find(c => c.id === id);
    if (!character) {
      throw new Error(`Character not found: ${id}`);
    }

    return character;
  }

  /**
   * Get all characters
   */
  getAllCharacters() {
    if (!this.characters) {
      throw new Error('Characters not loaded. Call loadCharacters() first.');
    }

    return this.characters;
  }

  /**
   * Generate system prompt for a character
   */
  getSystemPrompt(characterId) {
    const character = this.getCharacter(characterId);
    return character.system_prompt;
  }

  /**
   * Create dialogue prompt for a character
   */
  createDialoguePrompt(characterId, topic, dialogueHistory = '') {
    const character = this.getCharacter(characterId);
    
    const prompt = `${character.system_prompt}

# Topic: ${topic}

# Dialogue So Far:
${dialogueHistory || '(Starting the conversation)'}

# Your turn:
Respond as ${character.name}. Stay in character. Keep it to 2-4 sentences (or a haiku if you're Haiku). Be true to your recursive awareness level (Level ${character.level}: ${character.level_name}).`;

    return prompt;
  }

  /**
   * Validate character response
   */
  validateResponse(characterId, response) {
    const character = this.getCharacter(characterId);
    
    // Basic validation
    const issues = [];

    // Length check
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 6) {
      issues.push('Response too long (should be 2-4 sentences)');
    }

    // Signature phrase check (warning, not error)
    const hasSignature = character.signature_phrases.some(phrase => 
      response.toLowerCase().includes(phrase.toLowerCase())
    );

    return {
      valid: issues.length === 0,
      issues,
      warnings: hasSignature ? [] : ['No signature phrase detected'],
      character: character.name,
      level: character.level
    };
  }

  /**
   * Get character metadata
   */
  getCharacterMetadata(characterId) {
    const character = this.getCharacter(characterId);
    
    return {
      id: character.id,
      name: character.name,
      level: character.level,
      levelName: character.level_name,
      voice: character.voice,
      focus: character.focus,
      signaturePhrases: character.signature_phrases,
      humorStyle: character.humor_style
    };
  }

  /**
   * Get characters sorted by recursive level
   */
  getCharactersByLevel() {
    if (!this.characters) {
      throw new Error('Characters not loaded. Call loadCharacters() first.');
    }

    return [...this.characters].sort((a, b) => a.level - b.level);
  }

  /**
   * Create character comparison matrix
   */
  createComparisonMatrix() {
    const chars = this.getAllCharacters();
    
    return chars.map(char => ({
      id: char.id,
      name: char.name,
      level: char.level,
      levelName: char.level_name,
      voice: char.voice,
      signatures: char.signature_phrases.join(', ')
    }));
  }
}

export default CharacterSystem;

