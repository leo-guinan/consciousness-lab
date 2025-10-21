# Knowledge Templates

**Base entity structures for each recursion level that agents adapt to specific repositories.**

## Purpose

These templates define the knowledge structure that each agent uses to understand and document a repository. They provide:

1. **Entity schemas** - What kind of knowledge each agent tracks
2. **Example entities** - How to structure information
3. **Analysis questions** - What to examine
4. **Documentation sections** - What to generate

## The Four Levels

### Level 1: Architect - Surface Pattern Recognition
**File:** `level-1-architect.json`

**Entities:**
- **Components** - Modules, classes, functions, files
- **Interfaces** - APIs, contracts, interaction points
- **Dependencies** - Relationships between components
- **Patterns** - Recurring structural patterns

**Focus:** *What exists and how it's structured*

---

### Level 2: Educator - Systematic Understanding  
**File:** `level-2-educator.json`

**Entities:**
- **Concepts** - Knowledge units to understand
- **Learning Paths** - Structured progressions
- **Examples** - Practical code examples
- **Questions** - FAQ and common queries

**Focus:** *How users learn and discover capabilities*

---

### Level 3: Visionary - Compositional Possibility Space
**File:** `level-3-visionary.json`

**Entities:**
- **Possibilities** - Potential features/extensions
- **Compositions** - Ways components could combine
- **Evolutions** - How project could transform
- **Connections** - Relationships between possibilities

**Focus:** *What could emerge and how*

---

### Level 4: Philosopher - Recursive Design Awareness
**File:** `level-4-philosopher.json`

**Entities:**
- **Assumptions** - Underlying design assumptions
- **Principles** - Core design principles
- **Meta-patterns** - Recursive patterns
- **Paradoxes** - Productive tensions
- **Design Decisions** - Key choices and rationale

**Focus:** *Why things are designed this way and what it reveals*

---

## How Agents Use Templates

### 1. Initialization
```javascript
// Agent loads template for their level
const template = loadTemplate('level-1-architect.json');

// Initializes knowledge base with these entity types
knowledgeBase.entities = {
  components: [],
  interfaces: [],
  dependencies: [],
  patterns: []
};
```

### 2. Analysis
As agent examines repository:
```javascript
// Architect discovers a component
agent.addEntity('components', {
  id: 'dialogue-engine',
  name: 'DialogueEngine',
  type: 'module',
  location: 'src/dialogue-engine.js',
  // ... follows component schema
});

// Educator discovers a concept
agent.addEntity('concepts', {
  id: 'custom-characters',
  name: 'Custom Character Creation',
  difficulty: 'intermediate',
  // ... follows concept schema
});
```

### 3. Adaptation
Templates adapt to specific repo:
- Same structure, different content
- Entities populated based on actual code
- Relationships discovered through analysis
- Insights organized by entity type

### 4. Export to Branch
```
agent/architect/
└── knowledge/architect/
    ├── knowledge-base.json        # Full knowledge base
    ├── components.json             # All component entities
    ├── components.md               # Human-readable components
    ├── interfaces.json             # All interface entities
    ├── interfaces.md               # Human-readable interfaces
    ├── dependencies.json           # All dependency entities
    ├── dependencies.md             # Human-readable dependencies
    ├── patterns.json               # All pattern entities
    ├── patterns.md                 # Human-readable patterns
    ├── agent-state.json            # Complete agent state
    └── README.md                   # Knowledge summary
```

## Entity Structure Example

Each entity follows its schema from the template:

```json
{
  "components": [
    {
      "id": "dialogue-engine",
      "name": "DialogueEngine",
      "type": "module",
      "location": "src/dialogue-engine.js",
      "purpose": "Orchestrates multi-agent conversations",
      "dependencies": ["model-adapter", "character-system"],
      "exports": ["DialogueEngine", "createDialogue"],
      "complexity": "high",
      "_added": 1698765432000,
      "_id": "components_1698765432000_abc123"
    }
  ]
}
```

## Benefits

### Standardization
- Consistent knowledge structure across all repos
- Easy to compare agent knowledge between projects
- Predictable documentation format

### Adaptability
- Same schema, different content
- Entities adapt to specific repository
- Structure scales from simple to complex projects

### Composability
- Knowledge from multiple repos can be combined
- Entity structures can be merged
- Cross-project pattern recognition possible

### Evolution
- Templates can evolve
- Agents adapt existing entities as understanding deepens
- Knowledge compounds over time

## Using Templates in Your Project

```bash
# 1. Agents initialize with templates
clab-agents init

# 2. Run first-run to have agents examine your repo
node experiments/first-run.js

# 3. Agents populate templates with YOUR entities
# Based on YOUR code, following the template structure

# 4. Check agent knowledge
git checkout agent/architect
cat knowledge/architect/README.md
cat knowledge/architect/components.md

# 5. Knowledge auto-updates with code changes
# Via webhook or manual: clab-agents update
```

## Customizing Templates

You can create your own templates for specialized agents:

```json
{
  "template_name": "Level X: Your Agent Type",
  "recursion_level": X,
  "entity_types": {
    "your_entity": {
      "description": "What this entity represents",
      "example": { "schema": "example" }
    }
  },
  "analysis_questions": ["What should this agent ask?"],
  "documentation_sections": { "FILE.md": "description" }
}
```

---

**The templates provide the structure.**  
**The agents provide the understanding.**  
**Your repository provides the content.**

**Together = Living, structured, evolving knowledge.** 🔄

