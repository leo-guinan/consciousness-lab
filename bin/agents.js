#!/usr/bin/env node

/**
 * Agent Management CLI
 * Initialize and manage evolved agent system
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { GitHubIntegration } from '../src/github-integration.js';
import { AgentState } from '../src/agent-state.js';
import { runAgentUpdate } from '../src/agent-update-workflow.js';
import { CharacterSystem } from '../src/character-system.js';
import express from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';

const program = new Command();

// Get package version
const packageJson = JSON.parse(
  await readFile(join(process.cwd(), 'package.json'), 'utf-8')
);

program
  .name('clab agents')
  .description('Manage evolved agent system for living documentation')
  .version(packageJson.version);

/**
 * Initialize agent branches
 */
program
  .command('init')
  .description('Initialize agent branches in the repository')
  .action(async () => {
    console.log(chalk.bold.magenta('\n🤖 Initializing Agent System\n'));

    const spinner = ora('Creating agent branches...').start();

    try {
      const github = new GitHubIntegration();
      await github.initializeAgentBranches();

      spinner.succeed('Agent branches initialized');

      console.log(chalk.green('\n✅ Agent system ready!'));
      console.log(chalk.gray('\nAgent branches created:'));
      console.log(chalk.gray('  - agent/architect (Structure & Architecture)'));
      console.log(chalk.gray('  - agent/educator (Learning & Tutorials)'));
      console.log(chalk.gray('  - agent/visionary (Vision & Possibilities)'));
      console.log(chalk.gray('  - agent/philosopher (Philosophy & Principles)'));

      console.log(chalk.yellow('\n💡 Next steps:'));
      console.log(chalk.gray('  1. Run first-run analysis: node experiments/first-run.js'));
      console.log(chalk.gray('  2. Start webhook server: clab agents serve'));
      console.log(chalk.gray('  3. Configure GitHub webhook to point to your server\n'));

    } catch (error) {
      spinner.fail('Failed to initialize');
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Update agents manually
 */
program
  .command('update')
  .description('Manually trigger agent updates based on current repository state')
  .action(async () => {
    console.log(chalk.bold.magenta('\n🔄 Updating Agents\n'));

    const spinner = ora('Analyzing repository...').start();

    try {
      const github = new GitHubIntegration();
      const repoContext = await github.getRepoContext();

      spinner.text = 'Running agent analysis...';
      await runAgentUpdate(repoContext);

      spinner.succeed('Agents updated');
      console.log(chalk.green('\n✅ All agent branches updated with current understanding\n'));

    } catch (error) {
      spinner.fail('Update failed');
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Check agent status
 */
program
  .command('status')
  .description('Show status of all agents')
  .action(async () => {
    console.log(chalk.bold.magenta('\n🤖 Agent Status\n'));

    const agents = ['architect', 'educator', 'visionary', 'philosopher'];

    for (const agentId of agents) {
      const agentState = new AgentState(agentId);
      const loaded = await agentState.load();

      if (loaded) {
        const state = agentState.state;
        console.log(chalk.cyan(`\n${state.agent.name}:`));
        console.log(`  Level: ${state.agent.level} - ${state.agent.levelName}`);
        console.log(`  Evolved: ${state.agent.evolved ? chalk.green('Yes') : chalk.gray('No')}`);
        console.log(`  Insights: ${state.understanding.insights.length}`);
        console.log(`  Patterns: ${state.understanding.patterns.length}`);
        console.log(`  Transformations: ${state.evolution.transformations.length}`);
        console.log(`  Last update: ${new Date(state.metadata.lastModified).toLocaleString()}`);
      } else {
        console.log(chalk.gray(`\n${agentId}: Not initialized`));
      }
    }

    console.log();
  });

/**
 * Start webhook server
 */
program
  .command('serve')
  .description('Start webhook server to listen for GitHub pushes')
  .option('-p, --port <port>', 'Port to listen on', '3000')
  .action(async (options) => {
    console.log(chalk.bold.magenta('\n🌐 Starting Webhook Server\n'));

    const app = express();
    app.use(express.json());

    const github = new GitHubIntegration();
    const webhookHandler = github.createWebhookHandler();

    // Webhook endpoint
    app.post('/webhook', webhookHandler);

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', agents: ['architect', 'educator', 'visionary', 'philosopher'] });
    });

    // Manual trigger endpoint
    app.post('/update', async (req, res) => {
      res.json({ status: 'triggered', message: 'Agent update initiated' });
      
      try {
        const repoContext = await github.getRepoContext();
        await runAgentUpdate(repoContext);
      } catch (error) {
        console.error('Error during manual update:', error);
      }
    });

    const port = parseInt(options.port);
    app.listen(port, () => {
      console.log(chalk.green(`✓ Webhook server running on port ${port}`));
      console.log(chalk.gray(`\nEndpoints:`));
      console.log(chalk.gray(`  POST http://localhost:${port}/webhook - GitHub webhook`));
      console.log(chalk.gray(`  POST http://localhost:${port}/update - Manual trigger`));
      console.log(chalk.gray(`  GET  http://localhost:${port}/health - Health check`));

      if (!process.env.GITHUB_WEBHOOK_SECRET) {
        console.log(chalk.yellow('\n⚠️  Warning: GITHUB_WEBHOOK_SECRET not set'));
        console.log(chalk.gray('   Webhook signature verification disabled'));
      }

      console.log(chalk.cyan('\n📝 Configure GitHub webhook:'));
      console.log(chalk.gray(`   Payload URL: http://your-server:${port}/webhook`));
      console.log(chalk.gray('   Content type: application/json'));
      console.log(chalk.gray('   Events: push'));
      console.log(chalk.gray('   Secret: (set GITHUB_WEBHOOK_SECRET env var)\n'));

      console.log(chalk.green('🎧 Listening for repository changes...\n'));
    });
  });

/**
 * View agent documentation
 */
program
  .command('docs <agent>')
  .description('Generate and view agent documentation')
  .action(async (agent) => {
    const agentState = new AgentState(agent);
    const loaded = await agentState.load();

    if (!loaded) {
      console.log(chalk.red(`\n❌ Agent '${agent}' not initialized\n`));
      process.exit(1);
    }

    const docs = agentState.generateDocumentation();

    console.log(chalk.bold.magenta(`\n📚 ${agentState.state.agent.name}'s Documentation\n`));
    
    for (const [filename, content] of Object.entries(docs)) {
      console.log(chalk.cyan(`\n${'='.repeat(80)}`));
      console.log(chalk.cyan(`${filename}`));
      console.log(chalk.cyan('='.repeat(80)));
      console.log(content.substring(0, 500) + '...\n');
    }
  });

program.parse();

