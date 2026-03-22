const DEFAULT_NAMESPACE = '__default__';

function sanitizeSegment(value, fallback) {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallback;
}

export function getDefaultNamespace() {
  return DEFAULT_NAMESPACE;
}

export function buildOrgNamespace(orgId = 'default') {
  const sanitizedOrgId = sanitizeSegment(orgId, 'default');
  return `org-${sanitizedOrgId}`;
}

export function buildThreadNamespace(threadId) {
  const sanitizedThreadId = sanitizeSegment(threadId, 'thread');
  return `thread-${sanitizedThreadId}`;
}

export function buildNamespaceStrategy({ orgId, threadId, includeThread = false }) {
  const namespaces = [getDefaultNamespace(), buildOrgNamespace(orgId)];

  if (includeThread && threadId) {
    namespaces.push(buildThreadNamespace(threadId));
  }

  return Array.from(new Set(namespaces));
}

export function createRecordId(prefix = 'rec') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildTextRecord({
  id,
  text,
  source,
  orgId = 'default',
  documentType,
  timestamp,
  title,
  threadId,
  attachmentName,
  externalId,
  role,
  metadata = {},
}) {
  return {
    _id: id || createRecordId(documentType || 'record'),
    text,
    source,
    orgId,
    documentType,
    timestamp: timestamp || new Date().toISOString(),
    title,
    threadId,
    attachmentName,
    externalId,
    role,
    ...metadata,
  };
}

export function buildChatTurnRecords({ threadId, orgId = 'default', userMessage, aiReply, attachments = [] }) {
  const records = [];

  if (userMessage) {
    records.push(
      buildTextRecord({
        id: createRecordId('chat-user'),
        text: userMessage,
        source: 'chat_thread',
        orgId,
        documentType: 'chat_turn',
        role: 'user',
        threadId,
      })
    );
  }

  if (aiReply) {
    records.push(
      buildTextRecord({
        id: createRecordId('chat-ai'),
        text: aiReply,
        source: 'chat_thread',
        orgId,
        documentType: 'chat_turn',
        role: 'assistant',
        threadId,
      })
    );
  }

  attachments.forEach(attachment => {
    records.push(
      buildTextRecord({
        id: createRecordId('chat-attachment'),
        text: attachment.text || `Attached file: ${attachment.name}`,
        source: 'chat_attachment',
        orgId,
        documentType: attachment.documentType || 'chat_attachment',
        threadId,
        attachmentName: attachment.name,
        metadata: {
          mimeType: attachment.mimeType,
          extracted: Boolean(attachment.text),
        },
      })
    );
  });

  return records;
}

export function summarizeNamespaceStrategy(orgId, threadId) {
  return {
    defaultNamespace: getDefaultNamespace(),
    organizationNamespace: buildOrgNamespace(orgId),
    threadNamespace: threadId ? buildThreadNamespace(threadId) : null,
  };
}