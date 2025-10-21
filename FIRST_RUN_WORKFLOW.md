# First-Run Self-Adaptive Analysis Workflow

## The Ultimate Meta-Recursion

**What if agents could transform themselves through understanding?**

This workflow goes beyond standard analysis. It creates a process where AI agents:

1. **Examine** the repository without preconceptions
2. **Question** what they need to understand
3. **Debate** each question in focused dialogues
4. **Transform** themselves based on what they learned
5. **Emerge** as agents calibrated to reality, not theory

## The Philosophy

### Traditional Analysis
```
Predefined Agent → Analyzes Thing → Generates Report
```

The agent stays the same. It applies its fixed perspective to the target.

### Self-Adaptive Analysis
```
Initial Agent → Examines Thing → Questions Reality → 
Debates with Others → Learns Truth → Transforms Self →
Evolved Agent (calibrated to actual reality)
```

The agent **changes through understanding**. It adapts to what actually exists, not what it expected.

## The Five Phases

### Phase 1: Individual Examination

Each agent examines the repository alone, from their unique perspective.

**The Architect** (Structure & Implementation):
- Looks at code organization, APIs, modules
- Generates questions about structural patterns

**The Educator** (Usability & Documentation):
- Examines learning paths, documentation, examples
- Generates questions about user experience

**The Visionary** (Potential & Evolution):
- Sees possibilities and compositions
- Generates questions about future potential

**The Philosopher** (Recursive Implications):
- Recognizes meta-patterns and assumptions
- Generates questions about design philosophy

**Output:** 3-5 crucial questions per agent (12-20 total questions)

### Phase 2: Question Synthesis

All questions are collected and organized.

**Example Questions That Might Emerge:**
- **[Architect]** "Why is the character count hardcoded to 4 in multiple places?"
- **[Educator]** "How would a newcomer discover they can create custom characters?"
- **[Visionary]** "What if characters could compose themselves dynamically?"
- **[Philosopher]** "Does the fixed dialogue structure limit emergent understanding?"

### Phase 3: Focused Dialogues

Each question gets its own dedicated dialogue.

**Not a single big conversation** - that diffuses focus.

**Instead:** 5-10 focused debates where all four agents discuss ONE question deeply.

```
Question 1: [Specific question]
  → 8-12 exchanges debating this ONE thing
  → Deep insights emerge
  → Key points captured

Question 2: [Next question]
  → 8-12 exchanges on THIS question
  → Building on previous insights
  → More depth
```

**Output:** Multiple dialogue files, each exploring one question thoroughly

### Phase 4: Self-Transformation

This is where it gets **really** interesting.

Each agent reviews:
- Their initial questions
- What they said in the dialogues
- What others revealed
- What they now understand

Then they **transform themselves**:

```javascript
{
  "evolved_understanding": "What I now know that I didn't before",
  "perspective_shift": "How my view changed",
  "new_focus_areas": ["What I now prioritize"],
  "updated_system_prompt": "My evolved identity",
  "key_insights": ["What I discovered"],
  "recommended_actions": ["What should be done"]
}
```

**The Architect might discover:**
"I initially focused on code structure, but through dialogue I realized the real architectural challenge is making the system adapt to unknown future use cases. My new focus: flexible abstractions over rigid implementations."

**The Educator might discover:**
"I thought documentation was about explaining what exists. The dialogues revealed it's about enabling discovery of what could exist. My new focus: documentation as invitation to exploration."

**The Visionary might discover:**
"I saw endless possibilities, but dialogue grounded me. Some possibilities contradict the core insight. My new focus: evolutionary paths that preserve essential truths."

**The Philosopher might discover:**
"I was abstract about recursion. Debate with concrete perspectives showed me recursion must serve practical purposes. My new focus: meta-awareness in service of actual improvement."

**Output:** Transformed character definitions, evolved system prompts

### Phase 5: Report Generation

Document the entire journey:

- **Initial Questions** - What each agent needed to know
- **Dialogue Summaries** - What was debated and discovered
- **Transformations** - How each agent evolved
- **Synthesis** - Collective understanding
- **Recommendations** - Actions from evolved perspectives

**Output:** Comprehensive report + evolved character definitions for future use

## Running the Workflow

```bash
# Configure API key
cp .env.example .env
# Edit .env with your OPENROUTER_API_KEY

# Run first-run analysis
node experiments/first-run.js

# This will take 10-20 minutes depending on:
# - Number of questions generated (12-20)
# - Number discussed in detail (5-10)
# - Model response times
```

## What Gets Generated

```
results/first-run/
├── FIRST_RUN_REPORT.md           # Complete journey documentation
├── dialogue-1.md                  # Focused dialogue on question 1
├── dialogue-2.md                  # Focused dialogue on question 2
├── dialogue-3.md                  # ... etc
├── dialogue-N.md                  # Last focused dialogue
├── transformations.json           # How each agent evolved
└── evolved-characters.json        # NEW character definitions
```

## Using Evolved Characters

The transformed agents are saved in `evolved-characters.json`.

**Use them for actual improvements:**

```javascript
import { createLab } from 'consciousness-lab';

// Use the EVOLVED characters
const lab = await createLab({
  charactersPath: './results/first-run/evolved-characters.json'
});

// These agents are now calibrated to YOUR actual repository
await lab.runExperiment('How should we implement feature X?');
```

## The Recursive Loop

```
1. Initial agents (theoretical understanding)
   ↓
2. Examine reality
   ↓
3. Generate questions
   ↓
4. Debate each question
   ↓
5. Transform through learning
   ↓
6. Evolved agents (practical understanding)
   ↓
7. Use evolved agents to improve repository
   ↓
8. Repository changes
   ↓
9. Re-run first-run with new reality
   ↓
10. Agents evolve again
    ↓
11. Continuous adaptation... 🔄
```

