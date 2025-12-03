# Plan de Migration Chatbot vers Vercel AI SDK

## Objectif
Migrer le chatbot actuel (implémentation manuelle avec fetch) vers le SDK Vercel AI (`@ai-sdk/openai`, `@ai-sdk/react`, `ai`) pour :
- Simplifier le code de streaming
- Bénéficier du support natif des tools
- Améliorer la maintenabilité
- Créer un hook `useChatbot` propre et modulaire

## Architecture Actuelle

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (components/chatbot/)                              │
│ ├── chatbot-window.tsx      → useChatbot()                 │
│ ├── chatbot-widget.tsx      → useChatbot()                 │
│ └── chat-messages-list.tsx                                 │
├─────────────────────────────────────────────────────────────┤
│ Context (lib/chatbot/)                                      │
│ ├── chatbot-context.tsx     → ChatbotProvider              │
│ └── hooks/                                                  │
│     ├── use-chatbot-state.ts   → État UI (open/close)      │
│     ├── use-conversations.ts   → CRUD conversations        │
│     ├── use-messages.ts        → État messages local       │
│     └── use-message-streaming.ts → Fetch + stream manuel   │
├─────────────────────────────────────────────────────────────┤
│ API Route (app/api/chatbot/message/route.ts)               │
│ └── fetch("https://api.openai.com/...") → Stream manuel    │
├─────────────────────────────────────────────────────────────┤
│ Actions (lib/chatbot/)                                      │
│ ├── chatbot-actions.ts      → Tools OpenAI format          │
│ ├── chatbot-executor.ts     → Exécution des actions        │
│ └── api/stream-handler.ts   → Parsing stream manuel        │
└─────────────────────────────────────────────────────────────┘
```

## Architecture Cible

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (components/chatbot/)                              │
│ ├── chatbot-window.tsx      → useChatbot()                 │
│ └── chatbot-widget.tsx      → useChatbot()                 │
├─────────────────────────────────────────────────────────────┤
│ Hook Principal (hooks/chatbot/)                             │
│ ├── index.ts                → Barrel export                │
│ ├── types.ts                → Types partagés               │
│ ├── use-chatbot.ts          → Hook principal (useChat)     │
│ ├── use-chatbot-state.ts    → État UI                      │
│ └── use-conversations.ts    → CRUD conversations           │
├─────────────────────────────────────────────────────────────┤
│ API Route (app/api/chatbot/message/route.ts)               │
│ └── streamText() + toUIMessageStreamResponse()             │
├─────────────────────────────────────────────────────────────┤
│ Tools (lib/chatbot/tools/)                                  │
│ ├── index.ts                → Export tools                 │
│ ├── client-tools.ts         → Recherche clients, etc.      │
│ ├── document-tools.ts       → Création devis/factures      │
│ └── navigation-tools.ts     → Navigation UI                │
└─────────────────────────────────────────────────────────────┘
```

## Étapes de Migration

### Étape 1 : Mise à jour de l'API Route
**Fichier** : `app/api/chatbot/message/route.ts`

**Avant** :
```typescript
const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}` },
  body: JSON.stringify({ model: "gpt-4o-mini", messages, tools, stream: true })
});
const stream = await createOpenAIStream({ response: openaiResponse, ... });
return new Response(stream, { headers: {...} });
```

**Après** :
```typescript
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = streamText({
  model: openai('gpt-4o-mini'),
  system: systemPrompt,
  messages: convertToModelMessages(messages),
  tools: chatbotTools,
  onFinish: async ({ text, toolCalls }) => {
    await saveMessageToDatabase(conversation.id, text, toolCalls);
  },
});

return result.toUIMessageStreamResponse({
  headers: { 'X-Conversation-Id': conversation.id }
});
```

**Conserver** :
- Rate limiting par plan
- Détection d'injection
- Validation Zod
- Gestion des conversations en base
- Timeout (via maxDuration ou abortSignal)

### Étape 2 : Conversion des Tools
**Fichier** : `lib/chatbot/tools/` (nouveau dossier)

**Avant** (format OpenAI brut) :
```typescript
export const chatbotTools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_clients",
      parameters: { type: "object", properties: {...} }
    }
  }
];
```

**Après** (format AI SDK avec Zod) :
```typescript
import { tool } from 'ai';
import { z } from 'zod';

export const searchClients = tool({
  description: "Rechercher des clients",
  parameters: z.object({
    query: z.string().optional(),
    ville: z.string().optional(),
    limit: z.number().default(10),
  }),
  execute: async ({ query, ville, limit }, { baseUrl }) => {
    // Logique d'exécution serveur
    return { clients: [...] };
  },
});

export const chatbotTools = {
  search_clients: searchClients,
  get_client_details: getClientDetails,
  navigate_to: navigateTo, // Sans execute → client-side
};
```

### Étape 3 : Création du Hook `useChatbot`
**Fichier** : `hooks/chatbot/use-chatbot.ts`

```typescript
import { useChat } from '@ai-sdk/react';

