export const CLAUDE_MODELS = [
  { id: 'claude-opus-4-6', name: 'Claude Opus 4.6' },
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6' },
  { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
];

export const DEFAULT_CLAUDE_MODEL = CLAUDE_MODELS[0].id;

export function isSupportedClaudeModel(modelId) {
  return CLAUDE_MODELS.some(model => model.id === modelId);
}