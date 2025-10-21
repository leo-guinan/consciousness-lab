/**
 * Knowledge Structure Templates
 * Defines entity structures for each recursion level
 */

/**
 * Level 1: Architect - Surface Pattern Recognition
 * Entities: Components, Interfaces, Dependencies, Patterns
 */
export const Level1Structure = {
  entities: {
    components: {
      type: 'structural',
      schema: {
        id: 'string',
        name: 'string',
        type: 'module|class|function|file',
        location: 'string',
        purpose: 'string',
        dependencies: ['string'],
        exports: ['string'],
        complexity: 'low|medium|high'
      }
    },
    interfaces: {
      type: 'structural',
      schema: {
        id: 'string',
        name: 'string',
        type: 'api|internal|event',
        inputs: ['parameter'],
        outputs: ['return_type'],
        usage_pattern: 'string',
        stability: 'stable|evolving|experimental'
      }
    },
    dependencies: {
      type: 'relationship',
      schema: {
        from: 'component_id',
        to: 'component_id',
        type: 'requires|imports|calls|extends',
        strength: 'strong|weak',
        notes: 'string'
      }
    },
    patterns: {
      type: 'observation',
      schema: {
        name: 'string',
        category: 'architectural|design|anti-pattern',
        occurrences: ['location'],
        implications: 'string',
        recommendations: 'string'
      }
    }
  },
  relationships: ['component_dependencies', 'interface_implementations', 'pattern_instances'],
  insights_format: 'structural_analysis'
};

/**
 * Level 2: Educator - Systematic Understanding
 * Entities: Concepts, Learning Paths, Examples, Questions
 */
export const Level2Structure = {
  entities: {
    concepts: {
      type: 'knowledge',
      schema: {
        id: 'string',
        name: 'string',
        difficulty: 'beginner|intermediate|advanced',
        prerequisites: ['concept_id'],
        explanation: 'string',
        why_matters: 'string',
        common_mistakes: ['string']
      }
    },
    learning_paths: {
      type: 'pedagogical',
      schema: {
        id: 'string',
        name: 'string',
        target_audience: 'string',
        concepts: ['concept_id'],
        sequence: ['step'],
        estimated_time: 'string',
        checkpoints: ['validation']
      }
    },
    examples: {
      type: 'practical',
      schema: {
        id: 'string',
        concept: 'concept_id',
        code: 'string',
        explanation: 'string',
        common_variations: ['string'],
        related_concepts: ['concept_id']
      }
    },
    questions: {
      type: 'pedagogical',
      schema: {
        question: 'string',
        concept: 'concept_id',
        frequency: 'common|occasional|rare',
        answer: 'string',
        followup_questions: ['string']
      }
    }
  },
  relationships: ['concept_prerequisites', 'path_progressions', 'example_concepts'],
  insights_format: 'learning_analysis'
};

/**
 * Level 3: Visionary - Compositional Possibility Space
 * Entities: Possibilities, Compositions, Evolutions, Connections
 */
export const Level3Structure = {
  entities: {
    possibilities: {
      type: 'potential',
      schema: {
        id: 'string',
        name: 'string',
        category: 'feature|integration|adaptation|extension',
        current_blockers: ['string'],
        enabling_changes: ['string'],
        impact: 'low|medium|high|transformative',
        timeframe: 'immediate|short|medium|long'
      }
    },
    compositions: {
      type: 'synthetic',
      schema: {
        id: 'string',
        name: 'string',
        components: ['component_id'],
        emergent_properties: ['string'],
        use_cases: ['string'],
        implementation_sketch: 'string'
      }
    },
    evolutions: {
      type: 'temporal',
      schema: {
        id: 'string',
        current_state: 'string',
        future_state: 'string',
        transition_path: ['step'],
        catalysts: ['string'],
        implications: ['string']
      }
    },
    connections: {
      type: 'relational',
      schema: {
        from: 'entity_id',
        to: 'entity_id',
        type: 'enables|enhances|combines_with|leads_to',
        strength: 'weak|moderate|strong',
        description: 'string'
      }
    }
  },
  relationships: ['possibility_chains', 'composition_graphs', 'evolution_paths'],
  insights_format: 'possibility_analysis'
};

