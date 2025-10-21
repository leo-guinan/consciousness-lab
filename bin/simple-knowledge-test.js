#!/usr/bin/env node
/**
 * Simple Knowledge Test
 * Test knowledge structure without complex analysis
 */

import { AgentState } from '../src/agent-state.js';
import { CharacterSystem } from '../src/character-system.js';
import chalk from 'chalk';

async function testKnowledgeStructure() {
  console.log(chalk.bold.magenta('\n🧠 TESTING KNOWLEDGE STRUCTURE\n'));

  try {
    // Load characters
    console.log('📋 Loading project-analysis characters...');
    const characterSystem = new CharacterSystem('./characters/project-analysis.json');
    await characterSystem.loadCharacters();
    console.log(chalk.green('✓ Characters loaded\n'));

    // Test each agent
    const agents = ['architect', 'educator', 'visionary', 'philosopher'];
    
    for (const agentId of agents) {
      console.log(chalk.cyan(`\n${'='.repeat(60)}`));
      console.log(chalk.cyan(`Testing ${agentId.toUpperCase()}`));
      console.log(chalk.cyan('='.repeat(60)));

      const character = characterSystem.getCharacter(agentId);
      const agentState = new AgentState(agentId, './test-simple-states');

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

      // Add sample entities based on agent type
      console.log(`\n2. Adding sample entities...`);
      
      if (agentId === 'architect') {
        // Add components
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
        
        agentState.addEntity('components', {
          id: 'model-adapter',
          name: 'ModelAdapter',
          type: 'class',
          location: 'src/model-adapter.js',
          purpose: 'Universal interface for AI models',
          dependencies: ['axios'],
          exports: ['ModelAdapter'],
          complexity: 'medium'
        });

        // Add interfaces
        agentState.addEntity('interfaces', {
          id: 'create-lab-api',
          name: 'createLab',
          type: 'api',
          inputs: [{'name': 'config', 'type': 'object'}],
          outputs: [{'type': 'Promise<ExperimentOrchestrator>'}],
          usage_pattern: 'const lab = await createLab({ charactersPath: "..." })',
          stability: 'stable'
        });

        // Add patterns
        agentState.addEntity('patterns', {
          name: 'Event-Driven Architecture',
          category: 'architectural',
          occurrences: ['dialogue-engine.js', 'experiment-orchestrator.js'],
          implications: 'Enables real-time updates and extensibility',
          recommendations: 'Consider standardizing event naming'
        });

        console.log(chalk.green('   ✓ Added 4 architect entities (components, interfaces, patterns)'));

      } else if (agentId === 'educator') {
        // Add concepts
        agentState.addEntity('concepts', {
          id: 'basic-usage',
          name: 'Basic Usage',
          difficulty: 'beginner',
          prerequisites: [],
          explanation: 'How to run your first experiment with consciousness-lab',
          why_matters: 'Entry point for all users',
          common_mistakes: ['Forgetting to configure API keys', 'Not understanding character roles']
        });

        agentState.addEntity('concepts', {
          id: 'custom-characters',
          name: 'Custom Character Creation',
          difficulty: 'intermediate',
          prerequisites: ['basic-usage'],
          explanation: 'Creating domain-specific character personalities',
          why_matters: 'Enables adapting the tool to any domain',
          common_mistakes: ['Mismatched character IDs', 'Invalid schema structure']
        });

        // Add learning paths
        agentState.addEntity('learning_paths', {
          id: 'beginner-path',
          name: 'Getting Started with Consciousness Lab',
          target_audience: 'Developers new to multi-agent systems',
          concepts: ['basic-usage', 'default-characters', 'running-experiments'],
          sequence: [
            {'step': 1, 'action': 'Install and setup', 'duration': '5 min'},
            {'step': 2, 'action': 'Run first experiment', 'duration': '10 min'},
            {'step': 3, 'action': 'Understand output', 'duration': '15 min'}
          ],
          estimated_time: '30 minutes',
          checkpoints: ['Can run basic experiment', 'Can interpret results']
        });

        // Add examples
        agentState.addEntity('examples', {
          id: 'basic-experiment',
          concept: 'basic-usage',
          code: 'const lab = await createLab();\nawait lab.runExperiment("What is consciousness?");',
          explanation: 'Simplest possible experiment with default settings',
          common_variations: [
            'With custom output directory',
            'With specific models',
            'With custom characters'
          ],
          related_concepts: ['model-selection', 'output-formats']
        });

        console.log(chalk.green('   ✓ Added 4 educator entities (concepts, learning paths, examples)'));

      } else if (agentId === 'visionary') {
        // Add possibilities
        agentState.addEntity('possibilities', {
          id: 'voice-dialogues',
          name: 'Voice-Enabled Character Dialogues',
          category: 'extension',
          current_blockers: ['No TTS integration', 'Character voices not defined'],
          enabling_changes: ['Integrate TTS API', 'Add voice parameters to character schema'],
          impact: 'transformative',
          timeframe: 'medium'
        });

        agentState.addEntity('possibilities', {
          id: 'real-time-collaboration',
          name: 'Real-Time Multi-User Experiments',
          category: 'feature',
          current_blockers: ['No WebSocket support', 'No user management'],
          enabling_changes: ['Add WebSocket server', 'Implement user authentication'],
          impact: 'high',
          timeframe: 'long'
        });

        // Add compositions
        agentState.addEntity('compositions', {
          id: 'adaptive-docs',
          name: 'Self-Updating Documentation System',
          components: ['dialogue-engine', 'character-system', 'github-integration'],
          emergent_properties: [
            'Documentation that evolves with code',
            'Multiple perspective documentation',
            'Living institutional knowledge'
          ],
          use_cases: [
            'Auto-maintained project docs',
            'Onboarding materials',
            'Architecture decision records'
          ],
          implementation_sketch: 'Combine dialogue system with Git hooks to generate docs from agent perspectives'
        });

        console.log(chalk.green('   ✓ Added 3 visionary entities (possibilities, compositions)'));

      } else if (agentId === 'philosopher') {
        // Add assumptions
        agentState.addEntity('assumptions', {
          id: 'four-characters',
          assumption: 'Dialogues work best with exactly 4 characters',
          implicit_or_explicit: 'implicit',
          where_manifested: ['Code defaults', 'Documentation examples'],
          implications: ['Limits flexibility', 'Users may not realize they can customize'],
          alternatives: ['Dynamic character count', 'Configurable dialogue sizes'],
          validity: 'questionable'
        });

        agentState.addEntity('assumptions', {
          id: 'consciousness-focus',
          assumption: 'Tool is specifically for consciousness research',
          implicit_or_explicit: 'explicit',
          where_manifested: ['Package name', 'Default character themes'],
          implications: ['Limits broader adoption', 'Narrows use cases'],
          alternatives: ['Domain-agnostic positioning', 'Multiple domain examples'],
          validity: 'limiting'
        });

        // Add principles
        agentState.addEntity('principles', {
          id: 'multi-perspective-depth',
          principle: 'Different recursion levels produce different insights',
          category: 'interaction',
          embodiment: [
            'Character system with 4 distinct awareness levels',
            'Each agent analyzes from unique depth',
            'Insights compound through debate'
          ],
          violations: [],
          rationale: 'Understanding emerges from perspective diversity, not single viewpoint analysis',
          tradeoffs: [
            'More complex than single-agent',
            'Requires managing multiple perspectives',
            'Higher cognitive load for users'
          ]
        });

        // Add meta-patterns
        agentState.addEntity('meta_patterns', {
          id: 'self-analysis-loop',
          pattern: 'Tool analyzing its own design using its own mechanisms',
          recursion_level: 2,
          self_reference: true,
          implications: [
            'Tool can improve itself',
            'Understanding of analysis deepens through self-application',
            'Reveals hidden assumptions through recursion'
          ],
          emergence: 'Agents evolve by debating the tool that enables their debate'
        });

        console.log(chalk.green('   ✓ Added 4 philosopher entities (assumptions, principles, meta-patterns)'));
      }

      // Export knowledge to see what was created
      console.log(`\n3. Exporting knowledge...`);
      await agentState.exportToBranch('./test-simple-output');
      console.log(chalk.green('   ✓ Knowledge exported'));

      // Show what was created
      console.log(`\n4. Files created:`);
      const entityTypeList = Object.keys(agentState.state.knowledge.entities);
      entityTypeList.forEach(type => {
        const entities = agentState.state.knowledge.entities[type];
        if (entities.length > 0) {
          console.log(`   - ${type}.json (${entities.length} entities)`);
          console.log(`   - ${type}.md (human-readable)`);
        }
      });
      console.log(`   - knowledge-base.json (full knowledge)`);
      console.log(`   - README.md (summary)`);

      console.log(chalk.green(`\n✓ ${character.name} knowledge populated`));
    }

    console.log(chalk.bold.green('\n' + '='.repeat(80)));
    console.log(chalk.bold.green('✅ KNOWLEDGE STRUCTURE TEST COMPLETE'));
    console.log(chalk.bold.green('='.repeat(80)));
    
    console.log(chalk.cyan('\n📂 Test output created in:'));
    console.log(chalk.gray('   - test-simple-states/ (agent state files)'));
    console.log(chalk.gray('   - test-simple-output/knowledge/ (exported knowledge)'));
    
    console.log(chalk.yellow('\n💡 Check the results:'));
    console.log(chalk.gray('   cat test-simple-output/knowledge/architect/README.md'));
    console.log(chalk.gray('   cat test-simple-output/knowledge/architect/components.md'));
    console.log(chalk.gray('   cat test-simple-output/knowledge/educator/concepts.md'));
    console.log(chalk.gray('   cat test-simple-output/knowledge/visionary/possibilities.md'));
    console.log(chalk.gray('   cat test-simple-output/knowledge/philosopher/assumptions.md'));
    console.log(chalk.gray('   '));
    console.log(chalk.gray('   # Clean up:'));
    console.log(chalk.gray('   rm -rf test-simple-states test-simple-output\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Test failed:'), error.message);
    if (process.env.DEBUG) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

testKnowledgeStructure();
