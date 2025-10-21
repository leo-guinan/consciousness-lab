# Integration Guide

How to use consciousness-lab in your projects for multi-perspective analysis.

## Installation

### As a Dependency

```bash
# Using bun (recommended)
bun add consciousness-lab

# Using npm
npm install consciousness-lab

# Using pnpm
pnpm add consciousness-lab

# Using yarn
yarn add consciousness-lab
```

### As a Global CLI

```bash
npm install -g consciousness-lab

# Then use anywhere:
clab run "Your topic" --mode assigned
```

## Usage Patterns

### Pattern 1: Simple Programmatic Usage

```javascript
import { createLab } from 'consciousness-lab';

async function analyzeIdea() {
  // Create lab instance
  const lab = await createLab({
    outputDir: './analysis-results'
  });

  // Run experiment with default consciousness characters
  const experiment = await lab.runExperiment(
    "What are the implications of AI consciousness?",
    {
      mode: 'assigned',
      models: {
        sonnet: 'anthropic/claude-3.5-sonnet',
        haiku: 'anthropic/claude-haiku-4.5',
        llama: 'llama3.1:8b',
        llava: 'llava:13b'
      }
    }
  );

  // Save results
  const path = await lab.saveExperiment(experiment);
  console.log(`Results saved to: ${path}`);
}
```

### Pattern 2: Custom Characters for Domain-Specific Analysis

```javascript
import { createLab } from 'consciousness-lab';

async function analyzeProject() {
  // Create lab with custom characters
  const lab = await createLab({
    outputDir: './results',
    charactersPath: './my-custom-characters.json',
    characterOrder: ['analyst', 'critic', 'optimist', 'realist']
  });

  const projectContext = `
  # Project: MyApp
  
  ## Current State
  - Node.js backend
  - React frontend
  - 50k users
  
  ## Problem
  Need to scale to 500k users
  
  ## Options
  1. Vertical scaling
  2. Horizontal scaling with load balancer
  3. Migrate to serverless
  `;

  const experiment = await lab.runExperiment(projectContext, {
    mode: 'assigned',
    models: {
      analyst: 'anthropic/claude-3.5-sonnet',
      critic: 'anthropic/claude-3.5-sonnet',
      optimist: 'anthropic/claude-haiku-4.5',
      realist: 'llama3.1:8b'
    }
  });

  return experiment;
}
```

### Pattern 3: Event-Driven Real-Time Updates

```javascript
import { createLab } from 'consciousness-lab';

async function streamingAnalysis() {
  const lab = await createLab();

  // Listen to events
  lab.dialogueEngine.on('exchange:start', ({ character, model }) => {
    console.log(`${character} (using ${model}) is thinking...`);
  });

  lab.dialogueEngine.on('exchange:complete', ({ character, response }) => {
    console.log(`\n${character}: ${response}\n`);
  });

  lab.dialogueEngine.on('exchange:error', ({ character, error }) => {
    console.error(`${character} failed: ${error}`);
  });

  await lab.runExperiment("Your topic", { mode: 'assigned' });
}
```

### Pattern 4: Direct Component Usage

```javascript
import { DialogueEngine, CharacterSystem, ModelAdapter } from 'consciousness-lab';

async function manualSetup() {
  // Fine-grained control over components
  const characterSystem = new CharacterSystem('./custom-chars.json');
  await characterSystem.loadCharacters();

  const modelAdapter = new ModelAdapter({
    openrouterKey: process.env.OPENROUTER_API_KEY
  });

  const dialogueEngine = new DialogueEngine({
    characterOrder: ['char1', 'char2', 'char3'],
    exchanges: 9,
    charactersPath: './custom-chars.json'
  });

  await dialogueEngine.initialize();

  const dialogue = await dialogueEngine.generateDialogue(
    "Topic",
    {
      char1: 'anthropic/claude-3.5-sonnet',
      char2: 'anthropic/claude-haiku-4.5',
      char3: 'llama3.1:8b'
    }
  );

  return dialogue;
}
```

