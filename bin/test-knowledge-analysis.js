#!/usr/bin/env node
/**
 * Test Knowledge Analysis (No Git)
 * Test the knowledge population system without Git complications
 */

import { AgentState } from '../src/agent-state.js';
import { CharacterSystem } from '../src/character-system.js';
import { ModelAdapter } from '../src/model-adapter.js';
import { analyzeRepository } from '../src/agent-update-workflow.js';
import chalk from 'chalk';

async function testKnowledgeAnalysis() {
  console.log(chalk.bold.magenta('\n🧠 TESTING KNOWLEDGE ANALYSIS\n'));

  try {
    // Load characters
    console.log('📋 Loading project-analysis characters...');
    const characterSystem = new CharacterSystem('./characters/project-analysis.json');
    await characterSystem.loadCharacters();
    console.log(chalk.green('✓ Characters loaded\n'));

    // Setup model adapter
    const modelAdapter = new ModelAdapter({
      openrouterKey: process.env.OPENROUTER_API_KEY,
      ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });

    // Test each agent
    const agents = ['architect', 'educator', 'visionary', 'philosopher'];
    
    for (const agentId of agents) {
      console.log(chalk.cyan(`\n${'='.repeat(80)}`));
      console.log(chalk.cyan(`Testing ${agentId.toUpperCase()} Analysis`));
      console.log(chalk.cyan('='.repeat(80)));

      const character = characterSystem.getCharacter(agentId);
      const agentState = new AgentState(agentId, './test-analysis-states');

      // Initialize with knowledge structure
      console.log(`\n1. Initializing ${character.name}...`);
      await agentState.initialize(character, {
        structure: ['src/', 'bin/', 'characters/'],
        keyFiles: ['package.json', 'src/index.js']
      });
      console.log(chalk.green(`   ✓ Initialized with Level ${character.level} knowledge structure`));

      // Show initial entity counts
      const initialCounts = Object.entries(agentState.state.knowledge.entities)
        .map(([type, entities]) => `${type}: ${entities.length}`)
        .join(', ');
      console.log(`   Initial entities: ${initialCounts}`);

      // Run analysis
      console.log(`\n2. Running repository analysis...`);
      try {
        await analyzeRepository(agentId, agentState, modelAdapter);
        console.log(chalk.green('   ✓ Analysis completed'));
      } catch (error) {
        console.log(chalk.yellow(`   ⚠️  Analysis failed: ${error.message}`));
        console.log(chalk.gray('   (This is expected if no AI model is available)'));
      }

      // Show final entity counts
      const finalCounts = Object.entries(agentState.state.knowledge.entities)
        .map(([type, entities]) => `${type}: ${entities.length}`)
        .join(', ');
      console.log(`   Final entities: ${finalCounts}`);

      // Export knowledge to see what was created
      console.log(`\n3. Exporting knowledge...`);
      await agentState.exportToBranch('./test-analysis-output');
      console.log(chalk.green('   ✓ Knowledge exported'));

      // Show what was created
      console.log(`\n4. Files created:`);
      const entityTypes = Object.keys(agentState.state.knowledge.entities);
      entityTypes.forEach(type => {
        const entities = agentState.state.knowledge.entities[type];
        if (entities.length > 0) {
          console.log(`   - ${type}.json (${entities.length} entities)`);
          console.log(`   - ${type}.md (human-readable)`);
        }
      });
      console.log(`   - knowledge-base.json (full knowledge)`);
      console.log(`   - README.md (summary)`);

      console.log(chalk.green(`\n✓ ${character.name} analysis completed`));
    }

    console.log(chalk.bold.green('\n' + '='.repeat(80)));
    console.log(chalk.bold.green('✅ KNOWLEDGE ANALYSIS TEST COMPLETE'));
    console.log(chalk.bold.green('='.repeat(80)));
    
    console.log(chalk.cyan('\n📂 Test output created in:'));
    console.log(chalk.gray('   - test-analysis-states/ (agent state files)'));
    console.log(chalk.gray('   - test-analysis-output/knowledge/ (exported knowledge)'));
    
    console.log(chalk.yellow('\n💡 Check the results:'));
    console.log(chalk.gray('   cat test-analysis-output/knowledge/architect/README.md'));
    console.log(chalk.gray('   cat test-analysis-output/knowledge/architect/components.md'));
    console.log(chalk.gray('   '));
    console.log(chalk.gray('   # Clean up:'));
    console.log(chalk.gray('   rm -rf test-analysis-states test-analysis-output\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Test failed:'), error.message);
    if (process.env.DEBUG) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

testKnowledgeAnalysis();