/**
 * Level 4: Philosopher - Recursive Design Awareness
 * Entities: Assumptions, Principles, Meta-patterns, Paradoxes
 */
export const Level4Structure = {
  entities: {
    assumptions: {
      type: 'meta-cognitive',
      schema: {
        id: 'string',
        assumption: 'string',
        implicit_or_explicit: 'implicit|explicit',
        where_manifested: ['location'],
        implications: ['string'],
        alternatives: ['string'],
        validity: 'sound|questionable|limiting'
      }
    },
    principles: {
      type: 'philosophical',
      schema: {
        id: 'string',
        principle: 'string',
        category: 'design|architecture|interaction|evolution',
        embodiment: ['example'],
        violations: ['example'],
        rationale: 'string',
        tradeoffs: ['string']
      }
    },
    meta_patterns: {
      type: 'recursive',
      schema: {
        id: 'string',
        pattern: 'string',
        recursion_level: 'number',
        self_reference: 'boolean',
        implications: ['string'],
        emergence: 'string'
      }
    },
    paradoxes: {
      type: 'philosophical',
      schema: {
        id: 'string',
        paradox: 'string',
        where_occurs: ['location'],
        resolution_attempts: ['string'],
        productive_tension: 'string'
      }
    },
    design_decisions: {
      type: 'meta-cognitive',
      schema: {
        id: 'string',
        decision: 'string',
        alternatives_considered: ['string'],
        chosen_because: 'string',
        tradeoffs_accepted: ['string'],
        reveals_about_values: 'string'
      }
    }
  },
  relationships: ['assumption_chains', 'principle_applications', 'meta_pattern_recursions'],
  insights_format: 'philosophical_analysis'
};

/**
 * Universal Knowledge Structure (applies to all levels)
 */
export const UniversalStructure = {
  metadata: {
    agent_id: 'string',
    agent_name: 'string',
    recursion_level: 'number',
    repository: 'string',
    last_updated: 'timestamp',
    update_count: 'number',
    version: 'string'
  },
  understanding: {
    summary: 'string',
    key_insights: ['string'],
    confidence_level: 'low|medium|high',
    areas_of_uncertainty: ['string']
  },
  evolution: {
    transformations: ['transformation_record'],
    learning_trajectory: ['milestone'],
    capability_growth: 'string'
  }
};

/**
 * Get structure template for a specific recursion level
 */
export function getStructureForLevel(level) {
  const structures = {
    1: Level1Structure,
    2: Level2Structure,
    3: Level3Structure,
    4: Level4Structure
  };
  return structures[level] || Level1Structure;
}

/**
 * Initialize knowledge base for an agent
 */
export function initializeKnowledgeBase(agent) {
  const structure = getStructureForLevel(agent.level);
  
  return {
    ...UniversalStructure,
    metadata: {
      agent_id: agent.id,
      agent_name: agent.name,
      recursion_level: agent.level,
      repository: process.cwd(),
      last_updated: Date.now(),
      update_count: 0,
      version: '1.0.0'
    },
    structure: structure,
    entities: Object.keys(structure.entities).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {}),
    relationships: {},
    insights: [],
    understanding: {
      summary: 'Initial examination in progress',
      key_insights: [],
      confidence_level: 'low',
      areas_of_uncertainty: []
    },
    evolution: {
      transformations: [],
      learning_trajectory: [],
      capability_growth: 'Initialized'
    }
  };
}

export default {
  Level1Structure,
  Level2Structure,
  Level3Structure,
  Level4Structure,
  UniversalStructure,
  getStructureForLevel,
  initializeKnowledgeBase
};
