// ============================================
// CHATBOT INTELLIGENT MODEL ROUTER
// ============================================

import { CHATBOT_CONFIG, type ChatbotModel } from './config';

/**
 * Sélectionne intelligemment le modèle IA à utiliser (gpt-4o-mini vs gpt-4o)
 * en fonction de la complexité de la requête utilisateur
 *
 * Stratégie:
 * - GPT-4o-mini (80%) : Requêtes simples, CRUD, navigation, recherche
 * - GPT-4o (20%) : Analytics complexes, recommandations, multi-step reasoning
 */
export function selectModel(message: string): ChatbotModel {
  const normalizedMessage = message.toLowerCase().trim();

  // 1. Vérifier les mots-clés de complexité
  const hasComplexKeyword = CHATBOT_CONFIG.complexityKeywords.some((keyword) =>
    normalizedMessage.includes(keyword)
  );

  if (hasComplexKeyword) {
    return CHATBOT_CONFIG.models.full;
  }

  // 2. Détecter les questions multi-étapes (avec ET/OU logiques)
  const hasMultipleSteps =
    (normalizedMessage.includes(' et ') || normalizedMessage.includes(' ou ')) &&
    normalizedMessage.includes('?');

  if (hasMultipleSteps) {
    return CHATBOT_CONFIG.models.full;
  }

  // 3. Détecter les requêtes avec calculs multiples
  const hasMultipleCalculations =
    (normalizedMessage.match(/\b(total|somme|moyenne|médiane|maximum|minimum)\b/g) || []).length >= 2;

  if (hasMultipleCalculations) {
    return CHATBOT_CONFIG.models.full;
  }

  // 4. Détecter les demandes d'insights profonds
  const requiresDeepInsight =
    normalizedMessage.includes('pourquoi') ||
    normalizedMessage.includes('comment se fait-il') ||
    normalizedMessage.includes('explique-moi pourquoi') ||
    normalizedMessage.includes('quelle est la raison');

  if (requiresDeepInsight) {
    return CHATBOT_CONFIG.models.full;
  }

  // 5. Détecter les requêtes longues et complexes (>100 caractères avec plusieurs clauses)
  const isLongAndComplex = message.length > 100 && normalizedMessage.split(',').length >= 3;

  if (isLongAndComplex) {
    return CHATBOT_CONFIG.models.full;
  }

  // 6. Par défaut : utiliser GPT-4o-mini (efficace et économique)
  return CHATBOT_CONFIG.models.mini;
}

/**
 * Détermine si une action nécessite un modèle plus puissant
 */
export function actionRequiresFullModel(actionName: string): boolean {
  const complexActions = [
    'get_statistics',
    'get_dashboard_kpis',
    'search_segments',
    'compare_segments',
    'analyze_trends',
    'generate_recommendations',
  ];

  return complexActions.includes(actionName);
}

/**
 * Calcule le coût estimé d'un message
 */
export function estimateCost(
  model: ChatbotModel,
  inputTokens: number,
  outputTokens: number
): number {
  const modelCosts = CHATBOT_CONFIG.costs[model];
  return inputTokens * modelCosts.input + outputTokens * modelCosts.output;
}

/**
 * Estime le nombre de tokens dans un message (approximation)
 * Règle approximative: 1 token ≈ 4 caractères en français
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
