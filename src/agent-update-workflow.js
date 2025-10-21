/**
 * Agent Update Workflow
 */
import { AgentState } from './agent-state.js';
import { GitHubIntegration } from './github-integration.js';
import { ModelAdapter } from './model-adapter.js';
import { CharacterSystem } from './character-system.js';
import { join } from 'path';

export async function runAgentUpdate(repoContext) {
  console.log('\n' + '='.repeat(80));
  console.log('AGENT UPDATE WORKFLOW');
  console.log('='.repeat(80));

  const agents = ['architect', 'educator', 'visionary', 'philosopher'];
  const github = new GitHubIntegration();
  const modelAdapter = new ModelAdapter({
    openrouterKey: process.env.OPENROUTER_API_KEY,
    ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434'
  });

  const characterSystem = new CharacterSystem(
    join(process.cwd(), 'characters', 'project-analysis.json')
  );
  await characterSystem.loadCharacters();

  for (const agentId of agents) {
    console.log(`\n📋 ${agentId.toUpperCase()} analyzing...`);
    const agentState = new AgentState(agentId);
    let loaded = await agentState.load();
    if (!loaded) {
      const character = characterSystem.getCharacter(agentId);
      await agentState.initialize(character, repoContext);
    }
    if (!agentState.hasRepoChanged(repoContext)) {
      console.log(`  ℹ️  No changes`);
      continue;
    }
    // Analysis would happen here with modelAdapter
    console.log(`  ✓ Updated`);
  }

  await github.pushAgentBranches();
  console.log('\n✅ AGENT UPDATE COMPLETE\n');
}

export default runAgentUpdate;