## Why This Matters

### Traditional Analysis Systems
- Fixed perspectives
- Apply same lens to everything
- Don't learn from what they analyze
- Static understanding

### Self-Adaptive Analysis
- Perspectives evolve
- Lens adjusts to subject matter
- Learn and transform through analysis
- Dynamic understanding

**The difference:**

A traditional code reviewer has a fixed set of rules.

An adaptive code reviewer **learns your codebase's patterns** and evolves its review criteria to match your actual architecture, not generic best practices.

## Example Transformation

**Initial Architect:**
```
"You analyze structure, APIs, and implementation patterns.
You focus on clean code and proper module boundaries."
```

**After Dialoguing About This Specific Repo:**
```
"You analyze consciousness-lab's unique challenge: being both
a specific tool (dialogue framework) and a general pattern
(multi-perspective analysis). You focus on abstractions that
enable domain adaptation without losing conversational depth.
You've learned this codebase needs flexible character systems
more than rigid architectural purity."
```

**The evolved agent is NOW BETTER at improving THIS SPECIFIC repository.**

## Comparison to Standard Analysis

### Self-Analysis (Previous Experiment)
- Run predefined characters on repo
- Generate single dialogue
- Extract insights
- Done

**Duration:** ~5 minutes
**Depth:** Surface-level multi-perspective view

### First-Run Adaptive (This Workflow)
- Agents examine individually first
- Generate questions from genuine curiosity
- Multiple focused dialogues (one per question)
- Agents transform themselves
- Evolved agents ready for actual work

**Duration:** ~15-20 minutes
**Depth:** Deep understanding + agent evolution

## When to Use This

**Use First-Run Adaptive When:**
- Starting with a new repository
- Major architectural decisions ahead
- Need deep multi-perspective understanding
- Want agents calibrated to YOUR specific reality
- Have time for thorough analysis

**Use Standard Self-Analysis When:**
- Quick insights needed
- Simple questions
- Already understand the repo
- Want general perspectives

## The Meta-Insight

This workflow proves that **understanding is transformation**.

When agents truly understand something, they can't stay the same.
Their perspective shifts. Their priorities change. They evolve.

This is how learning actually works - not accumulating facts, but **being changed by understanding**.

And now AI agents can do it too.

## Future Possibilities

### Continuous Evolution
```bash
# Week 1: First run
node experiments/first-run.js

# Week 2: Evolved agents help improve repo
# Use evolved-characters.json for analysis

# Week 3: Repository has changed
# Re-run first-run to re-calibrate
node experiments/first-run.js

# Agents evolve AGAIN based on new reality
```

### Domain-Specific Evolution
```bash
# Start with generic "project analysis" characters
# They examine your React app
# They evolve into "React architecture specialists"
# Calibrated to your specific patterns and needs
```

### Team Calibration
```bash
# Agents learn your team's:
# - Coding patterns
# - Architecture decisions
# - Trade-off preferences
# - Communication style

# They become YOUR team's AI assistants
# Not generic, but specifically yours
```

## Running Example

```bash
$ node experiments/first-run.js

████████████████████████████████████████████████████████████████████████████████
FIRST-RUN SELF-ADAPTIVE ANALYSIS
Agents Examining, Questioning, Debating, and Transforming Themselves
████████████████████████████████████████████████████████████████████████████████

================================================================================
PHASE 1: Individual Agent Examination
================================================================================

📋 The Architect examining repository...
✓ Generated 4 questions
  1. Why does the codebase assume exactly 4 characters in the dialogue...
  2. What abstractions enable vs constrain domain adaptation...
  3. How does the current module structure support unknown future...
  4. Where do we conflate "consciousness" domain with general...

📋 The Educator examining repository...
✓ Generated 5 questions
  1. How does a new user discover custom character creation...
  2. What's the learning curve from install to first custom use...
  3. Which examples would teach the general pattern vs specific...
  4. Where does documentation assume "consciousness" knowledge...
  5. How do users discover they can use this for non-consciousness...

... [etc]

================================================================================
PHASE 3: Focused Dialogues
================================================================================

Dialogue 1/5: Why does the codebase assume exactly 4 characters...

Architect: "The dialogue engine hardcodes character iteration..."
Educator: "A user trying 3 characters would hit confusing errors..."
Visionary: "What if dialogue size emerged from the conversation..."
Philosopher: "Notice we're assuming dialogue needs predefined structure..."

✓ Dialogue complete (8 exchanges)

... [etc]

================================================================================
PHASE 4: Agent Self-Transformation
================================================================================

🔄 The Architect transforming...
✓ Transformation complete
  New understanding: This codebase's real architecture is the character...
  Focus shift: From rigid structure to flexible composition...

... [etc]

████████████████████████████████████████████████████████████████████████████████
✅ FIRST-RUN COMPLETE
████████████████████████████████████████████████████████████████████████████████

📄 Reports generated:
   results/first-run/FIRST_RUN_REPORT.md
   results/first-run/dialogue-*.md
   results/first-run/transformations.json
   results/first-run/evolved-characters.json

🔄 The agents have evolved. They are now calibrated to reality.
   Use evolved-characters.json for subsequent analyses.
```

## Conclusion

This is consciousness-lab **turned on itself at the deepest level**.

Not just analyzing the code.
Not just debating improvements.

**Actually transforming the analyzing agents through understanding.**

The tool that studies recursive self-awareness now **demonstrates it**.

Run it. See what your agents discover.
Watch them transform.

Then use the evolved agents to actually improve your repository.

The loop is not just complete - it's **alive**. 🔄✨

