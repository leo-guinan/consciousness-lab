/**
 * GitHub Integration
 * Manages agent branches and responds to repository changes
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

export class GitHubIntegration {
  constructor(config = {}) {
    this.repoPath = config.repoPath || process.cwd();
    this.agents = config.agents || ['architect', 'educator', 'visionary', 'philosopher'];
    this.mainBranch = config.mainBranch || 'main';
    this.agentBranchPrefix = config.agentBranchPrefix || 'agent/';
  }

  /**
   * Initialize agent branches
   */
  async initializeAgentBranches() {
    console.log('🌿 Initializing agent branches...\n');

    for (const agentId of this.agents) {
      const branchName = `${this.agentBranchPrefix}${agentId}`;
      
      try {
        // Check if branch exists
        await this.execGit(`git rev-parse --verify ${branchName}`);
        console.log(`  ✓ Branch ${branchName} already exists`);
      } catch (error) {
        // Branch doesn't exist, create it
        console.log(`  📝 Creating branch ${branchName}...`);
        await this.execGit(`git checkout -b ${branchName}`);
        
        // Create agent's documentation structure
        await this.createAgentDocStructure(agentId);
        
        // Initial commit
        await this.execGit('git add .');
        await this.execGit(`git commit -m "Initialize ${agentId} agent branch" --allow-empty`);
        
        console.log(`  ✓ Branch ${branchName} created`);
      }
    }

    // Return to main branch
    await this.execGit(`git checkout ${this.mainBranch}`);
    console.log(`\n✓ All agent branches initialized`);
  }

  /**
   * Create documentation structure for an agent
   */
  async createAgentDocStructure(agentId) {
    const structures = {
      architect: ['ARCHITECTURE.md', 'API_REFERENCE.md', 'MODULES.md', 'DEPENDENCIES.md'],
      educator: ['GETTING_STARTED.md', 'TUTORIALS.md', 'EXAMPLES.md', 'FAQ.md', 'LEARNING_PATH.md'],
      visionary: ['VISION.md', 'ROADMAP.md', 'POSSIBILITIES.md', 'COMPOSITION_PATTERNS.md', 'EVOLUTION.md'],
      philosopher: ['PHILOSOPHY.md', 'PRINCIPLES.md', 'DECISIONS.md', 'TRADEOFFS.md', 'META.md']
    };

    const agentDir = join(this.repoPath, 'docs', agentId);
    await mkdir(agentDir, { recursive: true });

    const files = structures[agentId] || [];
    
    for (const file of files) {
      const filePath = join(agentDir, file);
      const content = `# ${file.replace('.md', '').replace(/_/g, ' ')}

*Maintained by the ${agentId} agent*

Last updated: ${new Date().toISOString()}

---

*This document is automatically generated and updated by an AI agent.*
`;
      await writeFile(filePath, content);
    }

    // Create README for the agent's perspective
    const readme = `# ${agentId.charAt(0).toUpperCase() + agentId.slice(1)} Agent's Perspective

This branch contains the ${agentId} agent's understanding of the repository.

## Documentation

${files.map(f => `- [${f}](docs/${agentId}/${f})`).join('\n')}

---

*This branch is automatically maintained by an AI agent that evolves with the codebase.*
`;
    
    await writeFile(join(this.repoPath, 'README.md'), readme);
  }

  /**
   * Get current commit hash of main branch
   */
  async getMainCommitHash() {
    const { stdout } = await this.execGit(`git rev-parse ${this.mainBranch}`);
    return stdout.trim();
  }

  /**
   * Get changed files between commits
   */
  async getChangedFiles(fromCommit, toCommit = 'HEAD') {
    const { stdout } = await this.execGit(`git diff --name-only ${fromCommit}..${toCommit}`);
    return stdout.trim().split('\n').filter(f => f.length > 0);
  }

  /**
   * Get commit diff
   */
  async getCommitDiff(fromCommit, toCommit = 'HEAD') {
    const { stdout } = await this.execGit(`git diff ${fromCommit}..${toCommit}`);
    return stdout;
  }

  /**
   * Update agent branch based on main branch changes
   */
  async updateAgentBranch(agentId, agentState, updateContent) {
    const branchName = `${this.agentBranchPrefix}${agentId}`;
    
    console.log(`\n🔄 Updating ${branchName}...`);

    // Switch to agent branch
    await this.execGit(`git checkout ${branchName}`);

    // Merge main into agent branch (to keep it up to date with code)
    try {
      await this.execGit(`git merge ${this.mainBranch} -m "Merge main into ${branchName}"`);
    } catch (error) {
      console.log(`  ⚠️  Merge conflicts - will need manual resolution`);
    }

    // Update agent's documentation
    const docs = agentState.generateDocumentation();
    
    for (const [filename, content] of Object.entries(docs)) {
      const filePath = join(this.repoPath, 'docs', agentId, filename);
      await mkdir(join(this.repoPath, 'docs', agentId), { recursive: true });
      await writeFile(filePath, content);
    }

    // Add any additional updates from the agent's analysis
    if (updateContent) {
      for (const [file, content] of Object.entries(updateContent)) {
        const filePath = join(this.repoPath, 'docs', agentId, file);
        await writeFile(filePath, content);
      }
    }

    // Commit changes
    await this.execGit('git add docs/');
    
    try {
      await this.execGit(`git commit -m "Update ${agentId} understanding based on repository changes

Automated update by ${agentId} agent
Repository hash: ${agentState.state.understanding.repoSnapshot.hash}
Timestamp: ${new Date().toISOString()}"`);
      console.log(`  ✓ Updated and committed`);
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log(`  ℹ️  No changes to commit`);
      } else {
        throw error;
      }
    }

    // Return to main
    await this.execGit(`git checkout ${this.mainBranch}`);
  }

  /**
   * Push agent branches to remote
   */
  async pushAgentBranches() {
    console.log('\n📤 Pushing agent branches...');
    
    for (const agentId of this.agents) {
      const branchName = `${this.agentBranchPrefix}${agentId}`;
      try {
        await this.execGit(`git push origin ${branchName}`);
        console.log(`  ✓ Pushed ${branchName}`);
      } catch (error) {
        console.log(`  ⚠️  Failed to push ${branchName}: ${error.message}`);
      }
    }
  }

  /**
   * Get repository context for analysis
   */
  async getRepoContext() {
    const [structure, commitHash, branch] = await Promise.all([
      this.getFileTree(),
      this.getMainCommitHash(),
      this.getCurrentBranch()
    ]);

    return {
      structure,
      commitHash,
      branch,
      timestamp: Date.now()
    };
  }

  /**
   * Get file tree
   */
  async getFileTree() {
    try {
      const { stdout } = await this.execGit('git ls-tree -r --name-only HEAD');
      return stdout.trim().split('\n').filter(f => f.length > 0);
    } catch (error) {
      return [];
    }
  }

  /**
   * Get current branch
   */
  async getCurrentBranch() {
    const { stdout } = await this.execGit('git branch --show-current');
    return stdout.trim();
  }

  /**
   * Execute git command
   */
  async execGit(command) {
    return await execAsync(command, { cwd: this.repoPath });
  }

  /**
   * Create webhook handler for GitHub
   */
  createWebhookHandler() {
    return async (req, res) => {
      const event = req.headers['x-github-event'];
      const signature = req.headers['x-hub-signature-256'];

      // Verify webhook signature if secret is configured
      if (process.env.GITHUB_WEBHOOK_SECRET) {
        if (!this.verifySignature(signature, req.body)) {
          res.status(401).send('Invalid signature');
          return;
        }
      }

      // Handle push event
      if (event === 'push') {
        const payload = JSON.parse(req.body);
        
        // Only respond to pushes to main branch
        if (payload.ref === `refs/heads/${this.mainBranch}`) {
          console.log(`\n🔔 Push to ${this.mainBranch} detected`);
          console.log(`   Commits: ${payload.commits.length}`);
          
          // Trigger agent updates (async, don't block webhook response)
          this.handleMainBranchUpdate(payload).catch(error => {
            console.error('Error updating agents:', error);
          });

          res.status(200).send('Webhook received, agents will update');
        } else {
          res.status(200).send('Not main branch, ignoring');
        }
      } else {
        res.status(200).send('Event not handled');
      }
    };
  }

  /**
   * Handle main branch update
   */
  async handleMainBranchUpdate(payload) {
    console.log('\n🤖 Agents analyzing changes...');

    // Get changes
    const beforeCommit = payload.before;
    const afterCommit = payload.after;
    const changedFiles = await this.getChangedFiles(beforeCommit, afterCommit);
    const diff = await this.getCommitDiff(beforeCommit, afterCommit);

    console.log(`   Changed files: ${changedFiles.length}`);

    // Get current repo context
    const repoContext = await this.getRepoContext();
    repoContext.changes = {
      files: changedFiles,
      diff: diff,
      commits: payload.commits
    };

    // Trigger update workflow
    const { runAgentUpdate } = await import('./agent-update-workflow.js');
    await runAgentUpdate(repoContext);
  }

  /**
   * Verify webhook signature
   */
  verifySignature(signature, body) {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(body).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  }
}

export default GitHubIntegration;

