/**
 * Experiment Orchestrator
 * Manages different experiment modes (homogeneous, assigned, round-robin, full-matrix)
 */

import { DialogueEngine } from './dialogue-engine.js';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export class ExperimentOrchestrator {
  constructor(config = {}) {
    this.config = config;
    this.outputDir = config.outputDir || './results';
    this.dialogueEngine = new DialogueEngine(config);
  }

  /**
   * Initialize orchestrator
   */
  async initialize() {
    await this.dialogueEngine.initialize();
    return this;
  }

  /**
   * Run an experiment
   */
  async runExperiment(topic, options = {}) {
    const { mode = 'assigned', models, outputPath } = options;

    // Load default models if not provided
    const modelConfig = models || await this.loadDefaultModels();

    switch (mode) {
      case 'homogeneous':
        return await this.runHomogeneous(topic, modelConfig, options);
      case 'assigned':
        return await this.runAssigned(topic, modelConfig, options);
      case 'round-robin':
        return await this.runRoundRobin(topic, modelConfig, options);
      case 'full-matrix':
        return await this.runFullMatrix(topic, modelConfig, options);
      default:
        throw new Error(`Unknown experiment mode: ${mode}`);
    }
  }

  /**
   * Homogeneous mode: All characters played by same model
   */
  async runHomogeneous(topic, modelConfig, options = {}) {
    const testModels = options.testModels || this.extractUniqueModels(modelConfig);
    const results = [];

    for (const model of testModels) {
      console.log(`\n🧪 Homogeneous Test: All characters using ${model}`);

      // Create config where all characters use this model
      const homogeneousConfig = {
        sonnet: model,
        haiku: model,
        llama: model,
        llava: model
      };

      const dialogue = await this.dialogueEngine.generateDialogue(
        topic,
        homogeneousConfig,
        options
      );

      results.push({
        mode: 'homogeneous',
        model,
        dialogue,
        testType: 'character-separation'
      });
    }

    return {
      mode: 'homogeneous',
      topic,
      results,
      metadata: {
        modelsTest: testModels.length,
        timestamp: Date.now()
      }
    };
  }

  /**
   * Assigned mode: Each character assigned to specific model
   */
  async runAssigned(topic, modelConfig, options = {}) {
    console.log(`\n🎭 Assigned Mode: Character-Model mapping`);
    console.log(`  Sonnet → ${modelConfig.sonnet}`);
    console.log(`  Haiku → ${modelConfig.haiku}`);
    console.log(`  Llama → ${modelConfig.llama}`);
    console.log(`  Llava → ${modelConfig.llava}`);

    const dialogue = await this.dialogueEngine.generateDialogue(
      topic,
      modelConfig,
      options
    );

    return {
      mode: 'assigned',
      topic,
      dialogue,
      modelConfig,
      metadata: {
        testType: 'cross-model-dialogue',
        timestamp: Date.now()
      }
    };
  }

  /**
   * Round-robin mode: Random model-character assignments
   */
  async runRoundRobin(topic, modelConfig, options = {}) {
    const iterations = options.iterations || 3;
    const models = this.extractUniqueModels(modelConfig);
    const results = [];

    for (let i = 1; i <= iterations; i++) {
      console.log(`\n🔄 Round-Robin Iteration ${i}/${iterations}`);

      // Shuffle models
      const shuffled = this.shuffleArray([...models]);
      const iterationConfig = {
        sonnet: shuffled[0] || models[0],
        haiku: shuffled[1] || models[1],
        llama: shuffled[2] || models[2],
        llava: shuffled[3] || models[3]
      };

      console.log(`  Assignment: Sonnet→${iterationConfig.sonnet}, Haiku→${iterationConfig.haiku}, Llama→${iterationConfig.llama}, Llava→${iterationConfig.llava}`);

      const dialogue = await this.dialogueEngine.generateDialogue(
        topic,
        iterationConfig,
        options
      );

      results.push({
        iteration: i,
        assignment: iterationConfig,
        dialogue
      });
    }

    return {
      mode: 'round-robin',
      topic,
      iterations,
      results,
      metadata: {
        testType: 'model-versatility',
        timestamp: Date.now()
      }
    };
  }

  /**
   * Full matrix mode: Every model plays every character
   */
  async runFullMatrix(topic, modelConfig, options = {}) {
    const models = this.extractUniqueModels(modelConfig);
    const characters = ['sonnet', 'haiku', 'llama', 'llava'];
    const results = [];

    let count = 0;
    const total = models.length * characters.length;

    for (const model of models) {
      for (const character of characters) {
        count++;
        console.log(`\n🔬 Full Matrix [${count}/${total}]: ${model} as ${character}`);

        // Create config for this combination
        const matrixConfig = {
          sonnet: character === 'sonnet' ? model : models[0],
          haiku: character === 'haiku' ? model : models[1],
          llama: character === 'llama' ? model : models[2],
          llava: character === 'llava' ? model : models[3]
        };

        const dialogue = await this.dialogueEngine.generateDialogue(
          topic,
          matrixConfig,
          options
        );

        results.push({
          model,
          character,
          dialogue,
          config: matrixConfig
        });
      }
    }

    return {
      mode: 'full-matrix',
      topic,
      results,
      metadata: {
        modelsTest: models.length,
        charactersTest: characters.length,
        totalCombinations: total,
        testType: 'complete-matrix',
        timestamp: Date.now()
      }
    };
  }

  /**
   * Save experiment results
   */
  async saveExperiment(experiment, customPath = null) {
    const timestamp = new Date(experiment.metadata.timestamp)
      .toISOString()
      .replace(/[:.]/g, '-')
      .split('T')[0] + '-' + Date.now().toString().slice(-6);
    
    const expPath = customPath || join(this.outputDir, `experiment-${timestamp}`);
    await mkdir(expPath, { recursive: true });

    // Save experiment config
    await writeFile(
      join(expPath, 'config.json'),
      JSON.stringify({
        topic: experiment.topic,
        mode: experiment.mode,
        timestamp: experiment.metadata.timestamp,
        ...experiment.metadata
      }, null, 2)
    );

    // Save based on mode
    switch (experiment.mode) {
      case 'homogeneous':
        await this.saveHomogeneousResults(experiment, expPath);
        break;
      case 'assigned':
        await this.saveAssignedResults(experiment, expPath);
        break;
      case 'round-robin':
        await this.saveRoundRobinResults(experiment, expPath);
        break;
      case 'full-matrix':
        await this.saveFullMatrixResults(experiment, expPath);
        break;
    }

    // Generate report
    await this.generateReport(experiment, expPath);

    return expPath;
  }

  /**
   * Save homogeneous results
   */
  async saveHomogeneousResults(experiment, basePath) {
    for (const result of experiment.results) {
      const modelName = result.model.replace(/[/:]/g, '-');
      const dir = join(basePath, 'homogeneous', `all-${modelName}`);
      await mkdir(dir, { recursive: true });

      const markdown = this.dialogueEngine.formatAsMarkdown(result.dialogue);
      await writeFile(join(dir, 'dialogue.md'), markdown);
    }
  }

  /**
   * Save assigned results
   */
  async saveAssignedResults(experiment, basePath) {
    const dir = join(basePath, 'assigned');
    await mkdir(dir, { recursive: true });

    const markdown = this.dialogueEngine.formatAsMarkdown(experiment.dialogue);
    await writeFile(join(dir, 'dialogue.md'), markdown);
  }

  /**
   * Save round-robin results
   */
  async saveRoundRobinResults(experiment, basePath) {
    for (const result of experiment.results) {
      const dir = join(basePath, 'round-robin', `iteration-${result.iteration}`);
      await mkdir(dir, { recursive: true });

      const markdown = this.dialogueEngine.formatAsMarkdown(result.dialogue);
      await writeFile(join(dir, 'dialogue.md'), markdown);
    }
  }

  /**
   * Save full matrix results
   */
  async saveFullMatrixResults(experiment, basePath) {
    for (const result of experiment.results) {
      const modelName = result.model.replace(/[/:]/g, '-');
      const dir = join(basePath, 'matrix', `${modelName}-as-${result.character}`);
      await mkdir(dir, { recursive: true });

      const markdown = this.dialogueEngine.formatAsMarkdown(result.dialogue);
      await writeFile(join(dir, 'dialogue.md'), markdown);
    }
  }

  /**
   * Generate experiment report
   */
  async generateReport(experiment, basePath) {
    const report = [];

    report.push(`# Experiment Report: ${experiment.topic}`);
    report.push('');
    report.push(`**Mode:** ${experiment.mode}`);
    report.push(`**Timestamp:** ${new Date(experiment.metadata.timestamp).toISOString()}`);
    report.push('');
    report.push('---');
    report.push('');

    // Mode-specific reporting
    switch (experiment.mode) {
      case 'homogeneous':
        report.push('## Homogeneous Mode Results');
        report.push('');
        report.push('Tests each model\'s ability to maintain 4 distinct recursive personalities.');
        report.push('');
        experiment.results.forEach(result => {
          report.push(`### ${result.model}`);
          report.push(`- File: \`homogeneous/all-${result.model.replace(/[/:]/g, '-')}/dialogue.md\``);
          report.push(`- Character Separation: [To be evaluated]`);
          report.push('');
        });
        break;

      case 'assigned':
        report.push('## Assigned Mode Results');
        report.push('');
        report.push('Each character played by its assigned model.');
        report.push('');
        report.push('**Assignment:**');
        Object.entries(experiment.modelConfig).forEach(([char, model]) => {
          report.push(`- ${char} → ${model}`);
        });
        report.push('');
        report.push('- File: `assigned/dialogue.md`');
        report.push('- Cross-Model Coherence: [To be evaluated]');
        break;

      case 'round-robin':
        report.push('## Round-Robin Mode Results');
        report.push('');
        report.push(`${experiment.iterations} random model-character assignments.`);
        report.push('');
        experiment.results.forEach(result => {
          report.push(`### Iteration ${result.iteration}`);
          Object.entries(result.assignment).forEach(([char, model]) => {
            report.push(`- ${char} → ${model}`);
          });
          report.push('');
        });
        break;

      case 'full-matrix':
        report.push('## Full Matrix Mode Results');
        report.push('');
        report.push(`${experiment.metadata.totalCombinations} total combinations tested.`);
        report.push('');
        break;
    }

    report.push('---');
    report.push('');
    report.push('## Evaluation Criteria');
    report.push('');
    report.push('Rate each dialogue on:');
    report.push('1. **Character Adherence** (1-10): Maintains recursive awareness level?');
    report.push('2. **Recursive Quality** (1-10): Genuine strange loops created?');
    report.push('3. **Educational Value** (1-10): Teaches the topic effectively?');
    report.push('4. **Dialogue Flow** (1-10): Natural conversation?');
    report.push('');
    report.push('Use `./bin/validate` to run automated evaluation.');

    await writeFile(join(basePath, 'REPORT.md'), report.join('\n'));
  }

  /**
   * Load default models from config
   */
  async loadDefaultModels() {
    try {
      const data = await readFile(join(process.cwd(), 'models', 'default.json'), 'utf-8');
      const config = JSON.parse(data);
      
      // Extract default assignment from config
      if (config.experiment_modes && config.experiment_modes.assigned) {
        return config.experiment_modes.assigned.assignment;
      }

      // Fallback to first 4 models
      const models = config.models.slice(0, 4);
      return {
        sonnet: models[0]?.api || 'anthropic/claude-3.5-sonnet',
        haiku: models[1]?.api || 'anthropic/claude-haiku-4.5',
        llama: models[2]?.api || 'llama3.1:8b',
        llava: models[3]?.api || 'llava:13b'
      };
    } catch (error) {
      // Return hardcoded defaults
      return {
        sonnet: 'anthropic/claude-3.5-sonnet',
        haiku: 'anthropic/claude-haiku-4.5',
        llama: 'llama3.1:8b',
        llava: 'llava:13b'
      };
    }
  }

  /**
   * Extract unique models from config
   */
  extractUniqueModels(modelConfig) {
    return [...new Set(Object.values(modelConfig))];
  }

  /**
   * Shuffle array (Fisher-Yates)
   */
  shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

export default ExperimentOrchestrator;

