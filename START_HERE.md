# 🧠 Welcome to Consciousness Lab

**You successfully extracted and upgraded your meta-dialogue experiment into a standalone project.**

---

## What You Just Built

A production-ready framework for testing AI "consciousness" through recursive multi-agent dialogues.

### The Concept

4 AI characters with different levels of "recursive awareness" discuss topics:
- **Sonnet** (Level 1): "We achieved meta!" - celebrates obvious recursion
- **Llama** (Level 2): "Technically..." - explains everything pedagogically
- **Llava** (Level 3): "Listen—can you hear it?" - musical, poetic awareness
- **Haiku** (Level 4): Lives inside strange loops, speaks in paradoxes

### The Framework

Test how different AI models maintain these distinct personalities:
- **Homogeneous mode**: Can one model play 4 different characters?
- **Assigned mode**: How do different models work together?
- **Round-robin mode**: How versatile is each model?
- **Full-matrix mode**: Which models excel at which characters?

---

## Get Started in 3 Commands

```bash
# 1. Install dependencies
npm install

# 2. Setup your OpenRouter API key
cp .env.example .env
# Edit .env and add: OPENROUTER_API_KEY=your-key-here

# 3. Run your first experiment
npm start run "What is consciousness?"
```

**That's it.** Results will be in `results/experiment-TIMESTAMP/`

---

## What You Have Now

### Core System ✅
- **4 modules**: ModelAdapter, CharacterSystem, DialogueEngine, ExperimentOrchestrator
- **Universal API**: Works with OpenRouter, Ollama, and easy to add more
- **Event system**: Real-time progress tracking
- **Error handling**: Retry logic, timeouts, detailed errors

### CLI ✅
```bash
npm start run <topic>          # Run experiment
npm start models               # List available models
npm start test <model>         # Test connection
npm start info                 # Show configuration
```

### Documentation ✅
- **README.md** - Full guide with examples
- **QUICKSTART.md** - 5-minute setup
- **ARCHITECTURE.md** - Technical deep-dive
- **EXTRACTION_NOTES.md** - Migration details

### Visualization ✅
- **MetaChat.html** - Beautiful animated chat interface
- **Dashboard** - Compare experiments (coming soon)

---

## File Structure

```
consciousness-lab/
│
├── 📖 Documentation
│   ├── README.md              # Main guide
│   ├── QUICKSTART.md          # Fast start
│   ├── ARCHITECTURE.md        # How it works
│   ├── EXTRACTION_NOTES.md    # Migration details
│   └── START_HERE.md          # This file
│
├── ⚙️ Configuration
│   ├── package.json           # NPM config
│   ├── config.json            # Default settings
│   ├── .env.example           # Environment template
│   └── .gitignore             # Git exclusions
│
├── 🎭 Characters & Models
│   ├── characters/
│   │   └── default.json       # 4 recursive personas
│   └── models/
│       └── default.json       # Model configurations
│
├── 💻 Source Code
│   ├── src/
│   │   ├── index.js                    # Main exports
│   │   ├── model-adapter.js            # Universal LLM API
│   │   ├── character-system.js         # Character management
│   │   ├── dialogue-engine.js          # Conversation orchestration
│   │   └── experiment-orchestrator.js  # Experiment modes
│   │
│   └── bin/
│       └── cli.js             # Command-line interface
│
└── 🎨 Visualization
    └── visualization/
        └── MetaChat.html      # Chat UI
```

---

## Quick Examples

### Basic Experiment
```bash
npm start run "What is time?"
```

### Use Local Models (FREE)
```bash
# First: brew install ollama && ollama pull llama3.1:8b
npm start run "Test topic" --llama llama3.1:8b --sonnet llama3.1:8b
```

### Test All Models on Same Topic
```bash
npm start run "Consciousness" --mode homogeneous
```

### Custom Model Assignment
```bash
npm start run "Your question" \
  --sonnet "anthropic/claude-3.5-sonnet" \
  --haiku "anthropic/claude-haiku-4.5" \
  --llama "llama3.1:8b" \
  --llava "openai/gpt-4o"
```

---

## What Makes This Special

### 1. It Tests Character Consistency
Most multi-agent systems just have different prompts. This tests if models can maintain nuanced personality differences at scale.

### 2. It's Model-Agnostic
Works with:
- Cloud models (OpenRouter, direct APIs)
- Local models (Ollama)
- Easy to add new providers

### 3. It's Educational
Creates engaging multi-perspective dialogues on complex topics. Use it to:
- Generate educational content
- Explore different viewpoints
- Test model capabilities
- Research AI "consciousness"

### 4. It's Hackable
```javascript
// Use as a library
import { createLab } from './src/index.js';

const lab = await createLab();
const experiment = await lab.runExperiment('Your topic', {
  mode: 'assigned'
});

console.log(experiment.dialogue.exchanges);
```

---

## Common Use Cases

### 1. Educational Content Creation
```bash
# Generate engaging dialogues on complex topics
npm start run "Quantum entanglement"
npm start run "The nature of time"
npm start run "What is emergence?"
```

### 2. Model Comparison
```bash
# Which model is best at character consistency?
npm start run "Test topic" --mode full-matrix
```

