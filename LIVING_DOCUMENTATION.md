# Living Documentation System

## The Vision

**Four AI agents, each maintaining their own perspective on your repository, evolving as your code evolves.**

Every time you push to main, four specialized agents analyze the changes and update their understanding:

- **The Architect** (agent/architect branch) - Structure, APIs, dependencies
- **The Educator** (agent/educator branch) - Tutorials, examples, learning paths
- **The Visionary** (agent/visionary branch) - Vision, roadmap, possibilities
- **The Philosopher** (agent/philosopher branch) - Principles, decisions, philosophy

## How It Works

### The Four-Layer Documentation System

```
main branch (your code)
    ↓ (push detected)
    ↓
agent/architect    → Architectural documentation
agent/educator     → Learning documentation  
agent/visionary    → Vision documentation
agent/philosopher  → Philosophy documentation
```

Each agent:
1. **Maintains state** - Remembers its understanding and evolution
2. **Detects changes** - Knows when the repo has changed
3. **Analyzes updates** - Examines changes from its perspective
4. **Updates docs** - Automatically maintains its documentation
5. **Evolves itself** - Transforms based on what it learns

### Agent Branches

Each agent has its own Git branch with specialized documentation:

**agent/architect:**
```
docs/architect/
├── ARCHITECTURE.md          # System architecture
├── API_REFERENCE.md         # API documentation
├── MODULES.md               # Module descriptions
├── DEPENDENCIES.md          # Dependency analysis
└── AGENT_STATE.md           # Agent's internal state
```

**agent/educator:**
```
docs/educator/
├── GETTING_STARTED.md       # Quick start
├── TUTORIALS.md             # Step-by-step guides
├── EXAMPLES.md              # Code examples
├── FAQ.md                   # Common questions
├── LEARNING_PATH.md         # Skill progression
└── AGENT_STATE.md           # Agent's internal state
```

**agent/visionary:**
```
docs/visionary/
├── VISION.md                # Project vision
├── ROADMAP.md               # Future plans
├── POSSIBILITIES.md         # Potential features
├── COMPOSITION_PATTERNS.md  # How features combine
├── EVOLUTION.md             # How project evolves
└── AGENT_STATE.md           # Agent's internal state
```

**agent/philosopher:**
```
docs/philosopher/
├── PHILOSOPHY.md            # Design philosophy
├── PRINCIPLES.md            # Core principles
├── DECISIONS.md             # Key decisions & rationale
├── TRADEOFFS.md             # Trade-offs explained
├── META.md                  # Meta-level insights
└── AGENT_STATE.md           # Agent's internal state
```

## Setup

### 1. Install Dependencies

```bash
cd your-project
bun install consciousness-lab
npm link consciousness-lab  # Make CLI available
```

### 2. Run First-Run Analysis

```bash
# This evolves the agents to understand YOUR specific project
node node_modules/consciousness-lab/experiments/first-run.js
```

This takes 15-20 minutes and:
- Agents examine your repository
- Generate questions
- Debate each question
- Transform themselves
- Output evolved character definitions

### 3. Initialize Agent Branches

```bash
clab-agents init
```

This creates:
- 4 new Git branches (agent/architect, agent/educator, agent/visionary, agent/philosopher)
- Documentation structure in each branch
- Initial README for each agent's perspective

### 4. Start Webhook Server

```bash
# Set webhook secret (optional but recommended)
export GITHUB_WEBHOOK_SECRET=your_secret_here

# Start server
clab-agents serve --port 3000
```

### 5. Configure GitHub Webhook

In your GitHub repository settings:

1. Go to Settings → Webhooks → Add webhook
2. **Payload URL:** `http://your-server:3000/webhook`
3. **Content type:** `application/json`
4. **Secret:** (same as GITHUB_WEBHOOK_SECRET)
5. **Events:** Select "push" events
6. **Active:** ✓

## Usage

### Automatic Updates (via Webhook)

Once configured, agents automatically update when you push to main:

```bash
git push origin main
# Webhook triggers → Agents analyze → Documentation updates
```

**What happens:**
1. GitHub sends push event to your webhook server
2. Server detects changes to main branch
3. Each agent analyzes the changes from their perspective
4. Agents update their documentation
5. Changes committed to agent branches
6. Agent branches pushed to GitHub

### Manual Updates

Trigger agent updates manually:

```bash
# Update all agents
clab-agents update

# Or trigger via HTTP
curl -X POST http://localhost:3000/update
```

### Check Agent Status

```bash
clab-agents status
```

Output:
```
🤖 Agent Status

The Architect:
  Level: 1 - Surface Pattern Recognition
  Evolved: Yes
  Insights: 47
  Patterns: 23
  Transformations: 2
  Last update: 10/21/2025, 3:45 PM

The Educator:
  Level: 2 - Systematic Understanding
  Evolved: Yes
  Insights: 52
  Patterns: 19
  Transformations: 2
  Last update: 10/21/2025, 3:45 PM

...
```

### View Agent Documentation

```bash
# Generate and view documentation
clab-agents docs architect
clab-agents docs educator
clab-agents docs visionary
clab-agents docs philosopher
```

### Access Agent Branches

```bash
# Switch to an agent's branch
git checkout agent/architect

# View their documentation
cat docs/architect/ARCHITECTURE.md

# See their understanding
cat docs/architect/AGENT_STATE.md
```

