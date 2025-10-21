/**
 * Consciousness Lab
 * Main exports
 */

export { ModelAdapter } from './model-adapter.js';
export { CharacterSystem } from './character-system.js';
export { DialogueEngine } from './dialogue-engine.js';
export { ExperimentOrchestrator } from './experiment-orchestrator.js';

/**
 * Quick start helper
 */
export async function createLab(config = {}) {
  const { ExperimentOrchestrator } = await import('./experiment-orchestrator.js');
  const orchestrator = new ExperimentOrchestrator(config);
  await orchestrator.initialize();
  return orchestrator;
}

export default {
  ModelAdapter,
  CharacterSystem,
  DialogueEngine,
  ExperimentOrchestrator,
  createLab
};

