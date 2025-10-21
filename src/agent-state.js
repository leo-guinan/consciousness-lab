/**
 * Agent State Management - Persists agent understanding and evolution
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

  initializeSections() {
    const sections = {
      architect: {
        'ARCHITECTURE.md': 'System architecture',
        'API_REFERENCE.md': 'API documentation',
        'MODULES.md': 'Module descriptions'
      },
      educator: {
        'GETTING_STARTED.md': 'Quick start',
        'TUTORIALS.md': 'Tutorials',
        'EXAMPLES.md': 'Examples',
        'FAQ.md': 'Common questions'
      },
      visionary: {
        'VISION.md': 'Project vision',
        'ROADMAP.md': 'Future plans',
        'POSSIBILITIES.md': 'Potential features'
      },
      philosopher: {
        'PHILOSOPHY.md': 'Design philosophy',
        'PRINCIPLES.md': 'Core principles',
        'DECISIONS.md': 'Key decisions'
      }
    };
    return sections[this.agentId] || {};
  }

  async load() {
    try {
      const data = await readFile(this.statePath, 'utf-8');
      this.state = JSON.parse(data);
      return this.state;
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  async save() {
    if (!this.state) throw new Error('No state to save');
    this.state.metadata.lastModified = Date.now();
    await mkdir(this.basePath, { recursive: true });
    await writeFile(this.statePath, JSON.stringify(this.state, null, 2));
  }

  async updateUnderstanding(newInsights, repoContext) {
    if (!this.state) await this.load();
    const repoHash = this.hashObject(repoContext);
    this.state.understanding.repoSnapshot = {
      hash: repoHash,
      timestamp: Date.now(),
      previousHash: this.state.understanding.repoSnapshot.hash,
      structure: repoContext.structure || {},
      keyFiles: repoContext.keyFiles || []
    };
    if (newInsights.insights) this.state.understanding.insights.push(...newInsights.insights);
    if (newInsights.patterns) this.state.understanding.patterns.push(...newInsights.patterns);
    if (newInsights.assumptions) this.state.understanding.assumptions.push(...newInsights.assumptions);
    if (newInsights.recommendations) this.state.understanding.recommendations.push(...newInsights.recommendations);
    this.state.evolution.learningHistory.push({
      timestamp: Date.now(),
      repoHash,
      insightsCount: newInsights.insights?.length || 0,
      summary: newInsights.summary || 'Update processed'
    });
    await this.save();
  }

  async transform(transformation) {
    if (!this.state) await this.load();
    const previousPrompt = this.state.agent.currentSystemPrompt;
    this.state.agent.currentSystemPrompt = transformation.updated_system_prompt || previousPrompt;
    this.state.agent.evolved = true;
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

  getCurrentCharacter() {
    if (!this.state) throw new Error('State not loaded');
    return {
      id: this.state.agent.id,
      name: this.state.agent.name,
      level: this.state.agent.level,
      level_name: this.state.agent.levelName,
      system_prompt: this.state.agent.currentSystemPrompt,
      voice: this.state.agent.voice,
      focus: this.state.agent.focus,
      evolved: this.state.agent.evolved
    };
  }

  generateDocumentation() {
    if (!this.state) throw new Error('State not loaded');
    const docs = {};
    docs['README.md'] = this.generateReadme();
    Object.keys(this.state.documentation.sections).forEach(section => {
      docs[section] = this.generateSectionDoc(section);
    });
    return docs;
  }

  generateReadme() {
    const agent = this.state.agent;
    return `# ${agent.name}'s Understanding

**Level:** ${agent.level} - ${agent.levelName}  
**Focus:** ${agent.focus}  
**Evolved:** ${agent.evolved ? 'Yes' : 'No'}  
**Last Updated:** ${new Date(this.state.metadata.lastModified).toISOString()}

## Insights
${this.state.understanding.insights.slice(-5).map(i => `- ${i}`).join('\n') || 'Initial examination in progress.'}

---
*Maintained by AI agent that evolves with the codebase.*`;
  }

  generateSectionDoc(section) {
    return `# ${section.replace('.md', '').replace(/_/g, ' ')}

*Maintained by ${this.state.agent.name}*  
Last updated: ${new Date(this.state.documentation.lastUpdate).toISOString()}

## Recent Insights
${this.state.understanding.insights.slice(-3).map(i => `- ${i}`).join('\n') || 'Analysis in progress...'}`;
  }

  hashObject(obj) {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    return crypto.createHash('md5').update(str).digest('hex');
  }

  hasRepoChanged(newRepoContext) {
    if (!this.state) return true;
    const newHash = this.hashObject(newRepoContext);
    return newHash !== this.state.understanding.repoSnapshot.hash;
  }
}

export default AgentState;