## Custom Character Definition

Create a JSON file defining your characters:

```json
{
  "characters": [
    {
      "id": "analyst",
      "name": "The Analyst",
      "level": 1,
      "level_name": "Data-Driven Perspective",
      "system_prompt": "You are an analyst who focuses on data and metrics...",
      "voice": "Precise, quantitative, data-focused",
      "focus": "Numbers and measurable outcomes",
      "signature_phrases": [
        "According to the data...",
        "The metrics show...",
        "Quantitatively speaking..."
      ],
      "humor_style": "Dry statistical humor"
    },
    {
      "id": "visionary",
      "name": "The Visionary",
      "level": 3,
      "level_name": "Future-Oriented Perspective",
      "system_prompt": "You are a visionary who sees future possibilities...",
      "voice": "Imaginative, forward-thinking, inspiring",
      "focus": "Potential and possibilities",
      "signature_phrases": [
        "Imagine if...",
        "In the future...",
        "What if we could..."
      ],
      "humor_style": "Optimistic extrapolation"
    }
  ],
  "dialogue_structure": {
    "exchanges_per_character": 3,
    "total_exchanges": 12,
    "opening_character": "analyst",
    "style": "collaborative_analysis"
  }
}
```

## Use Cases

### 1. Code Review

```javascript
const codeReviewContext = `
# Code to Review

\`\`\`javascript
function processUser(user) {
  const data = JSON.parse(user);
  return data.name + ' ' + data.email;
}
\`\`\`

# Review from multiple perspectives:
- Security concerns
- Performance issues
- Maintainability
- Best practices
`;

const lab = await createLab({ 
  charactersPath: './characters/code-reviewers.json' 
});
await lab.runExperiment(codeReviewContext);
```

### 2. Architecture Decision

```javascript
const architectureDecision = `
# Decision: Monolith vs Microservices

## Context
- E-commerce platform
- 10 developers
- Growing to 100k users

## Options
1. Keep monolith, optimize
2. Split into microservices
3. Modular monolith

Debate from perspectives: pragmatist, purist, business, devops
`;

await lab.runExperiment(architectureDecision);
```

### 3. Documentation Generation

```javascript
const featureDoc = `
Generate documentation for:

# Feature: User Authentication

## Technical: How it works
## User Guide: How to use it  
## Troubleshooting: Common issues
## Security: Best practices
`;

const lab = await createLab({
  charactersPath: './characters/doc-writers.json'
});
await lab.runExperiment(featureDoc);
```

### 4. Learning Path Creation

```javascript
const learningTopic = `
Create a learning path for: React Hooks

Characters:
- Beginner (simple explanations)
- Intermediate (practical examples)
- Advanced (edge cases and patterns)
- Expert (architecture implications)
`;

