# Architecture Overview 🏗️

**How Consciousness Lab works under the hood.**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLI Layer                          │
│  (bin/cli.js - User commands & orchestration)           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Experiment Orchestrator                     │
│  (src/experiment-orchestrator.js)                       │
│  - Manages experiment modes                             │
│  - Coordinates dialogue generation                      │
│  - Handles result saving & reporting                    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│               Dialogue Engine                            │
│  (src/dialogue-engine.js)                               │
│  - Multi-agent conversation orchestration               │
│  - Turn management & history                            │
│  - Event system for progress tracking                   │
└────┬──────────────────────┬─────────────────────────────┘
     │                      │
     ▼                      ▼
┌─────────────────┐    ┌──────────────────┐
│ Character System│    │  Model Adapter   │
│  (character-    │    │  (model-         │
│   system.js)    │    │   adapter.js)    │
│                 │    │                  │
│ - Personalities │    │ - OpenRouter     │
│ - Prompts       │    │ - Ollama         │
│ - Validation    │    │ - Direct APIs    │
└─────────────────┘    └──────────────────┘
     │                      │
     ▼                      ▼
┌──────────────────────────────────────┐
│     Configuration Files               │
│  - characters/default.json            │
│  - models/default.json                │
│  - config.json                        │
└──────────────────────────────────────┘
```

---

## Core Components

### 1. Model Adapter (`src/model-adapter.js`)

**Purpose:** Universal interface for LLM providers.

**Responsibilities:**
- Route requests to correct provider (OpenRouter, Ollama, direct)
- Handle retries and timeouts
- Normalize responses
- Estimate costs

**Key Methods:**
```javascript
call(modelString, prompt, options)  // Main interface
testConnection(modelString)         // Test if model is available
estimateCost(...)                   // Calculate usage cost
```

**Supports:**
- **OpenRouter**: Cloud models via single API
- **Ollama**: Local models
- **Direct**: Anthropic, OpenAI (future)

---

### 2. Character System (`src/character-system.js`)

**Purpose:** Manage character personalities and consistency.

**Responsibilities:**
- Load character definitions from JSON
- Generate character-specific prompts
- Validate responses match character traits
- Track character metadata

**Key Methods:**
```javascript
loadCharacters(path)                        // Load from file
getCharacter(id)                            // Get specific character
createDialoguePrompt(id, topic, history)   // Generate prompt
validateResponse(id, response)              // Check consistency
```

**Character Structure:**
```json
{
  "id": "sonnet",
  "name": "Sonnet",
  "level": 1,
  "level_name": "Mechanical Meta-Awareness",
  "system_prompt": "...",
  "voice": "Earnest, over-literal",
  "signature_phrases": ["We achieved meta!", ...]
}
```

---

### 3. Dialogue Engine (`src/dialogue-engine.js`)

**Purpose:** Orchestrate multi-agent conversations.

**Responsibilities:**
- Manage turn order
- Track dialogue history
- Call models via adapter
- Emit progress events
- Format output

**Key Methods:**
```javascript
initialize()                              // Setup
generateDialogue(topic, modelConfig)      // Main generation
formatAsMarkdown(dialogue)                // Export results
on(event, callback)                       // Event listeners
```

**Event System:**
```javascript
'dialogue:start'      // Experiment begins
'round:start'         // New round of exchanges
'exchange:start'      // Character about to speak
'exchange:complete'   // Character finished
'exchange:error'      // Character failed
'round:complete'      // Round finished
'dialogue:complete'   // Experiment done
```

**Dialogue Flow:**
1. Load characters
2. For each round (default 3):
   - For each character in order:
     - Build prompt with full history
     - Call model via adapter
     - Validate response
     - Add to history
     - Emit events
3. Return complete dialogue

---

### 4. Experiment Orchestrator (`src/experiment-orchestrator.js`)

**Purpose:** Manage different experiment types.

**Responsibilities:**
- Run homogeneous experiments
- Run assigned experiments
- Run round-robin experiments
- Run full-matrix experiments
- Save results to disk
- Generate reports

**Experiment Modes:**

**Homogeneous:**
```javascript
// All 4 characters = same model
// Tests: Character separation ability
{
  sonnet: "claude-sonnet",
  haiku: "claude-sonnet",
  llama: "claude-sonnet",
  llava: "claude-sonnet"
}
```

**Assigned:**
```javascript
// Each character = specific model
// Tests: Cross-model dialogue quality
{
  sonnet: "claude-sonnet",
  haiku: "claude-haiku",
  llama: "llama3.1:8b",
  llava: "llava:13b"
}
```

**Round-Robin:**
```javascript
// Random assignments (multiple iterations)
// Tests: Model versatility
// Iteration 1: Shuffle models
// Iteration 2: Different shuffle
// Iteration 3: Different shuffle
```

**Full-Matrix:**
```javascript
// Every model plays every character
// Tests: Complete compatibility matrix
// Total dialogues: num_models × num_characters
```

---

## Data Flow

### Typical Experiment Flow

```
User Command
    │
    ▼
CLI parses arguments
    │
    ▼
ExperimentOrchestrator.runExperiment()
    │
    ▼
