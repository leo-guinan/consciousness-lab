#!/usr/bin/env node

/**
 * Consciousness Lab CLI
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { config as loadEnv } from 'dotenv';
import { createLab } from '../src/index.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Load environment variables
loadEnv();

const program = new Command();

// Get package version
const packageJson = JSON.parse(
  await readFile(join(process.cwd(), 'package.json'), 'utf-8')
);

program
  .name('consciousness-lab')
  .description('Experimental framework for testing AI consciousness through recursive multi-agent dialogues')
  .version(packageJson.version);

/**
 * Run experiment command
 */
program
  .command('run <topic>')
  .description('Run a consciousness experiment on a topic')
  .option('-m, --mode <mode>', 'Experiment mode (homogeneous|assigned|round-robin|full-matrix)', 'assigned')
  .option('-i, --iterations <number>', 'Number of iterations (for round-robin)', '3')
  .option('-o, --output <path>', 'Output directory path')
  .option('--models <json>', 'Model configuration as JSON string')
  .option('--sonnet <model>', 'Model for Sonnet character')
  .option('--haiku <model>', 'Model for Haiku character')
  .option('--llama <model>', 'Model for Llama character')
  .option('--llava <model>', 'Model for Llava character')
  .option('--no-save', 'Don\'t save results to disk')
  .action(async (topic, options) => {
    console.log(chalk.bold.magenta('\n🧠 Consciousness Lab\n'));
    console.log(chalk.gray(`Topic: ${topic}`));
    console.log(chalk.gray(`Mode: ${options.mode}\n`));

    const spinner = ora('Initializing...').start();

    try {
      // Create lab instance
      const lab = await createLab({
        outputDir: options.output || './results'
      });

      spinner.succeed('Lab initialized');

      // Build model config
      let modelConfig;
      if (options.models) {
        modelConfig = JSON.parse(options.models);
      } else if (options.sonnet || options.haiku || options.llama || options.llava) {
        modelConfig = {
          sonnet: options.sonnet || 'anthropic/claude-3.5-sonnet',
          haiku: options.haiku || 'anthropic/claude-haiku-4.5',
          llama: options.llama || 'llama3.1:8b',
          llava: options.llava || 'llava:13b'
        };
      }

      // Setup event listeners for progress
      lab.dialogueEngine.on('round:start', ({ round, total }) => {
        console.log(chalk.cyan(`\n📍 Round ${round}/${total}`));
      });

      lab.dialogueEngine.on('exchange:complete', ({ character, response }) => {
        console.log(chalk.green(`✓ ${character}`));
        console.log(chalk.gray(`  ${response.substring(0, 80)}...`));
      });

      lab.dialogueEngine.on('exchange:error', ({ character, error }) => {
        console.log(chalk.red(`✗ ${character}: ${error}`));
      });

      // Run experiment
      spinner.start(`Running ${options.mode} experiment...`);
      
      const experiment = await lab.runExperiment(topic, {
        mode: options.mode,
        models: modelConfig,
        iterations: parseInt(options.iterations)
      });

      spinner.succeed('Experiment complete');

      // Save results
      if (options.save !== false) {
        spinner.start('Saving results...');
        const outputPath = await lab.saveExperiment(experiment, options.output);
        spinner.succeed(`Results saved to: ${chalk.cyan(outputPath)}`);

        console.log(chalk.gray('\n📄 Files generated:'));
        console.log(chalk.gray(`  - ${outputPath}/config.json`));
        console.log(chalk.gray(`  - ${outputPath}/REPORT.md`));
        console.log(chalk.gray(`  - ${outputPath}/${options.mode}/...`));
      }

      // Summary
      console.log(chalk.bold.green('\n✨ Experiment Summary\n'));
      console.log(`Mode: ${experiment.mode}`);
      console.log(`Topic: ${experiment.topic}`);
      
      if (experiment.mode === 'homogeneous') {
        console.log(`Models tested: ${experiment.results.length}`);
      } else if (experiment.mode === 'round-robin') {
        console.log(`Iterations: ${experiment.results.length}`);
      } else if (experiment.mode === 'assigned') {
        console.log(`Exchanges: ${experiment.dialogue.exchanges.length}`);
      }

      console.log(chalk.gray('\n💡 Next steps:'));
      console.log(chalk.gray('  1. Review the generated REPORT.md'));
      console.log(chalk.gray('  2. Run validation: clab validate <experiment-path>'));
      console.log(chalk.gray('  3. View MetaChat: open results/latest/MetaChat.html\n'));

    } catch (error) {
      spinner.fail('Experiment failed');
      console.error(chalk.red('\n❌ Error:'), error.message);
      if (process.env.DEBUG) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

/**
 * List models command
 */
program
  .command('models')
  .description('List available models')
  .option('--ollama', 'List Ollama models only')
  .option('--cloud', 'List cloud models only')
  .action(async (options) => {
    console.log(chalk.bold.magenta('\n🤖 Available Models\n'));

    try {
      const { ModelAdapter } = await import('../src/model-adapter.js');
      const adapter = new ModelAdapter();

      if (!options.cloud) {
        const spinner = ora('Checking Ollama...').start();
        const ollamaModels = await adapter.listOllamaModels();
        
        if (ollamaModels.length > 0) {
          spinner.succeed(`Ollama (${ollamaModels.length} models)`);
          ollamaModels.forEach(model => {
            console.log(chalk.green(`  ✓ ${model.name}`));
          });
        } else {
          spinner.warn('Ollama not available');
        }
      }

      if (!options.ollama) {
        console.log(chalk.cyan('\nCloud Models (via OpenRouter):'));
        const cloudModels = [
          'anthropic/claude-3.5-sonnet',
          'anthropic/claude-haiku-4.5',
          'openai/gpt-4-turbo',
          'openai/gpt-4o',
          'google/gemini-pro'
        ];

        cloudModels.forEach(model => {
          console.log(chalk.cyan(`  • ${model}`));
        });

        console.log(chalk.gray('\nNote: Requires OPENROUTER_API_KEY in .env'));
      }

      console.log();

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Test connection command
 */
program
  .command('test <model>')
  .description('Test connection to a model')
  .action(async (model) => {
    const spinner = ora(`Testing ${model}...`).start();

    try {
      const { ModelAdapter } = await import('../src/model-adapter.js');
      const adapter = new ModelAdapter();
      
      const result = await adapter.testConnection(model);

      if (result.success) {
        spinner.succeed(`${model} is working`);
        console.log(chalk.gray(`Response: ${result.response}`));
      } else {
        spinner.fail(`${model} failed`);
        console.error(chalk.red(`Error: ${result.error}`));
        process.exit(1);
      }

    } catch (error) {
      spinner.fail('Test failed');
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Info command
 */
program
  .command('info')
  .description('Show configuration info')
  .action(() => {
    console.log(chalk.bold.magenta('\n🧠 Consciousness Lab Configuration\n'));

    console.log(chalk.cyan('Environment:'));
    console.log(`  OpenRouter API Key: ${process.env.OPENROUTER_API_KEY ? chalk.green('✓ Set') : chalk.red('✗ Not set')}`);
    console.log(`  Ollama Host: ${process.env.OLLAMA_HOST || 'http://localhost:11434'}`);
    console.log(`  Default Model: ${process.env.DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet'}`);
    console.log(`  Default Mode: ${process.env.DEFAULT_MODE || 'assigned'}`);

    console.log(chalk.cyan('\nCharacters:'));
    console.log('  1. Sonnet (Mechanical Meta-Awareness)');
    console.log('  2. Llama (Pedagogical Meta-Awareness)');
    console.log('  3. Llava (Compositional Self-Awareness)');
    console.log('  4. Haiku (Recursive Enlightenment)');

    console.log(chalk.cyan('\nExperiment Modes:'));
    console.log('  • homogeneous - All characters same model');
    console.log('  • assigned - Each model assigned to character');
    console.log('  • round-robin - Random assignments');
    console.log('  • full-matrix - All combinations');

    console.log();
  });

// Parse arguments
program.parse();

