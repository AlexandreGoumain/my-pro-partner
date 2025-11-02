// ============================================
// CHATBOT AI CONFIGURATION
// ============================================

export const CHATBOT_CONFIG = {
  // Modèles OpenAI
  models: {
    mini: 'gpt-4o-mini' as const,
    full: 'gpt-4o' as const,
  },

  // Limites d'utilisation
  limits: {
    maxMessagesPerDay: 100,
    maxMessagesPerConversation: 50,
    maxConversationsPerUser: 20,
    maxTokensPerMessage: 4000,
  },

  // Coûts (pour analytics)
  costs: {
    'gpt-4o-mini': {
      input: 0.15 / 1_000_000, // $0.15 per 1M tokens
      output: 0.6 / 1_000_000, // $0.60 per 1M tokens
    },
    'gpt-4o': {
      input: 2.5 / 1_000_000, // $2.50 per 1M tokens
      output: 10 / 1_000_000, // $10.00 per 1M tokens
    },
  },

  // Paramètres des modèles
  parameters: {
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  },

  // Mots-clés pour basculer vers GPT-4o (complexité)
  complexityKeywords: [
    'analyse',
    'analyser',
    'recommande',
    'recommander',
    'suggère',
    'suggérer',
    'optimise',
    'optimiser',
    'prédis',
    'prédire',
    'prédit',
    'compare',
    'comparer',
    'comparaison',
    'calcule',
    'calculer',
    'estime',
    'estimer',
    'planifie',
    'planifier',
    'stratégie',
    'tendance',
    'croissance',
  ],

  // UI Settings
  ui: {
    widget: {
      position: 'bottom-right' as const,
      defaultWidth: 400,
      defaultHeight: 600,
      minWidth: 350,
      minHeight: 400,
    },
    messages: {
      maxDisplayedMessages: 100,
      loadMoreCount: 20,
    },
  },

  // Feature flags
  features: {
    quickActions: true,
    suggestions: true,
    historyPanel: true,
    feedback: true,
    actionCards: true,
    voiceInput: false, // Future feature
    attachments: false, // Future feature
  },
} as const;

export type ChatbotModel = (typeof CHATBOT_CONFIG.models)[keyof typeof CHATBOT_CONFIG.models];