export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    addToolResult,
  } = useChat({
    api: '/api/chatbot/message',
    body: { conversationId },
    onResponse: (response) => {
      const convId = response.headers.get('X-Conversation-Id');
      if (convId) setConversationId(convId);
    },
    onToolCall: async ({ toolCall }) => {
      // Gestion des tools client-side (navigation)
      if (toolCall.toolName === 'navigate_to') {
        router.push(toolCall.args.path);
        addToolResult({ toolCallId: toolCall.toolCallId, result: { success: true } });
      }
    },
  });

  return {
    // État UI
    isOpen,
    openChat: () => setIsOpen(true),
    closeChat: () => setIsOpen(false),

    // Chat
    messages,
    input,
    handleInputChange,
    sendMessage: handleSubmit,
    isLoading,
    error,

    // Conversations
    conversationId,
    startNewConversation: () => {
      setConversationId(null);
      // clear messages via useChat
    },
  };
}
```

### Étape 4 : Simplification du Context
**Fichier** : `lib/chatbot/chatbot-context.tsx`

Le context devient un simple wrapper autour du hook :

```typescript
export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const chatbot = useChatbot();
  return (
    <ChatbotContext.Provider value={chatbot}>
      {children}
    </ChatbotContext.Provider>
  );
}
```

### Étape 5 : Fichiers à Supprimer
- `lib/chatbot/api/stream-handler.ts` → Remplacé par SDK
- `lib/chatbot/hooks/use-message-streaming.ts` → Remplacé par useChat
- `lib/chatbot/hooks/use-messages.ts` → Géré par useChat

### Étape 6 : Fichiers à Conserver (avec modifications mineures)
- `lib/chatbot/security/*` → Rate limiting, injection, logging
- `lib/chatbot/chatbot-prompts.ts` → System prompts
- `lib/chatbot/executors/*` → Logique métier (refactorer dans tools)

## Structure Finale des Fichiers

```
hooks/
└── chatbot/
    ├── index.ts              # Barrel export
    ├── types.ts              # Types (Message, Conversation, etc.)
    ├── use-chatbot.ts        # Hook principal avec useChat
    ├── use-chatbot-ui.ts     # État UI (open/close/history)
    └── use-conversations.ts  # CRUD conversations API

lib/chatbot/
├── tools/
│   ├── index.ts              # Export tous les tools
│   ├── client-tools.ts       # search_clients, get_client_details, create_client
│   ├── document-tools.ts     # create_devis, create_facture
│   ├── article-tools.ts      # search_articles, get_stock
│   ├── analytics-tools.ts    # get_stats, get_revenue
│   └── navigation-tools.ts   # navigate_to (client-side)
├── security/                 # Inchangé
├── chatbot-prompts.ts        # Inchangé
└── chatbot-context.tsx       # Simplifié

app/api/chatbot/
├── message/route.ts          # Migré vers streamText
├── conversations/route.ts    # Inchangé
└── feedback/route.ts         # Inchangé
```

## Avantages de la Migration

| Aspect | Avant | Après |
|--------|-------|-------|
| **Streaming** | Manuel (parsing SSE) | SDK natif |
| **Tool Calling** | Parsing manuel des deltas | Support natif typé |
| **Types** | Types manuels | Zod schemas avec inférence |
| **Gestion état** | 4 hooks custom | 1 hook (useChat) |
| **Code API route** | ~370 lignes | ~150 lignes |
| **Maintenance** | Complexe | Simple |

## Dépendances

**À garder** :
- `openai` (pour les types si besoin)
- `tiktoken` (comptage tokens)

**À utiliser** :
- `@ai-sdk/openai` ✓ (déjà installé)
- `@ai-sdk/react` ✓ (déjà installé)
- `ai` ✓ (déjà installé)

**À supprimer** : Aucune (les packages sont déjà là mais non utilisés)

## Risques et Mitigations

| Risque | Mitigation |
|--------|------------|
| Breaking changes UI | Garder même interface `useChatbot()` |
| Perte fonctionnalités sécurité | Conserver middleware security dans API route |
| Tool calling différent | Tester chaque tool avant déploiement |
| Historique conversations | API routes conversations inchangées |

## Ordre d'Implémentation

1. **[Batch 1]** Créer `hooks/chatbot/` avec types et structure
2. **[Batch 2]** Migrer API route vers `streamText`
3. **[Batch 3]** Convertir tools au format AI SDK
4. **[Batch 4]** Créer `use-chatbot.ts` avec `useChat`
5. **[Batch 5]** Mettre à jour composants UI
6. **[Batch 6]** Supprimer fichiers obsolètes
7. **[Batch 7]** Tests et validation

## Estimation
- Complexité : Moyenne
- Fichiers impactés : ~15 fichiers
- Code net : -500 lignes (simplification)
