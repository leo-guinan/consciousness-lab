/**
 * Agent State Management
 * Persists each agent's understanding of itself and the repository
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

export class AgentState {
  constructor(agentId, basePath = './.agent-states') {
    this.agentId = agentId;
    this.basePath = basePath;
    this.statePath = join(basePath, `${agentId}.json`);
    this.state = null;
  }

  /**
   * Initialize agent state
   */
  async initialize(character, repoContext = {}) {
    await mkdir(this.basePath, { recursive: true });

    this.state = {
      agent: {
        id: this.agentId,
        name: character.name,
        level: character.level,
        levelName: character.level_name,
        originalSystemPrompt: character.system_prompt,
        currentSystemPrompt: character.system_prompt,
        voice: character.voice,
        focus: character.focus,
        evolved: false
      },
      understanding: {
        repoSnapshot: {
          hash: this.hashObject(repoContext),
          timestamp: Date.now(),
          structure: repoContext.structure || {},
          keyFiles: repoContext.keyFiles || []
        },
        insights: [],
        patterns: [],
        assumptions: [],
        recommendations: []
      },
      evolution: {
        transformations: [],
        learningHistory: []
      },
      documentation: {
        lastUpdate: Date.now(),
        sections: this.initializeSections()
      },
      metadata: {
        created: Date.now(),
        lastModified: Date.now(),
        version: '1.0.0'
      }
    };

    await this.save();
    return this.state;
  }

  /**
   * Initialize documentation sections based on agent type
   */
  initializeSections() {
    const sections = {
      architect: {
        'ARCHITECTURE.md': 'System architecture and structure',
        'API_REFERENCE.md': 'API documentation',
        'MODULES.md': 'Module descriptions',
        'DEPENDENCIES.md': 'Dependency analysis'
      },
      educator: {
        'GETTING_STARTED.md': 'Quick start guide',
        'TUTORIALS.md': 'Step-by-step tutorials',
        'EXAMPLES.md': 'Usage examples',
        'FAQ.md': 'Common questions and answers',
        'LEARNING_PATH.md': 'Progression for different skill levels'
      },
      visionary: {
        'VISION.md': 'Project vision and direction',
        'ROADMAP.md': 'Future plans and milestones',
        'POSSIBILITIES.md': 'Potential extensions',
        'COMPOSITION_PATTERNS.md': 'How features could combine',
        'EVOLUTION.md': 'How the project might evolve'
      },
      philosopher: {
        'PHILOSOPHY.md': 'Design philosophy',
        'PRINCIPLES.md': 'Core principles',
        'DECISIONS.md': 'Key design decisions and why',
        'TRADEOFFS.md': 'Trade-offs and their rationale',
        'META.md': 'Recursive and meta-level insights'
      }
    };

    return sections[this.agentId] || {};
  }

  /**
   * Load existing state
   */
  async load() {
    try {
      const data = await readFile(this.statePath, 'utf-8');
      this.state = JSON.parse(data);
      return this.state;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null; // State doesn't exist yet
      }
      throw error;
    }
  }

  /**
   * Save current state
   */
  async save() {
    if (!this.state) {
      throw new Error('No state to save. Initialize first.');
    }

    this.state.metadata.lastModified = Date.now();
    await mkdir(this.basePath, { recursive: true });
    await writeFile(this.statePath, JSON.stringify(this.state, null, 2));
  }

  /**
   * Update agent understanding after examining repo changes
   */
  async updateUnderstanding(newInsights, repoContext) {
    if (!this.state) {
      await this.load();
    }

    const repoHash = this.hashObject(repoContext);
    const previousHash = this.state.understanding.repoSnapshot.hash;

    this.state.understanding.repoSnapshot = {
      hash: repoHash,
      timestamp: Date.now(),
      previousHash,
      structure: repoContext.structure || {},
      keyFiles: repoContext.keyFiles || []
    };

    // Add new insights
    if (newInsights.insights) {
      this.state.understanding.insights.push(...newInsights.insights);
    }

    if (newInsights.patterns) {
      this.state.understanding.patterns.push(...newInsights.patterns);
    }

    if (newInsights.assumptions) {
      this.state.understanding.assumptions.push(...newInsights.assumptions);
    }

    if (newInsights.recommendations) {
      this.state.understanding.recommendations.push(...newInsights.recommendations);
    }

    // Track learning
    this.state.evolution.learningHistory.push({
      timestamp: Date.now(),
      repoHash,
      insightsCount: newInsights.insights?.length || 0,
      summary: newInsights.summary || 'Repository update processed'
    });

    await this.save();
  }

  /**
   * Transform agent based on new understanding
   */
  async transform(transformation) {
    if (!this.state) {
      await this.load();
    }

    const previousPrompt = this.state.agent.currentSystemPrompt;

    // Update agent
    this.state.agent.currentSystemPrompt = transformation.updated_system_prompt || previousPrompt;
    this.state.agent.evolved = true;

    // Record transformation
    this.state.evolution.transformations.push({
      timestamp: Date.now(),
      previousPrompt,
      newPrompt: this.state.agent.currentSystemPrompt,
      evolvedUnderstanding: transformation.evolved_understanding,
      perspectiveShift: transformation.perspective_shift,
      newFocusAreas: transformation.new_focus_areas || [],
      keyInsights: transformation.key_insights || []
    });

    await this.save();
  }

  /**
   * Get current agent character definition
   */
  getCurrentCharacter() {
    if (!this.state) {
      throw new Error('State not loaded');
    }

    return {
      id: this.state.agent.id,
      name: this.state.agent.name,
      level: this.state.agent.level,
      level_name: this.state.agent.levelName,
      system_prompt: this.state.agent.currentSystemPrompt,
      voice: this.state.agent.voice,
      focus: this.state.agent.focus,
      evolved: this.state.agent.evolved,
      evolution_metadata: {
        transformations: this.state.evolution.transformations.length,
        lastTransformation: this.state.evolution.transformations[this.state.evolution.transformations.length - 1],
        insights: this.state.understanding.insights,
        patterns: this.state.understanding.patterns
      }
    };
  }

  /**
   * Generate markdown documentation for this agent's understanding
   */
  generateDocumentation() {
    if (!this.state) {
      throw new Error('State not loaded');
    }

    const docs = {};
    const sections = Object.keys(this.state.documentation.sections);

    // Generate overview
    docs['README.md'] = this.generateReadme();

    // Generate section-specific docs
    sections.forEach(section => {
      docs[section] = this.generateSectionDoc(section);
    });

    // Generate state summary
    docs['AGENT_STATE.md'] = this.generateStateSummary();

    return docs;
  }

  /**
   * Generate README for agent's branch
   */
  generateReadme() {
    const agent = this.state.agent;
    return `# ${agent.name}'s Understanding

**Agent Level:** ${agent.level} - ${agent.levelName}  
**Focus:** ${agent.focus}  
**Evolved:** ${agent.evolved ? 'Yes' : 'No'}  
**Last Updated:** ${new Date(this.state.metadata.lastModified).toISOString()}

## About This Branch

This branch contains ${agent.name}'s understanding of the repository from the perspective of **${agent.levelName}**.

${agent.evolved ? `
## Evolution
This agent has evolved ${this.state.evolution.transformations.length} time(s) through understanding the repository.
` : ''}

## Documentation Sections

${Object.entries(this.state.documentation.sections).map(([file, desc]) => 
  `- **${file}**: ${desc}`
).join('\n')}

## Current Insights

${this.state.understanding.insights.length > 0 ? 
  this.state.understanding.insights.slice(-5).map(i => `- ${i}`).join('\n') :
  'No insights yet - initial examination in progress.'
}

---

*This documentation is automatically maintained by an AI agent that evolves through understanding the codebase.*
`;
  }

  /**
   * Generate section-specific documentation
   */
  generateSectionDoc(section) {
    // This will be populated by the agent's actual analysis
    return `# ${section.replace('.md', '').replace(/_/g, ' ')}

*This section is maintained by ${this.state.agent.name}.*

Last updated: ${new Date(this.state.documentation.lastUpdate).toISOString()}

---

## Content

This section will be populated based on ${this.state.agent.name}'s analysis of the repository from the perspective of ${this.state.agent.levelName}.

## Recent Insights

${this.state.understanding.insights.slice(-3).map(i => `- ${i}`).join('\n') || 'Analysis in progress...'}
`;
  }

  /**
   * Generate state summary
   */
  generateStateSummary() {
    return `# Agent State Summary

## Identity
- **ID:** ${this.state.agent.id}
- **Name:** ${this.state.agent.name}
- **Level:** ${this.state.agent.level} - ${this.state.agent.levelName}

## Evolution
- **Transformations:** ${this.state.evolution.transformations.length}
- **Learning History Entries:** ${this.state.evolution.learningHistory.length}

## Understanding
- **Insights:** ${this.state.understanding.insights.length}
- **Patterns Identified:** ${this.state.understanding.patterns.length}
- **Assumptions Tracked:** ${this.state.understanding.assumptions.length}
- **Recommendations:** ${this.state.understanding.recommendations.length}

## Repository Snapshot
- **Hash:** ${this.state.understanding.repoSnapshot.hash}
- **Last Checked:** ${new Date(this.state.understanding.repoSnapshot.timestamp).toISOString()}

---

*Internal state document - not for end users*
`;
  }

  /**
   * Hash an object for comparison
   */
  hashObject(obj) {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    return crypto.createHash('md5').update(str).digest('hex');
  }

  /**
   * Check if repo has changed since last check
   */
  hasRepoChanged(newRepoContext) {
    if (!this.state) {
      return true;
    }

    const newHash = this.hashObject(newRepoContext);
    return newHash !== this.state.understanding.repoSnapshot.hash;
  }
}

export default AgentState;

