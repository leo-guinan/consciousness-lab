/**
 * Agent State Management - Persists agent understanding and evolution
 */
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';
import { initializeKnowledgeBase, getStructureForLevel } from './knowledge-structure.js';

export class AgentState {
  constructor(agentId, basePath = './.agent-states') {
    this.agentId = agentId;
    this.basePath = basePath;
    this.statePath = join(basePath, `${agentId}.json`);
    this.state = null;
  }

  async initialize(character, repoContext = {}) {
    await mkdir(this.basePath, { recursive: true });
    
    // Initialize knowledge base with structured entities
    const knowledgeBase = initializeKnowledgeBase(character);
    
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
      knowledge: knowledgeBase, // Structured knowledge base
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

  /**
   * Add entity to knowledge base
   */
  addEntity(entityType, entityData) {
    if (!this.state || !this.state.knowledge) {
      throw new Error('Knowledge base not initialized');
    }

    if (!this.state.knowledge.entities[entityType]) {
      this.state.knowledge.entities[entityType] = [];
    }

    // Add timestamp and ID if not present
    const entity = {
      ...entityData,
      _added: Date.now(),
      _id: entityData.id || this.generateEntityId(entityType)
    };

    this.state.knowledge.entities[entityType].push(entity);
    this.state.knowledge.metadata.update_count++;
    this.state.knowledge.metadata.last_updated = Date.now();
  }

  /**
   * Generate entity ID
   */
  generateEntityId(entityType) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${entityType}_${timestamp}_${random}`;
  }

  /**
   * Export knowledge base to Git branch format
   */
  async exportToBranch(branchPath) {
    if (!this.state || !this.state.knowledge) {
      throw new Error('No knowledge to export');
    }

    const agentDir = join(branchPath, 'knowledge', this.agentId);
    await mkdir(agentDir, { recursive: true });

    // Save main knowledge file
    await writeFile(
      join(agentDir, 'knowledge-base.json'),
      JSON.stringify(this.state.knowledge, null, 2)
    );

    // Save entity files per type
    const structure = getStructureForLevel(this.state.agent.level);
    for (const [entityType, entityList] of Object.entries(this.state.knowledge.entities)) {
      if (entityList.length > 0) {
        await writeFile(
          join(agentDir, `${entityType}.json`),
          JSON.stringify(entityList, null, 2)
        );

        // Also create markdown representation
        const md = this.generateEntityMarkdown(entityType, entityList, structure);
        await writeFile(
          join(agentDir, `${entityType}.md`),
          md
        );
      }
    }

    // Save human-readable summary
    const summary = this.generateKnowledgeSummary();
    await writeFile(join(agentDir, 'README.md'), summary);

    // Save state snapshot
    await writeFile(
      join(agentDir, 'agent-state.json'),
      JSON.stringify(this.state, null, 2)
    );
  }

  /**
   * Generate markdown for entities
   */
  generateEntityMarkdown(entityType, entities, structure) {
    const schema = structure.entities[entityType]?.schema || {};
    
    let md = `# ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}\n\n`;
    md += `**Entity Type:** ${structure.entities[entityType]?.type || 'unknown'}  \n`;
    md += `**Count:** ${entities.length}  \n`;
    md += `**Last Updated:** ${new Date().toISOString()}  \n\n`;
    md += `---\n\n`;

    entities.forEach((entity, index) => {
      md += `## ${index + 1}. ${entity.name || entity.id || 'Unnamed'}\n\n`;
      
      // Display fields based on schema
      Object.keys(schema).forEach(field => {
        if (entity[field] !== undefined) {
          const value = Array.isArray(entity[field]) 
            ? entity[field].join(', ') 
            : typeof entity[field] === 'object'
            ? JSON.stringify(entity[field], null, 2)
            : entity[field];
          md += `**${field}:** ${value}  \n`;
        }
      });
      
      md += `\n---\n\n`;
    });

    return md;
  }

  /**
   * Generate knowledge summary for README
   */
  generateKnowledgeSummary() {
    if (!this.state || !this.state.knowledge) return '';

    const kb = this.state.knowledge;
    const agent = this.state.agent;

    let summary = `# ${agent.name}'s Knowledge Base\n\n`;
    summary += `**Recursion Level:** ${agent.level} - ${agent.levelName}  \n`;
    summary += `**Last Updated:** ${new Date(kb.metadata.last_updated).toISOString()}  \n`;
    summary += `**Updates:** ${kb.metadata.update_count}  \n`;
    summary += `**Evolved:** ${agent.evolved ? 'Yes' : 'No'}  \n\n`;
    
    summary += `## Knowledge Structure\n\n`;
    summary += `This knowledge base follows Level ${agent.level} entity structure:\n\n`;
    
    Object.entries(kb.entities).forEach(([type, entities]) => {
      summary += `- **${type}**: ${entities.length} entities\n`;
    });

    summary += `\n## Recent Insights\n\n`;
    const recentInsights = kb.insights.slice(-5);
    recentInsights.forEach((insight, i) => {
      summary += `${i + 1}. ${insight}\n`;
    });

    summary += `\n## Understanding Summary\n\n`;
    summary += `${kb.understanding.summary}\n\n`;
    summary += `**Confidence Level:** ${kb.understanding.confidence_level}  \n\n`;

    if (kb.understanding.areas_of_uncertainty.length > 0) {
      summary += `### Areas of Uncertainty\n\n`;
      kb.understanding.areas_of_uncertainty.forEach(area => {
        summary += `- ${area}\n`;
      });
    }

    summary += `\n---\n\n`;
    summary += `*This knowledge base is automatically maintained and evolves with the repository.*\n`;

    return summary;
  }
}

export default AgentState;
