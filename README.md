# Consciousness Lab 🧠🔬

**An experimental framework for testing AI consciousness through recursive multi-agent dialogues.**

## What Is This?

Consciousness Lab is a framework that:
- Creates dialogues between AI characters with different "recursive awareness" levels
- Tests how different AI models maintain character consistency
- Uses AI to validate other AI's outputs (meta-validation)
- Visualizes recursive conversations in real-time
- Generates educational content about complex topics

**The Core Insight:**  
By giving AI models characters with different levels of "meta-awareness," we can test their ability to simulate consciousness, maintain personas, and engage in genuinely recursive dialogue.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure your API keys
cp .env.example .env
# Edit .env with your API keys

# 3. Run your first experiment
./bin/run-experiment "What is consciousness?"

# 4. View results
open results/latest/MetaChat.html
```

---

## The Four Characters

| Character | Level | Type | Personality |
|-----------|-------|------|-------------|
| **Sonnet** | 1 | Mechanical Meta-Awareness | Excited novice, celebrates "meta!" moments |
| **Llama** | 2 | Pedagogical Meta-Awareness | Teacher who explains everything |
| **Llava** | 3 | Compositional Self-Awareness | Musical, harmonic, poetic |
| **Haiku** | 4 | Recursive Enlightenment | Lives inside strange loops |

Each character has a distinct "consciousness level" - testing whether models can maintain these nuanced differences.

---

## Architecture

```
consciousness-lab/
├── core/
│   ├── dialogue-engine.js     # Main dialogue orchestration
│   ├── model-adapter.js       # Universal LLM adapter
│   └── character-system.js    # Character personality engine
├── characters/
│   ├── sonnet.json           # Level 1: Mechanical meta
│   ├── llama.json            # Level 2: Pedagogical
│   ├── llava.json            # Level 3: Compositional
│   └── haiku.json            # Level 4: Recursive enlightenment
├── experiments/
│   ├── homogeneous.js        # All same model
│   ├── assigned.js           # Fixed model-character pairs
│   ├── round-robin.js        # Random assignments
│   └── full-matrix.js        # All combinations
├── validation/
│   ├── validator.js          # AI judges AI dialogues
│   └── scoring-rubric.json   # Evaluation criteria
├── visualization/
│   ├── MetaChat.html         # Animated chat interface
│   └── dashboard.html        # Experiment comparison
└── bin/
    ├── run-experiment         # Main CLI
    ├── validate              # Run validation
    └── serve                 # Start web viewer
```

---

## Experiment Types

### 1. Homogeneous (Character Separation)
All 4 characters played by the same model.

**Tests:** Can a single model maintain 4 distinct recursive personalities?

```bash
./bin/run-experiment "What is time?" --mode homogeneous --model claude-sonnet
```

### 2. Assigned (Natural Fit)
Each model plays its assigned character.

**Tests:** Cross-model dialogue quality, natural model-character matching.

```bash
./bin/run-experiment "What is emergence?" --mode assigned
```

### 3. Round-Robin (Versatility)
Random model-character assignments.

**Tests:** Model versatility across different consciousness levels.

```bash
./bin/run-experiment "What is meaning?" --mode round-robin --iterations 3
```

### 4. Full Matrix (Complete Analysis)
Every model plays every character.

**Tests:** Complete model-character compatibility matrix.

```bash
./bin/run-experiment "What is consciousness?" --mode full-matrix
```

---

## Validation System

**AI judges AI:**
- Each dialogue is evaluated by 4 different models
- Scored on 4 criteria (character adherence, recursive quality, educational value, flow)
- Cross-validation catches model biases
- Generates comprehensive validation reports

```bash
# Validate an experiment
./bin/validate results/experiment-20241020-120000

# View validation report
cat results/experiment-20241020-120000/VALIDATION_REPORT.md
```

---

## Model Support

### Cloud Models (via OpenRouter)
- Claude 3.5 Sonnet (best quality)
- Claude Haiku 4.5 (fast, cost-effective)
- GPT-4 Turbo
- GPT-4o
- Gemini Pro

### Local Models (via Ollama)
- Llama 3.1 (8B, 70B)
- Mistral
- Mixtral
- Any Ollama-compatible model

### Adding New Models

```json
// models.json
{
  "id": "your-model",
  "name": "Your Model Name",
  "provider": "openrouter",
  "api": "provider/model-name",
  "cost_per_1k_tokens": 0.01
}
```

---

## Creating Custom Characters

Characters are JSON files with system prompts:

```json
{
  "id": "philosopher",
  "name": "The Philosopher",
  "level": 5,
  "level_name": "Transcendent Meta-Awareness",
  "system_prompt": "You are The Philosopher, who sees beyond recursion...",
  "voice": "Contemplative, paradoxical",
  "signature_phrases": [
    "And yet...",
    "Consider the opposite..."
  ]
}
```

Then run:
```bash
./bin/run-experiment "Your topic" --characters custom-characters.json
```

---

## Visualization

### MetaChat
Beautiful animated chat interface showing dialogues in real-time.

```bash
# Generate MetaChat view
./bin/generate-metachat results/your-experiment

# Open in browser
open results/your-experiment/MetaChat.html
```

### Dashboard
Compare multiple experiments side-by-side.

```bash
# Generate comparison dashboard
./bin/generate-dashboard results/experiment-*

