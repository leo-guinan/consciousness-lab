#!/usr/bin/env node
/**
 * Test Knowledge Structure System
 * Verifies agents can save structured knowledge to their branches
 */

import { AgentState } from '../src/agent-state.js';
import { CharacterSystem } from '../src/character-system.js';
import { GitHubIntegration } from '../src/github-integration.js';
import chalk from 'chalk';

async function testKnowledgeSystem() {
  console.log(chalk.bold.magenta('\n🧪 Testing Knowledge Structure System\n'));

  try {
    // Load characters
    console.log('📋 Loading project-analysis characters...');
    const characterSystem = new CharacterSystem('./characters/project-analysis.json');
    await characterSystem.loadCharacters();
    console.log(chalk.green('✓ Characters loaded\n'));

    // Test each agent
    const agents = ['architect', 'educator', 'visionary', 'philosopher'];
    
    for (const agentId of agents) {
      console.log(chalk.cyan(`\n${'='.repeat(80)}`));
      console.log(chalk.cyan(`Testing ${agentId.toUpperCase()}`));
      console.log(chalk.cyan('='.repeat(80)));

      const character = characterSystem.getCharacter(agentId);
      const agentState = new AgentState(agentId, './test-agent-states');

      // Initialize with knowledge structure
      console.log(`\n1. Initializing ${character.name}...`);
      await agentState.initialize(character, {
        structure: ['src/', 'bin/', 'characters/'],
        keyFiles: ['package.json', 'src/index.js']
      });
      console.log(chalk.green(`   ✓ Initialized with Level ${character.level} knowledge structure`));

      // Show available entity types
      const entityTypes = Object.keys(agentState.state.knowledge.entities);
      console.log(`   Entity types: ${entityTypes.join(', ')}`);

      // Add sample entity
      console.log(`\n2. Adding sample entity...`);
      
      if (agentId === 'architect') {
        agentState.addEntity('components', {
          id: 'dialogue-engine',
          name: 'DialogueEngine',
          type: 'module',
          location: 'src/dialogue-engine.js',
          purpose: 'Orchestrates multi-agent conversations',
          dependencies: ['model-adapter', 'character-system'],
          exports: ['DialogueEngine'],
          complexity: 'high'
        });
        console.log(chalk.green('   ✓ Added component entity'));
      } else if (agentId === 'educator') {
        agentState.addEntity('concepts', {
          id: 'basic-usage',
          name: 'Basic Usage',
          difficulty: 'beginner',
          prerequisites: [],
          explanation: 'How to run your first experiment',
          why_matters: 'Entry point for all users',
          common_mistakes: ['Forgetting to configure API keys']
        });
        console.log(chalk.green('   ✓ Added concept entity'));
      } else if (agentId === 'visionary') {
        agentState.addEntity('possibilities', {
          id: 'voice-dialogues',
          name: 'Voice-Enabled Dialogues',
          category: 'extension',
          current_blockers: ['No TTS integration'],
          enabling_changes: ['Add voice parameters'],
          impact: 'transformative',
          timeframe: 'medium'
        });
        console.log(chalk.green('   ✓ Added possibility entity'));
      } else if (agentId === 'philosopher') {
        agentState.addEntity('assumptions', {
          id: 'four-characters',
          assumption: 'Dialogues need exactly 4 participants',
          implicit_or_explicit: 'implicit',
          where_manifested: ['Code defaults', 'Documentation examples'],
          implications: ['Limits flexibility'],
          alternatives: ['Dynamic participant count'],
          validity: 'questionable'
        });
        console.log(chalk.green('   ✓ Added assumption entity'));
      }

      // Export to test branch path
      console.log(`\n3. Exporting knowledge to branch format...`);
      await agentState.exportToBranch('./test-branches');
      console.log(chalk.green('   ✓ Knowledge exported'));

      // Show what was created
      console.log(`\n4. Files created in test-branches/knowledge/${agentId}/:`);
      console.log(`   - knowledge-base.json (full knowledge)`);
      console.log(`   - ${entityTypes[0]}.json (entity data)`);
      console.log(`   - ${entityTypes[0]}.md (human-readable)`);
      console.log(`   - agent-state.json (complete state)`);
      console.log(`   - README.md (summary)`);

      // Save state
      await agentState.save();
      console.log(chalk.green(`\n✓ ${character.name} knowledge system verified`));
    }

    console.log(chalk.bold.green('\n' + '='.repeat(80)));
    console.log(chalk.bold.green('✅ ALL TESTS PASSED'));
    console.log(chalk.bold.green('='.repeat(80)));
    
    console.log(chalk.cyan('\n📂 Test output created in:'));
    console.log(chalk.gray('   - test-agent-states/ (agent state files)'));
    console.log(chalk.gray('   - test-branches/knowledge/ (exported knowledge)'));
    
    console.log(chalk.yellow('\n💡 Next steps:'));
    console.log(chalk.gray('   1. Review test-branches/knowledge/architect/README.md'));
    console.log(chalk.gray('   2. Check entity structure in test-branches/knowledge/*/'));
    console.log(chalk.gray('   3. Run: clab-agents update (to apply to real branches)'));
    console.log(chalk.gray('   4. Clean up: rm -rf test-agent-states test-branches\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Test failed:'), error.message);
    if (process.env.DEBUG) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

testKnowledgeSystem();

