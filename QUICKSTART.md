# Quick Start Guide 🚀

Get up and running with Consciousness Lab in 5 minutes.

## Step 1: Install

```bash
cd consciousness-lab
npm install
```

## Step 2: Configure API Keys

```bash
# Copy example env
cp .env.example .env

# Edit .env and add your OpenRouter key
# Get one free at: https://openrouter.ai/
```

Your `.env` should look like:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

## Step 3: Test Connection

```bash
# Test cloud model
npm start test anthropic/claude-3.5-sonnet

# Test local model (if you have Ollama running)
npm start test llama3.1:8b
```

## Step 4: Run Your First Experiment

```bash
# Run a simple assigned experiment
npm start run "What is consciousness?"
```

This will:
- Create a dialogue between 4 AI characters
- Each character has a different "consciousness level"
- Save results to `results/experiment-TIMESTAMP/`

## Step 5: View Results

```bash
# Read the report
cat results/experiment-*/REPORT.md

# View the dialogue
cat results/experiment-*/assigned/dialogue.md

# Open MetaChat visualization
open visualization/MetaChat.html
# Then paste in a dialogue
```

---

## Try Different Modes

### Homogeneous (Character Separation Test)
All characters played by same model - tests if it can maintain 4 distinct personalities:

```bash
npm start run "What is time?" --mode homogeneous
```

### Assigned (Cross-Model Quality)
Each model plays its assigned character:

```bash
npm start run "What is emergence?" --mode assigned
```

### Round-Robin (Model Versatility)
Random model-character assignments:

```bash
npm start run "What is meaning?" --mode round-robin --iterations 3
```

---

## Using Local Models (FREE)

1. **Install Ollama**: https://ollama.ai

2. **Pull models**:
```bash
ollama pull llama3.1:8b
ollama pull llava:13b
```

3. **Run experiment with local models**:
```bash
npm start run "Test topic" \
  --sonnet llama3.1:8b \
  --haiku llama3.1:8b \
  --llama llama3.1:8b \
  --llava llava:13b
```

**Cost: $0.00** 🎉

---

## Next Steps

### Validate Your Experiments
```bash
# Coming soon
npm start validate results/experiment-TIMESTAMP
```

### Generate Comparison Dashboard
```bash
# Coming soon
npm start dashboard results/experiment-*
```

### Customize Characters
Edit `characters/default.json` to create your own character personalities.

### Add New Models
Edit `models/default.json` to add new AI models.

---

## Common Issues

### "OpenRouter API key not configured"
- Make sure `.env` file exists with `OPENROUTER_API_KEY=your-key`

### "Could not connect to Ollama"
- Make sure Ollama is running: `ollama serve`
- Check it's on port 11434: `curl http://localhost:11434`

### "Module not found" errors
- Run `npm install` again
- Make sure you're in the `consciousness-lab` directory

---

## Examples

### Educational Series
```bash
# Generate dialogues on multiple topics
for topic in "quantum mechanics" "emergence" "consciousness"; do
  npm start run "$topic" --mode assigned
done
```

### Model Comparison
```bash
# Test all models on same topic
npm start run "AI consciousness" --mode homogeneous
```

### Custom Model Setup
```bash
npm start run "Philosophy of mind" \
  --sonnet "anthropic/claude-3.5-sonnet" \
  --haiku "anthropic/claude-haiku-4.5" \
  --llama "llama3.1:8b" \
  --llava "openai/gpt-4o"
```

---

## CLI Reference

```bash
# Run experiment
npm start run <topic> [options]

# List available models
npm start models

# Test model connection
npm start test <model>

# Show configuration
npm start info

# Get help
npm start --help
```

---

## Cost Estimates

### Cloud Models (via OpenRouter)
- Claude Sonnet: ~$0.10 per experiment
- Claude Haiku: ~$0.02 per experiment
- GPT-4: ~$0.15 per experiment

### Local Models (via Ollama)
- **FREE** ✨

**Recommendation:** Use local models for testing, cloud for production.

---

## What's Next?

1. Read the full [README.md](README.md)
2. Explore the [examples](examples/)
3. Customize [characters](characters/default.json)
4. Try different [experiment modes](#try-different-modes)
5. Build something interesting!

---

**You're ready to explore consciousness! 🧠**

Have questions? Open an issue on GitHub.