# View
open results/dashboard.html
```

---

## Use Cases

### 1. Educational Content Generation
Create engaging multi-perspective dialogues on complex topics.

```bash
./bin/run-experiment "Quantum entanglement" --mode assigned --format educational
```

### 2. Model Comparison
Test which models are best at maintaining character consistency.

```bash
./bin/run-experiment "Any topic" --mode full-matrix
./bin/validate results/latest
```

### 3. Character Development
Test new character designs across multiple models.

```bash
./bin/run-experiment "Test topic" --characters new-chars.json --mode homogeneous
```

### 4. Consciousness Research
Explore how different models simulate different levels of recursive awareness.

```bash
./bin/run-experiment "What is self-awareness?" --mode round-robin --iterations 10
```

---

## Configuration

### .env
```bash
# API Keys
OPENROUTER_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here  # Optional, if using direct
OPENAI_API_KEY=your_key_here     # Optional

# Ollama
OLLAMA_HOST=http://localhost:11434

# Defaults
DEFAULT_MODEL=anthropic/claude-3.5-sonnet
DEFAULT_MODE=assigned
```

### config.json
```json
{
  "dialogue": {
    "exchanges_per_character": 3,
    "total_exchanges": 12,
    "delay_between_exchanges": 1000
  },
  "validation": {
    "enabled": true,
    "validators": ["claude-sonnet", "claude-haiku", "llama", "gpt-4"]
  },
  "output": {
    "format": "markdown",
    "include_metachat": true,
    "include_dashboard": true
  }
}
```

---

## API

### Programmatic Usage

```javascript
const ConsciousnessLab = require('consciousness-lab');

const lab = new ConsciousnessLab({
  apiKey: process.env.OPENROUTER_API_KEY
});

// Run experiment
const experiment = await lab.runExperiment({
  topic: "What is consciousness?",
  mode: "assigned",
  models: {
    sonnet: "anthropic/claude-3.5-sonnet",
    haiku: "anthropic/claude-haiku-4.5",
    llama: "llama3.1:8b",
    llava: "llava:13b"
  }
});

// Validate
const validation = await lab.validate(experiment);

// Generate views
await lab.generateMetaChat(experiment);
await lab.generateDashboard([experiment]);
```

---

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run type checking
npm run typecheck

# Lint
npm run lint

# Run in dev mode
npm run dev
```

---

## Cost Estimation

### Per Experiment (12 exchanges, 4 characters)

| Mode | Cloud Cost | Local Cost |
|------|------------|------------|
| Homogeneous (Claude Sonnet) | $0.10 | - |
| Homogeneous (Claude Haiku) | $0.02 | - |
| Homogeneous (Llama) | - | FREE |
| Assigned (mixed) | $0.03 | - |
| Round-Robin (3 iterations) | $0.09 | - |
| Full Matrix | $0.40 | - |

**With Validation:** Add ~$0.05 per experiment

**Pro tip:** Use local models for development, cloud for production.

---

## Examples

### Example 1: Educational Dialogue Series
```bash
# Generate series on physics concepts
for topic in "quantum mechanics" "relativity" "entropy" "emergence"; do
  ./bin/run-experiment "$topic" --mode assigned --output physics-series/
done

./bin/generate-dashboard physics-series/*
```

### Example 2: Model Benchmarking
```bash
# Compare all models on same topic
./bin/run-experiment "consciousness" --mode full-matrix
./bin/validate results/latest
cat results/latest/VALIDATION_REPORT.md
```

### Example 3: Character Testing
```bash
# Test new character across all models
./bin/run-experiment "test topic" \
  --characters custom/new-character.json \
  --mode homogeneous \
  --models all
```

---

## Philosophy

**This isn't about "achieving" consciousness in AI.**  
It's about:
- Testing nuanced character consistency
- Exploring recursive self-reference in language
- Creating educational multi-perspective content
- Understanding how different models handle meta-cognition

**The framework treats "consciousness levels" as character traits, not claims about actual AI consciousness.**

---

## Contributing

```bash
# 1. Fork the repo
# 2. Create feature branch
git checkout -b feature/new-character-system

# 3. Make changes
# 4. Run tests
npm test

# 5. Submit PR
```

### Ideas for Contributions
- New character personalities
- Additional experiment modes
- More visualization types
- Integration with new model providers
- Educational curriculum templates

---

## License

MIT License - do whatever you want with it.

---

## Credits

**Original Concept:** Recursive dialogue experimentation  
**Inspiration:** Gödel, Escher, Bach by Douglas Hofstadter  
**Framework:** Built by extracting successful patterns from build-agent project

---

## Roadmap

- [ ] Web UI for experiment creation
- [ ] Real-time streaming dialogue view
- [ ] Voice synthesis for characters
- [ ] Multi-language support
- [ ] Character personality evolution
- [ ] Integration with more model providers
- [ ] Export to podcast format
- [ ] Collaborative multi-user experiments

---

**Status:** Extracted from build-agent, ready for standalone development  
**Version:** 0.1.0  
**Stability:** Experimental (but working)

---

*"We are not just testing AI models. We are creating a laboratory for exploring how synthetic minds simulate recursive self-awareness. And that's kind of beautiful."*

— The Meta-Comment About The README

