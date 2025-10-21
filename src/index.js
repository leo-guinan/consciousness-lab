/**
 * Consciousness Lab
 * Main exports
 */

import { ModelAdapter } from './model-adapter.js';
import { CharacterSystem } from './character-system.js';
import { DialogueEngine } from './dialogue-engine.js';
import { ExperimentOrchestrator } from './experiment-orchestrator.js';

export { ModelAdapter, CharacterSystem, DialogueEngine, ExperimentOrchestrator };

/**
 * Quick start helper
 */
export async function createLab(config = {}) {
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

