/**
 * Agent Update Workflow
 */
import { AgentState } from './agent-state.js';
import { GitHubIntegration } from './github-integration.js';
import { ModelAdapter } from './model-adapter.js';
import { CharacterSystem } from './character-system.js';
import { readFile, readdir, stat } from 'fs/promises';
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
    
    // Always analyze to populate knowledge base
    await analyzeRepository(agentId, agentState, modelAdapter);
    
    // Update agent branch with new knowledge
    await github.updateAgentBranch(agentId, agentState);
    console.log(`  ✓ ${agentId} knowledge updated`);
  }

  await github.pushAgentBranches();
  console.log('\n✅ AGENT UPDATE COMPLETE\n');
}

async function analyzeRepository(agentId, agentState, modelAdapter) {
  console.log(`\n🔍 ${agentId} analyzing repository structure...`);
  
  const agent = agentState.state.agent;
  
  // Get repository structure
  const repoStructure = await getRepositoryStructure();
  
  // Create analysis prompt based on agent level
  let analysisPrompt = `As ${agent.name} (Level ${agent.level} - ${agent.levelName}), analyze this repository:

Repository structure:
${JSON.stringify(repoStructure, null, 2)}

Your current knowledge base has these entity types: ${Object.keys(agentState.state.knowledge.entities).join(', ')}

Please analyze the repository and populate your knowledge base with relevant entities. For each entity you identify, provide it in this exact format:

ENTITY_TYPE: entity_name
{
  "id": "unique_id",
  "name": "Entity Name",
  // ... other fields based on your entity schema
}

Focus on your Level ${agent.level} perspective:`;

  if (agent.level === 1) {
    analysisPrompt += `
- COMPONENTS: modules, classes, functions, files
- INTERFACES: APIs, contracts, interaction points  
- DEPENDENCIES: relationships between components
- PATTERNS: recurring structural patterns

Look for: file structure, imports, exports, function calls, architectural patterns`;
  } else if (agent.level === 2) {
    analysisPrompt += `
- CONCEPTS: knowledge units users need to understand
- LEARNING_PATHS: structured progressions for different users
- EXAMPLES: practical code examples
- QUESTIONS: FAQ and common user questions

Look for: user-facing features, documentation gaps, learning curves, common use cases`;
  } else if (agent.level === 3) {
    analysisPrompt += `
- POSSIBILITIES: potential features, extensions, adaptations
- COMPOSITIONS: ways components could combine
- EVOLUTIONS: how project could transform
- CONNECTIONS: relationships between possibilities

Look for: extensibility points, feature combinations, future potential, emergent properties`;
  } else if (agent.level === 4) {
    analysisPrompt += `
- ASSUMPTIONS: underlying design assumptions
- PRINCIPLES: core design principles
- META_PATTERNS: recursive patterns
- PARADOXES: productive tensions
- DESIGN_DECISIONS: key choices and rationale

Look for: philosophical commitments, recursive structures, value judgments, meta-cognitive patterns`;
  }

  analysisPrompt += `

Provide 5-10 entities that represent your understanding of this repository. Be specific and detailed.`;

  try {
    const response = await modelAdapter.call(
      modelAdapter.defaultModel,
      analysisPrompt
    );

    // Parse entities from response
    await parseAndAddEntities(agentState, response.text);
    
    // Update understanding summary
    agentState.state.knowledge.understanding.summary = `Analyzed repository with ${Object.values(agentState.state.knowledge.entities).flat().length} total entities`;
    agentState.state.knowledge.understanding.confidence_level = 'medium';
    
    await agentState.save();
    
  } catch (error) {
    console.log(`  ⚠️  Analysis failed: ${error.message}`);
  }
}

async function getRepositoryStructure() {
  const structure = {
    files: [],
    directories: [],
    packageInfo: null
  };
  
  try {
    // Read package.json
    const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
    structure.packageInfo = {
      name: packageJson.name,
      description: packageJson.description,
      main: packageJson.main,
      scripts: packageJson.scripts,
      dependencies: Object.keys(packageJson.dependencies || {}),
      devDependencies: Object.keys(packageJson.devDependencies || {})
    };
  } catch (error) {
    console.log('  ⚠️  Could not read package.json');
  }
  
  // Get file structure
  const files = await getFilesRecursively('.', ['.git', 'node_modules', '.agent-states', 'test-*']);
  structure.files = files.slice(0, 50); // Limit to avoid huge prompts
  
  return structure;
}

async function getFilesRecursively(dir, ignoreDirs = []) {
  const files = [];
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        if (!ignoreDirs.some(ignore => fullPath.includes(ignore))) {
          files.push(...(await getFilesRecursively(fullPath, ignoreDirs)));
        }
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore permission errors
  }
  
  return files;
}

async function parseAndAddEntities(agentState, responseText) {
  // Look for entity patterns in the response
  const entityPattern = /(\w+):\s*([^\n]+)\s*\n\s*\{([^}]+)\}/g;
  let match;
  let addedCount = 0;
  
  while ((match = entityPattern.exec(responseText)) !== null) {
    try {
      const entityType = match[1].toLowerCase();
      const entityName = match[2].trim();
      const entityDataStr = `{${match[3]}}`;
      
      // Try to parse the JSON
      const entityData = JSON.parse(entityDataStr);
      
      // Add required fields if missing
      if (!entityData.id) entityData.id = entityName.toLowerCase().replace(/\s+/g, '-');
      if (!entityData.name) entityData.name = entityName;
      
      agentState.addEntity(entityType, entityData);
      addedCount++;
      console.log(`  📝 Added ${entityType}: ${entityName}`);
      
    } catch (error) {
      console.log(`  ⚠️  Could not parse entity: ${error.message}`);
    }
  }
  
  if (addedCount === 0) {
    console.log(`  ℹ️  No structured entities found, adding basic entities...`);
    
    // Add some basic entities based on agent type
    const agent = agentState.state.agent;
    
    if (agent.level === 1) {
      agentState.addEntity('components', {
        id: 'main-entry',
        name: 'Main Entry Point',
        type: 'file',
        location: 'src/index.js',
        purpose: 'Main library entry point',
        complexity: 'medium'
      });
    } else if (agent.level === 2) {
      agentState.addEntity('concepts', {
        id: 'basic-usage',
        name: 'Basic Usage',
        difficulty: 'beginner',
        explanation: 'How to get started with the library',
        why_matters: 'Entry point for all users'
      });
    } else if (agent.level === 3) {
      agentState.addEntity('possibilities', {
        id: 'custom-characters',
        name: 'Custom Character System',
        category: 'extension',
        impact: 'high',
        timeframe: 'short'
      });
    } else if (agent.level === 4) {
      agentState.addEntity('assumptions', {
        id: 'consciousness-focus',
        assumption: 'Tool is specifically for consciousness research',
        implicit_or_explicit: 'explicit',
        validity: 'questionable'
      });
    }
  }
}

export default runAgentUpdate;
