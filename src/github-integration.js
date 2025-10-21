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
      const branchName = `${this.agentBranchPrefix}${agentId}`;
      try {
        await this.execGit(`git rev-parse --verify ${branchName}`);
        console.log(`  ✓ Branch ${branchName} already exists`);
      } catch (error) {
        console.log(`  📝 Creating branch ${branchName}...`);
        await this.execGit(`git checkout -b ${branchName}`);
        await this.createAgentDocStructure(agentId);
        await this.execGit('git add .');
        await this.execGit(`git commit -m "Initialize ${agentId} agent branch" --allow-empty`);
        console.log(`  ✓ Branch ${branchName} created`);
      }
    }
    await this.execGit(`git checkout ${this.mainBranch}`);
    console.log(`\n✓ All agent branches initialized`);
  }

  async createAgentDocStructure(agentId) {
    const agentDir = join(this.repoPath, 'docs', agentId);
    await mkdir(agentDir, { recursive: true });
    const readme = `# ${agentId.charAt(0).toUpperCase() + agentId.slice(1)} Agent's Perspective

This branch contains the ${agentId} agent's understanding of the repository.

---
*Automatically maintained by AI agent.*`;
    await writeFile(join(this.repoPath, 'README.md'), readme);
  }

  async getMainCommitHash() {
    const { stdout } = await this.execGit(`git rev-parse ${this.mainBranch}`);
    return stdout.trim();
  }

  async getChangedFiles(fromCommit, toCommit = 'HEAD') {
    const { stdout } = await this.execGit(`git diff --name-only ${fromCommit}..${toCommit}`);
    return stdout.trim().split('\n').filter(f => f.length > 0);
  }

  async updateAgentBranch(agentId, agentState, updateContent) {
    const branchName = `${this.agentBranchPrefix}${agentId}`;
    console.log(`\n🔄 Updating ${branchName}...`);
    
    // Switch to agent branch
    await this.execGit(`git checkout ${branchName}`);
    
    // Merge main to keep code in sync
    try {
      await this.execGit(`git merge ${this.mainBranch} -m "Merge main into ${branchName}"`);
    } catch (error) {
      console.log(`  ⚠️  Merge conflicts`);
    }
    
    // Export knowledge base to branch (structured entities)
    await agentState.exportToBranch(this.repoPath);
    console.log(`  📚 Knowledge base exported`);
    
    // Generate documentation
    const docs = agentState.generateDocumentation();
    for (const [filename, content] of Object.entries(docs)) {
      const filePath = join(this.repoPath, 'docs', agentId, filename);
      await mkdir(join(this.repoPath, 'docs', agentId), { recursive: true });
      await writeFile(filePath, content);
    }
    
    // Add any additional updates
    if (updateContent) {
      for (const [file, content] of Object.entries(updateContent)) {
        const filePath = join(this.repoPath, 'docs', agentId, file);
        await writeFile(filePath, content);
      }
    }
    
    // Commit all changes (docs + knowledge)
    await this.execGit('git add docs/ knowledge/');
    
    try {
      const commitMsg = `Update ${agentId} understanding

- Knowledge entities updated
- Documentation regenerated  
- Repository hash: ${agentState.state.understanding.repoSnapshot.hash}
- Timestamp: ${new Date().toISOString()}`;
      
      await this.execGit(`git commit -m "${commitMsg}"`);
      console.log(`  ✓ Updated and committed`);
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log(`  ℹ️  No changes`);
      } else {
        throw error;
      }
    }
    
    // Return to main
    await this.execGit(`git checkout ${this.mainBranch}`);
  }

  async pushAgentBranches() {
    console.log('\n📤 Pushing agent branches...');
    for (const agentId of this.agents) {
      const branchName = `${this.agentBranchPrefix}${agentId}`;
      try {
        await this.execGit(`git push origin ${branchName}`);
        console.log(`  ✓ Pushed ${branchName}`);
      } catch (error) {
        console.log(`  ⚠️  Failed to push`);
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