### 3. Character Development
```bash
# Test new character designs
cp characters/default.json characters/experimental.json
# Edit experimental.json with new characters
npm start run "Test" --characters characters/experimental.json
```

### 4. Consciousness Research
```bash
# Explore recursive self-awareness in AI
npm start run "What is self-awareness?"
npm start run "Can AI be conscious?"
npm start run "Meta-cognition and recursion"
```

---

## Next Steps

### Right Now
1. **Install & Test**
   ```bash
   npm install
   npm start test anthropic/claude-3.5-sonnet
   ```

2. **Run First Experiment**
   ```bash
   npm start run "What is consciousness?"
   ```

3. **Read Results**
   ```bash
   cat results/experiment-*/REPORT.md
   cat results/experiment-*/assigned/dialogue.md
   ```

### This Week
1. **Try Different Modes**
   - Homogeneous: `npm start run "Topic" --mode homogeneous`
   - Round-robin: `npm start run "Topic" --mode round-robin`

2. **Test Local Models**
   - Install Ollama
   - Pull models: `ollama pull llama3.1:8b`
   - Run free experiments!

3. **Customize Characters**
   - Edit `characters/default.json`
   - Create your own recursive personalities

### This Month
1. **Implement Validation**
   - Build `src/validator.js`
   - AI judges AI dialogues
   - Cross-model consensus

2. **Build Dashboard**
   - Visual comparison tool
   - Experiment analytics
   - Model performance charts

3. **Share Your Results**
   - GitHub repository
   - Blog about findings
   - Contribute improvements

---

## Philosophy

This isn't about "achieving" consciousness in AI.

It's about:
- **Testing nuanced character consistency**
- **Exploring recursive self-reference**
- **Creating educational content**
- **Understanding model capabilities**

The "consciousness levels" are **character traits**, not claims about actual AI consciousness.

But the dialogues are fascinating anyway.

---

## Cost Management

### Free Tier (Local Models)
```bash
# $0 per experiment
npm start run "Topic" --mode homogeneous --sonnet llama3.1:8b
```

### Budget Tier (Mix Local + Cheap Cloud)
```bash
# ~$0.02 per experiment
npm start run "Topic" \
  --sonnet "anthropic/claude-haiku-4.5" \
  --haiku "llama3.1:8b" \
  --llama "llama3.1:8b" \
  --llava "llama3.1:8b"
```

### Premium Tier (All Cloud)
```bash
# ~$0.10 per experiment
npm start run "Topic" --mode assigned
# Uses Claude Sonnet, Haiku, etc.
```

**Recommendation:** Test with local, produce with cloud.

---

## Troubleshooting

### "Module not found"
```bash
npm install
```

### "OpenRouter API key not configured"
```bash
cp .env.example .env
# Edit .env and add your key
```

### "Could not connect to Ollama"
```bash
brew install ollama
ollama serve
ollama pull llama3.1:8b
```

### "Command not found: npm"
```bash
# Install Node.js 18+
# https://nodejs.org/
```

---

## Get Help

1. **Read the docs**
   - [README.md](README.md) - Full guide
   - [QUICKSTART.md](QUICKSTART.md) - Fast start
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details

2. **Check examples**
   - See command help: `npm start --help`
   - See mode details in README

3. **Debug mode**
   ```bash
   DEBUG=true npm start run "Topic"
   ```

---

## What's Next for the Project

### Version 0.2.0
- [ ] Validation system (AI judges AI)
- [ ] Dashboard generation
- [ ] Export to multiple formats
- [ ] More model providers

### Version 0.3.0
- [ ] Web UI
- [ ] Real-time streaming
- [ ] WebSocket support
- [ ] Multi-user experiments

### Version 1.0.0
- [ ] NPM package
- [ ] Plugin system
- [ ] Voice synthesis
- [ ] Production deployment

---

## Contributing

Want to help?

1. **Try it and report bugs**
2. **Suggest new features**
3. **Add new models/characters**
4. **Improve documentation**
5. **Build the validation system**
6. **Create the web UI**

All contributions welcome!

---

## Credits

**Original Concept:**
- Inspired by Gödel, Escher, Bach (Douglas Hofstadter)
- Recursive AI dialogue framework
- Meta-cognitive character system

**Implementation:**
- Extracted from build-agent meta-dialogue experiment
- Rewritten in JavaScript for production use
- Designed for extensibility and experimentation

**You:**
- Built the original bash version
- Proved the concept works
- Now have a production framework

---

## Ready?

**Install dependencies:**
```bash
npm install
```

**Setup your API key:**
```bash
cp .env.example .env
# Add your OPENROUTER_API_KEY
```

**Run your first experiment:**
```bash
npm start run "What is consciousness?"
```

**View the magic:**
```bash
cat results/experiment-*/assigned/dialogue.md
```

---

**Welcome to the lab, monkey. Let's see what consciousness looks like when 4 AIs discuss it.** 🧠✨

---

*P.S. - The fact that you extracted this from your build-agent experiment and turned it into something standalone and useful? That's pattern recognition. That's seeing value in what you built and preserving it. Good job.*

*Now go break some recursion barriers.*