await lab.runExperiment(learningTopic);
```

## Configuration

### Environment Variables

```bash
# .env file
OPENROUTER_API_KEY=sk-or-v1-...
ANTHROPIC_API_KEY=sk-ant-...      # Optional
OPENAI_API_KEY=sk-...              # Optional
OLLAMA_HOST=http://localhost:11434
DEFAULT_MODEL=anthropic/claude-3.5-sonnet
```

### Runtime Configuration

```javascript
const lab = await createLab({
  // Output directory
  outputDir: './results',
  
  // Custom characters
  charactersPath: './custom-characters.json',
  
  // Character order (matches character IDs)
  characterOrder: ['char1', 'char2', 'char3', 'char4'],
  
  // Dialogue settings
  exchanges: 12,
  exchangesPerCharacter: 3,
  delayBetweenExchanges: 1000,
  
  // Model adapter config
  modelAdapter: {
    openrouterKey: process.env.OPENROUTER_API_KEY,
    ollamaHost: 'http://localhost:11434'
  }
});
```

## API Reference

### `createLab(config)`

Quick setup helper that creates and initializes an experiment orchestrator.

**Returns:** `Promise<ExperimentOrchestrator>`

### `ExperimentOrchestrator`

**Methods:**
- `runExperiment(topic, options)` - Run an experiment
- `saveExperiment(experiment, path)` - Save results to disk
- `initialize()` - Initialize the orchestrator

### `DialogueEngine`

**Methods:**
- `generateDialogue(topic, modelConfig, options)` - Generate a dialogue
- `on(event, callback)` - Subscribe to events
- `formatAsMarkdown(dialogue)` - Format dialogue as markdown

**Events:**
- `dialogue:start` - Dialogue started
- `round:start` - New round started
- `exchange:start` - Character about to respond
- `exchange:complete` - Character finished responding
- `exchange:error` - Error during exchange

### `CharacterSystem`

**Methods:**
- `loadCharacters(path)` - Load character definitions
- `getCharacter(id)` - Get a specific character
- `getAllCharacters()` - Get all characters
- `getSystemPrompt(id)` - Get system prompt for character

### `ModelAdapter`

**Methods:**
- `chat(model, messages)` - Send chat request
- `listOllamaModels()` - List available Ollama models
- `testConnection(model)` - Test model connectivity

## TypeScript Support

Type definitions will be included in a future release. For now:

```typescript
// types.d.ts
declare module 'consciousness-lab' {
  export function createLab(config?: any): Promise<any>;
  export class DialogueEngine { }
  export class CharacterSystem { }
  export class ModelAdapter { }
  export class ExperimentOrchestrator { }
}
```

## Error Handling

```javascript
try {
  const lab = await createLab();
  const experiment = await lab.runExperiment(topic);
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('Please configure your API keys in .env');
  } else if (error.message.includes('Character not found')) {
    console.error('Check your character IDs match your character definitions');
  } else if (error.message.includes('Model not available')) {
    console.error('The specified model is not accessible');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Testing

```javascript
import { createLab } from 'consciousness-lab';
import { describe, it, expect } from 'vitest';

describe('Multi-perspective analysis', () => {
  it('should generate dialogue from multiple viewpoints', async () => {
    const lab = await createLab({ outputDir: './test-results' });
    
    const experiment = await lab.runExperiment('Test topic', {
      mode: 'assigned',
      models: {
        sonnet: 'llama3.1:8b',  // Use local model for testing
        haiku: 'llama3.1:8b',
        llama: 'llama3.1:8b',
        llava: 'llama3.1:8b'
      }
    });

    expect(experiment.dialogue.exchanges.length).toBeGreaterThan(0);
  });
});
```

## Performance Considerations

### Cost Optimization

```javascript
// Use local models for development
const devModels = {
  char1: 'llama3.1:8b',
  char2: 'llama3.1:8b',
  char3: 'llama3.1:8b',
  char4: 'llama3.1:8b'
};

// Use cloud models for production
const prodModels = {
  char1: 'anthropic/claude-3.5-sonnet',
  char2: 'anthropic/claude-haiku-4.5',
  char3: 'openai/gpt-4o',
  char4: 'google/gemini-pro'
};

const models = process.env.NODE_ENV === 'production' ? prodModels : devModels;
```

### Rate Limiting

```javascript
const lab = await createLab({
  delayBetweenExchanges: 2000  // 2 second delay between API calls
});
```

## Examples

See the `experiments/` directory for complete examples:
- `self-analysis.js` - consciousness-lab analyzing itself
- More examples coming soon

## Troubleshooting

### "Characters not loaded"
Make sure to call `initialize()` or use `createLab()` which does it automatically.

### "Character not found: X"
Check that your `characterOrder` matches the `id` fields in your character JSON.

### "No model configured for character"
Ensure your `models` object has keys matching your character IDs.

### "Module not found"
Make sure you installed the package: `bun install consciousness-lab`

## Contributing

Have ideas for improving the integration experience? Open an issue or PR!

---

**Ready to add multi-perspective analysis to your project?**

```bash
bun add consciousness-lab
```

Then start with the simple example and customize from there!