DialogueEngine.generateDialogue()
    │
    ├─► CharacterSystem.createDialoguePrompt()
    │       │
    │       ▼
    │   Returns prompt with character personality
    │
    ├─► ModelAdapter.call()
    │       │
    │       ├─► OpenRouter API (cloud)
    │       └─► Ollama API (local)
    │       │
    │       ▼
    │   Returns response
    │
    └─► CharacterSystem.validateResponse()
            │
            ▼
        Check consistency
            │
            ▼
    Add to dialogue history
            │
            ▼
    Repeat for all exchanges
            │
            ▼
Return complete dialogue
    │
    ▼
ExperimentOrchestrator.saveExperiment()
    │
    ├─► Save config.json
    ├─► Save dialogue.md files
    └─► Generate REPORT.md
```

---

## File Structure

### Configuration Files

**`characters/default.json`**
- Character personality definitions
- System prompts
- Signature phrases
- Recursive awareness levels

**`models/default.json`**
- Available models
- Provider information
- Cost estimates
- Default assignments

**`config.json`**
- Experiment settings
- Validation criteria
- Output preferences
- Visualization options

### Output Structure

```
results/experiment-TIMESTAMP/
├── config.json                    # Experiment configuration
├── REPORT.md                      # Human-readable report
├── assigned/                      # Assigned mode results
│   └── dialogue.md
├── homogeneous/                   # Homogeneous mode results
│   ├── all-claude-sonnet/
│   │   └── dialogue.md
│   └── all-llama/
│       └── dialogue.md
└── round-robin/                   # Round-robin results
    ├── iteration-1/
    │   └── dialogue.md
    └── iteration-2/
        └── dialogue.md
```

---

## Extension Points

### Adding New Models

1. Add to `models/default.json`:
```json
{
  "id": "new-model",
  "name": "New Model",
  "api": "provider/model-name",
  "provider": "openrouter",
  "cost_per_1k_tokens": 0.01
}
```

2. Use in experiments:
```bash
npm start run "topic" --sonnet provider/model-name
```

### Adding New Characters

1. Add to `characters/default.json`:
```json
{
  "id": "new-char",
  "name": "New Character",
  "level": 5,
  "level_name": "Description",
  "system_prompt": "Full personality prompt...",
  "voice": "Character voice",
  "signature_phrases": ["phrase1", "phrase2"]
}
```

2. Update character order in config if needed.

### Adding New Experiment Modes

1. Add method to `ExperimentOrchestrator`:
```javascript
async runNewMode(topic, modelConfig, options) {
  // Your experiment logic
  return results;
}
```

2. Add to `runExperiment()` switch statement.

3. Add save logic:
```javascript
async saveNewModeResults(experiment, basePath) {
  // Save format
}
```

### Adding Validation

**Future feature:** AI judges AI dialogues.

```javascript
// validation/validator.js
class DialogueValidator {
  async validateDialogue(dialogue, validators) {
    // Rate on 4 criteria
    // Use multiple models for consensus
    // Generate validation report
  }
}
```

---

## Performance Considerations

### Rate Limiting
- Built-in retry logic (3 attempts)
- Exponential backoff
- Configurable delays between exchanges

### Cost Optimization
- Local models are free
- Estimate costs before running
- Use cheaper models for testing

### Parallelization
- **Current:** Sequential exchanges
- **Future:** Parallel validation
- **Future:** Batch mode for multiple experiments

---

## Testing Strategy

### Unit Tests
```javascript
// Test each component independently
test('ModelAdapter calls OpenRouter correctly')
test('CharacterSystem loads characters')
test('DialogueEngine manages turns')
```

### Integration Tests
```javascript
// Test full workflows
test('Complete experiment runs successfully')
test('Results save correctly')
test('Events emit in correct order')
```

### E2E Tests
```bash
# Test actual API calls (with mocks)
npm test -- --run e2e
```

---

## Security

### API Keys
- Stored in `.env` (git-ignored)
- Never logged or saved to disk
- Environment variable fallbacks

### User Content
- All dialogues saved locally
- No telemetry or tracking
- Full data ownership

---

## Future Architecture

### Planned Features

**1. Web UI**
```
consciousness-lab-ui/
├── React frontend
├── WebSocket server
└── Real-time dialogue streaming
```

**2. Validation System**
```javascript
validation/
├── validator.js        // AI judges
├── scoring.js          // Rubric system
└── consensus.js        // Cross-model agreement
```

**3. Plugin System**
```javascript
plugins/
├── custom-characters/
├── custom-validators/
└── custom-exporters/
```

---

## Dependencies

### Production
- `axios`: HTTP requests
- `commander`: CLI
- `chalk`: Terminal colors
- `ora`: Spinners
- `dotenv`: Environment variables

### Development
- `vitest`: Testing
- `eslint`: Linting
- `typescript`: Type checking (optional)

---

## Design Principles

1. **Modularity**: Each component has single responsibility
2. **Extensibility**: Easy to add models, characters, modes
3. **Transparency**: Events and logs for full visibility
4. **Simplicity**: Clean APIs, clear naming
5. **Flexibility**: Works with any LLM provider

---

**This architecture enables experimentation with AI consciousness while remaining simple enough to understand and extend.**

