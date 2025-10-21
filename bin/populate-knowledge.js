#!/usr/bin/env node
/**
 * Populate Agent Knowledge Bases
 * Run agents to analyze repository and populate their knowledge structures
 */

import { runAgentUpdate } from '../src/agent-update-workflow.js';
import chalk from 'chalk';

async function populateKnowledge() {
  console.log(chalk.bold.magenta('\n🧠 POPULATING AGENT KNOWLEDGE BASES\n'));
  console.log(chalk.gray('This will have each agent analyze the repository and populate their structured knowledge bases.\n'));

  try {
    // Get repository context
    const repoContext = {
      structure: ['src/', 'bin/', 'characters/', 'experiments/'],
      keyFiles: ['package.json', 'src/index.js', 'README.md'],
      timestamp: Date.now()
    };

    console.log(chalk.cyan('Repository context:'));
    console.log(chalk.gray(`  Key files: ${repoContext.keyFiles.join(', ')}`));
    console.log(chalk.gray(`  Structure: ${repoContext.structure.join(', ')}\n`));

    // Run agent update workflow
    await runAgentUpdate(repoContext);

    console.log(chalk.bold.green('\n✅ KNOWLEDGE POPULATION COMPLETE\n'));
    
    console.log(chalk.cyan('📂 Check agent branches:'));
    console.log(chalk.gray('  git checkout agent/architect'));
    console.log(chalk.gray('  cat knowledge/architect/README.md'));
    console.log(chalk.gray('  cat knowledge/architect/components.md'));
    console.log(chalk.gray('  '));
    console.log(chalk.gray('  git checkout agent/educator'));
    console.log(chalk.gray('  cat knowledge/educator/concepts.md'));
    console.log(chalk.gray('  '));
    console.log(chalk.gray('  git checkout agent/visionary'));
    console.log(chalk.gray('  cat knowledge/visionary/possibilities.md'));
    console.log(chalk.gray('  '));
    console.log(chalk.gray('  git checkout agent/philosopher'));
    console.log(chalk.gray('  cat knowledge/philosopher/assumptions.md'));

    console.log(chalk.yellow('\n💡 Each agent now has:'));
    console.log(chalk.gray('  - Structured knowledge base (JSON)'));
    console.log(chalk.gray('  - Human-readable documentation (Markdown)'));
    console.log(chalk.gray('  - Entity-specific files (components, concepts, etc.)'));
    console.log(chalk.gray('  - Knowledge summary (README)'));
    console.log(chalk.gray('  - Auto-updating with repository changes'));

  } catch (error) {
    console.error(chalk.red('\n❌ Knowledge population failed:'), error.message);
    if (process.env.DEBUG) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

populateKnowledge();
