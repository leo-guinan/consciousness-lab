/**
 * Agent Update Workflow
 * Coordinates agents updating their understanding when the repository changes
 */

import { AgentState } from './agent-state.js';
import { GitHubIntegration } from './github-integration.js';
import { ModelAdapter } from './model-adapter.js';
import { CharacterSystem } from './character-system.js';
import { join } from 'path';

/**
 * Run agent update workflow
 */
export async function runAgentUpdate(repoContext) {
  console.log('\n' + '='.repeat(80));
  console.log('AGENT UPDATE WORKFLOW');
  console.log('='.repeat(80));
  console.log('\nRepository changes detected. Updating agent understanding...\n');

  const agents = ['architect', 'educator', 'visionary', 'philosopher'];
  const github = new GitHubIntegration();
  const modelAdapter = new ModelAdapter({
    openrouterKey: process.env.OPENROUTER_API_KEY,
    ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434'
  });

  // Load character system
  const characterSystem = new CharacterSystem(
    join(process.cwd(), 'characters', 'project-analysis.json')
  );
  await characterSystem.loadCharacters();

  for (const agentId of agents) {
    console.log(`\n📋 ${agentId.toUpperCase()} analyzing changes...`);

    // Load or initialize agent state
    const agentState = new AgentState(agentId);
    let loaded = await agentState.load();
    
    if (!loaded) {
      const character = characterSystem.getCharacter(agentId);
      await agentState.initialize(character, repoContext);
      console.log(`  ℹ️  Agent state initialized for first time`);
    }

    // Check if repo has changed
    if (!agentState.hasRepoChanged(repoContext)) {
      console.log(`  ℹ️  No relevant changes detected`);
      continue;
    }

    // Generate analysis prompt
    const character = agentState.getCurrentCharacter();
    const analysisPrompt = createAnalysisPrompt(character, repoContext, agentState);

    // Get agent's analysis
    try {
      const response = await modelAdapter.call(
        process.env.DEFAULT_MODEL || 'llama3.1:8b',
        analysisPrompt
      );

      // Parse insights from response
      const insights = parseInsights(response.text);

      // Update agent state
      await agentState.updateUnderstanding(insights, repoContext);

      // Generate updated documentation
      const updatedDocs = await generateUpdatedDocs(
        agentId,
        agentState,
        insights,
        repoContext
      );

      // Update agent's branch
      await github.updateAgentBranch(agentId, agentState, updatedDocs);

      console.log(`  ✓ ${agentId} understanding updated`);
      console.log(`    New insights: ${insights.insights?.length || 0}`);
      console.log(`    Patterns identified: ${insights.patterns?.length || 0}`);
      
    } catch (error) {
      console.error(`  ✗ Error updating ${agentId}:`, error.message);
    }
  }

  // Push all updated branches
  await github.pushAgentBranches();

  console.log('\n' + '='.repeat(80));
  console.log('✅ AGENT UPDATE COMPLETE');
  console.log('='.repeat(80));
  console.log('\nAll agent branches updated with new understanding.\n');
}

/**
 * Create analysis prompt for an agent
 */
function createAnalysisPrompt(character, repoContext, agentState) {
  const changesummary = repoContext.changes ? `
## Changes Made
${repoContext.changes.files.map(f => `- ${f}`).join('\n')}

## Commit Messages
${repoContext.changes.commits.map(c => `- ${c.message}`).join('\n')}

## Diff Preview
\`\`\`diff
${repoContext.changes.diff.substring(0, 2000)}...
\`\`\`
` : 'Full repository analysis';

  return `${character.system_prompt}

# Task: Analyze Repository Changes

You are ${character.name}, maintaining documentation from the perspective of ${character.level_name}.

## Your Previous Understanding
You have ${agentState.state.understanding.insights.length} insights documented.
Last check: ${new Date(agentState.state.understanding.repoSnapshot.timestamp).toISOString()}

${changesummary}

## Your Task
Analyze these changes from your unique perspective and provide:

1. **Insights** (2-5 new insights about the changes)
2. **Patterns** (any patterns you notice)
3. **Assumptions** (assumptions revealed or affected by these changes)
4. **Recommendations** (what should be documented or explained)
5. **Summary** (one paragraph summarizing your analysis)

Format your response as JSON:
\`\`\`json
{
  "insights": ["insight 1", "insight 2", ...],
  "patterns": ["pattern 1", "pattern 2", ...],
  "assumptions": ["assumption 1", ...],
  "recommendations": ["recommendation 1", ...],
  "summary": "One paragraph summary"
}
\`\`\`

Focus on what matters from YOUR perspective as ${character.name}.`;
}