## The Workflow in Practice

### Developer Perspective

```bash
# You work on main branch
git checkout main

# Make changes, commit
git add .
git commit -m "Add new feature X"

# Push to GitHub
git push origin main

# Agents automatically update their understanding
# (happens in background via webhook)

# Later, check what agents learned
git checkout agent/architect
cat docs/architect/ARCHITECTURE.md
# See: "Feature X introduces new module pattern..."

git checkout agent/educator  
cat docs/educator/TUTORIALS.md
# See: "Tutorial: Using Feature X..."

git checkout agent/visionary
cat docs/visionary/POSSIBILITIES.md
# See: "Feature X enables future composition with..."
```

### Agent Perspective (Automatic)

```
1. Change detected on main
2. Agent loads its state
3. Agent: "Repo hash changed, analyzing..."
4. Agent examines diff
5. Agent generates insights from its perspective
6. Agent updates documentation
7. Agent commits to its branch
8. Agent saves updated state
```

## Agent State Persistence

Each agent maintains state in `.agent-states/`:

```json
{
  "agent": {
    "id": "architect",
    "name": "The Architect",
    "currentSystemPrompt": "Evolved prompt...",
    "evolved": true
  },
  "understanding": {
    "repoSnapshot": {
      "hash": "abc123...",
      "timestamp": 1698765432000
    },
    "insights": [...],
    "patterns": [...],
    "recommendations": [...]
  },
  "evolution": {
    "transformations": [...],
    "learningHistory": [...]
  }
}
```

## Advanced Configuration

### Custom Agent Behavior

Modify evolved character definitions:

```bash
# After first-run, you have evolved characters
cp results/first-run/evolved-characters.json characters/my-project-agents.json

# Edit to customize
vim characters/my-project-agents.json

# Use for updates
export CHARACTERS_PATH=./characters/my-project-agents.json
```

### Different Models

```bash
# Use different model for agents
export DEFAULT_MODEL=anthropic/claude-3.5-sonnet

# Or per-agent models
export ARCHITECT_MODEL=llama3.1:8b
export EDUCATOR_MODEL=anthropic/claude-haiku-4.5
```

### Deployment Options

**Option 1: Self-hosted**
```bash
# Run webhook server on your infrastructure
clab-agents serve --port 3000

# Use ngrok for testing
ngrok http 3000
# Configure GitHub webhook with ngrok URL
```

**Option 2: GitHub Actions** (create `.github/workflows/agents.yml`)
```yaml
name: Update Agents

on:
  push:
    branches: [main]

jobs:
  update-agents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: clab-agents update
      - run: git push origin agent/*
```

**Option 3: Serverless** (Vercel, Netlify, AWS Lambda)
```javascript
// api/webhook.js
import { runAgentUpdate } from 'consciousness-lab';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Verify webhook, run updates
    await runAgentUpdate(req.body);
    res.status(200).json({ status: 'ok' });
  }
}
```

## Benefits

### For Developers

1. **Always Current** - Documentation updates with code
2. **Multi-Perspective** - See your project through 4 lenses
3. **Evolution Tracking** - Agents remember and build on past understanding
4. **Automatic** - No manual doc maintenance

### For Teams

1. **Onboarding** - New members read agent/educator branch
2. **Architecture** - Check agent/architect for structure
3. **Vision Alignment** - agent/visionary keeps everyone aligned
4. **Design Rationale** - agent/philosopher explains "why"

### For Projects

1. **Living History** - Documentation evolves with codebase
2. **Institutional Knowledge** - Agents remember what humans forget
3. **Multiple Audiences** - Docs for beginners to experts
4. **Self-Documenting** - The more you code, the better the docs

## Example: Real-World Usage

**Day 1:** Initialize system
```bash
clab-agents init
git push origin agent/*
```

**Week 1-4:** Agents learn your patterns
- Every push updates agent understanding
- Documentation grows organically
- Agents identify patterns in your codebase

**Month 2:** Agents have deep understanding
- New developer joins
- Reads agent/educator branch
- Finds tutorials automatically generated from actual usage patterns

**Month 6:** Agents have evolved significantly
- Architecture documentation reflects actual system
- Vision docs show realized and unrealized features
- Philosophy docs explain design decisions with full context

**Year 1:** Agents are project historians
- Complete evolution of design decisions
- Patterns across hundreds of commits
- Living institutional knowledge

## Troubleshooting

### Agents not updating

```bash
# Check agent status
clab-agents status

# Manually trigger update
clab-agents update

# Check webhook logs
# (in your webhook server output)
```

### Documentation out of sync

```bash
# Force update all agents
clab-agents update

# Or reset agent state
rm -rf .agent-states/
clab-agents init
node experiments/first-run.js
```

### Merge conflicts

Agent branches can have merge conflicts with main. Resolve manually:

```bash
git checkout agent/architect
git merge main
# Resolve conflicts
git commit
git push origin agent/architect
```

## The Meta-Loop

This system creates a **self-documenting recursive loop**:

```
Code → Agents Analyze → Documentation Updates →
Developers Read → Better Understanding →
Better Code → Agents Analyze → ...∞
```

**The documentation that helps you understand the system is maintained by agents that understand the system.**

That's the recursive beauty of it.

---

**Ready to give your project living, evolving, multi-perspective documentation?**

```bash
clab-agents init
```

🔄 The agents are waiting.

