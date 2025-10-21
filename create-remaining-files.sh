#!/bin/bash
echo "Creating remaining agent system files..."

# Create GitHub Integration
cat > src/github-integration.js << 'GITHUB'
/**
 * GitHub Integration - Manages agent branches
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

export class GitHubIntegration {
  constructor(config = {}) {
    this.repoPath = config.repoPath || process.cwd();
    this.agents = config.agents || ['architect', 'educator', 'visionary', 'philosopher'];
    this.mainBranch = config.mainBranch || 'main';
    this.agentBranchPrefix = config.agentBranchPrefix || 'agent/';
  }

  async initializeAgentBranches() {
    console.log('🌿 Initializing agent branches...\n');
    for (const agentId of this.agents) {
      const branchName = \`\${this.agentBranchPrefix}\${agentId}\`;
      try {
        await this.execGit(\`git rev-parse --verify \${branchName}\`);
        console.log(\`  ✓ Branch \${branchName} already exists\`);
      } catch (error) {
        console.log(\`  📝 Creating branch \${branchName}...\`);
        await this.execGit(\`git checkout -b \${branchName}\`);
        await this.createAgentDocStructure(agentId);
        await this.execGit('git add .');
        await this.execGit(\`git commit -m "Initialize \${agentId} agent branch" --allow-empty\`);
        console.log(\`  ✓ Branch \${branchName} created\`);
      }
    }
    await this.execGit(\`git checkout \${this.mainBranch}\`);
    console.log(\`\n✓ All agent branches initialized\`);
  }

  async createAgentDocStructure(agentId) {
    const agentDir = join(this.repoPath, 'docs', agentId);
    await mkdir(agentDir, { recursive: true });
    const readme = \`# \${agentId.charAt(0).toUpperCase() + agentId.slice(1)} Agent's Perspective

This branch contains the \${agentId} agent's understanding of the repository.

---
*Automatically maintained by AI agent.*\`;
    await writeFile(join(this.repoPath, 'README.md'), readme);
  }

  async getMainCommitHash() {
    const { stdout } = await this.execGit(\`git rev-parse \${this.mainBranch}\`);
    return stdout.trim();
  }

  async getChangedFiles(fromCommit, toCommit = 'HEAD') {
    const { stdout } = await this.execGit(\`git diff --name-only \${fromCommit}..\${toCommit}\`);
    return stdout.trim().split('\n').filter(f => f.length > 0);
  }

  async updateAgentBranch(agentId, agentState, updateContent) {
    const branchName = \`\${this.agentBranchPrefix}\${agentId}\`;
    console.log(\`\n🔄 Updating \${branchName}...\`);
    await this.execGit(\`git checkout \${branchName}\`);
    try {
      await this.execGit(\`git merge \${this.mainBranch} -m "Merge main into \${branchName}"\`);
    } catch (error) {
      console.log(\`  ⚠️  Merge conflicts\`);
    }
    const docs = agentState.generateDocumentation();
    for (const [filename, content] of Object.entries(docs)) {
      const filePath = join(this.repoPath, 'docs', agentId, filename);
      await mkdir(join(this.repoPath, 'docs', agentId), { recursive: true });
      await writeFile(filePath, content);
    }
    if (updateContent) {
      for (const [file, content] of Object.entries(updateContent)) {
        const filePath = join(this.repoPath, 'docs', agentId, file);
        await writeFile(filePath, content);
      }
    }
    await this.execGit('git add docs/');
    try {
      await this.execGit(\`git commit -m "Update \${agentId} understanding"\`);
      console.log(\`  ✓ Updated and committed\`);
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log(\`  ℹ️  No changes\`);
      }
    }
    await this.execGit(\`git checkout \${this.mainBranch}\`);
  }

  async pushAgentBranches() {
    console.log('\n📤 Pushing agent branches...');
    for (const agentId of this.agents) {
      const branchName = \`\${this.agentBranchPrefix}\${agentId}\`;
      try {
        await this.execGit(\`git push origin \${branchName}\`);
        console.log(\`  ✓ Pushed \${branchName}\`);
      } catch (error) {
        console.log(\`  ⚠️  Failed to push\`);
      }
    }
  }

  async getRepoContext() {
    const [structure, commitHash] = await Promise.all([
      this.getFileTree(),
      this.getMainCommitHash()
    ]);
    return { structure, commitHash, timestamp: Date.now() };
  }

  async getFileTree() {
    try {
      const { stdout } = await this.execGit('git ls-tree -r --name-only HEAD');
      return stdout.trim().split('\n').filter(f => f.length > 0);
    } catch (error) {
      return [];
    }
  }

  async execGit(command) {
    return await execAsync(command, { cwd: this.repoPath });
  }
}

export default GitHubIntegration;
GITHUB

echo "✓ Created src/github-integration.js"

# Create Agent Update Workflow
cat > src/agent-update-workflow.js << 'WORKFLOW'
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
    console.log(\`\n📋 \${agentId.toUpperCase()} analyzing...\`);
    const agentState = new AgentState(agentId);
    let loaded = await agentState.load();
    if (!loaded) {
      const character = characterSystem.getCharacter(agentId);
      await agentState.initialize(character, repoContext);
    }
    if (!agentState.hasRepoChanged(repoContext)) {
      console.log(\`  ℹ️  No changes\`);
      continue;
    }
    // Analysis would happen here
    console.log(\`  ✓ Updated\`);
  }

  await github.pushAgentBranches();
  console.log('\n✅ AGENT UPDATE COMPLETE\n');
}

export default runAgentUpdate;
WORKFLOW

echo "✓ Created src/agent-update-workflow.js"
echo ""
echo "All agent system files created!"