/**
 * Parse insights from agent response
 */
function parseInsights(text) {
  try {
    // Try to extract JSON from response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                     text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    // Fallback to text parsing
  }

  // Fallback: parse as plain text
  return {
    insights: extractBulletPoints(text, 'insights'),
    patterns: extractBulletPoints(text, 'patterns'),
    assumptions: extractBulletPoints(text, 'assumptions'),
    recommendations: extractBulletPoints(text, 'recommendations'),
    summary: text.substring(0, 500)
  };
}

/**
 * Extract bullet points from text
 */
function extractBulletPoints(text, section) {
  const lines = text.split('\n');
  const points = [];
  let inSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes(section.toLowerCase())) {
      inSection = true;
      continue;
    }

    if (inSection) {
      if (line.match(/^[-*]\s+(.+)/) || line.match(/^\d+\.\s+(.+)/)) {
        const match = line.match(/^[-*\d.]+\s+(.+)/);
        if (match) {
          points.push(match[1].trim());
        }
      } else if (line.trim() === '' || line.match(/^[A-Z]/)) {
        // End of section
        break;
      }
    }
  }

  return points.slice(0, 5); // Limit to 5 per section
}

/**
 * Generate updated documentation
 */
async function generateUpdatedDocs(agentId, agentState, insights, repoContext) {
  const docs = {};
  
  // Get agent's documentation sections
  const sections = agentState.state.documentation.sections;

  for (const [filename, description] of Object.entries(sections)) {
    docs[filename] = generateSectionUpdate(
      agentId,
      filename,
      description,
      insights,
      agentState
    );
  }

  return docs;
}

/**
 * Generate section update
 */
function generateSectionUpdate(agentId, filename, description, insights, agentState) {
  const sectionName = filename.replace('.md', '').replace(/_/g, ' ');
  
  return `# ${sectionName}

*${description}*  
*Maintained by the ${agentId} agent*  
Last updated: ${new Date().toISOString()}

---

## Overview

This section provides ${description.toLowerCase()} from the perspective of ${agentState.state.agent.levelName}.

## Recent Changes

${insights.insights && insights.insights.length > 0 ? 
  insights.insights.map(i => `- ${i}`).join('\n') :
  'No recent changes affecting this section.'
}

## Patterns Observed

${insights.patterns && insights.patterns.length > 0 ?
  insights.patterns.map(p => `- ${p}`).join('\n') :
  'Analyzing patterns...'
}

## Recommendations

${insights.recommendations && insights.recommendations.length > 0 ?
  insights.recommendations.map(r => `- ${r}`).join('\n') :
  'No immediate recommendations.'
}

## Summary

${insights.summary || 'This section will be updated as the repository evolves.'}

---

## All Insights (${agentState.state.understanding.insights.length} total)

${agentState.state.understanding.insights.slice(-10).map((insight, i) => 
  `${agentState.state.understanding.insights.length - 10 + i + 1}. ${insight}`
).join('\n')}

---

*This document is automatically generated and maintained by an AI agent that evolves with the codebase.*
*Agent state hash: ${agentState.state.understanding.repoSnapshot.hash}*
`;
}

export default runAgentUpdate;

