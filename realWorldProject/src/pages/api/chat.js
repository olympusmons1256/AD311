import { getContextForMessage } from '../../utils/pinecone';
import { upsertTextRecords } from '../../utils/pinecone';
import { getSupabaseServerClient } from '../../utils/supabaseClient';
import { DEFAULT_CLAUDE_MODEL, isSupportedClaudeModel } from '../../utils/claude';
import { buildChatTurnRecords, buildNamespaceStrategy, buildThreadNamespace } from '../../utils/pineconeRecords';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

export const config = {
  maxDuration: 30,
};

function buildPrompt(message, contextSnippets, history = [], attachments = []) {
  const contextBlock = contextSnippets.length > 0
    ? contextSnippets.map((snippet, index) => `[Context ${index + 1}] (${snippet.namespace}) ${snippet.text}`).join('\n\n')
    : 'No matching organizational context was retrieved.';

  const historyBlock = history.length > 0
    ? history.map(turn => `${turn.role === 'user' ? 'User' : 'Assistant'}: ${turn.content}`).join('\n')
    : 'No recent conversation history was provided.';

  const attachmentBlock = attachments.length > 0
    ? attachments.map((attachment, index) => `[Attachment ${index + 1}] ${attachment.text || `File: ${attachment.name}`}`).join('\n\n')
    : 'No ad hoc chat attachments were supplied.';

  return [
    'You are an organizational intelligence assistant.',
    'Use the provided context when it is relevant and be explicit when you are uncertain.',
    'If context is missing, say what you would need next rather than inventing details.',
    '',
    'Recent conversation history:',
    historyBlock,
    '',
    'Ad hoc chat attachments:',
    attachmentBlock,
    '',
    'Retrieved context:',
    contextBlock,
    '',
    `User question: ${message}`,
  ].join('\n');
}

function extractClaudeText(payload) {
  if (!Array.isArray(payload?.content)) {
    return '';
  }

  return payload.content
    .filter(block => block?.type === 'text' && typeof block?.text === 'string')
    .map(block => block.text)
    .join('\n\n')
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const message = req.body?.message?.trim();
  const requestedModel = req.body?.model;
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
  const attachments = Array.isArray(req.body?.attachments) ? req.body.attachments : [];
  const threadId = req.body?.threadId;
  const orgId = req.body?.orgId || 'default';
  const model = isSupportedClaudeModel(requestedModel) ? requestedModel : DEFAULT_CLAUDE_MODEL;

  if (!message) {
    return res.status(400).json({ error: 'A message is required.' });
  }

  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'Claude API key is not configured.' });
  }

  let contextSnippets = [];
  const namespaces = buildNamespaceStrategy({ orgId, threadId, includeThread: true });

  try {
    contextSnippets = await getContextForMessage(message, namespaces);
  } catch (error) {
    console.error('Pinecone context lookup failed:', error);
  }

  try {
    const claudeRes = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 500,
        system: 'You answer questions using organization context and chat intent. Be concise, accurate, and practical.',
        messages: [
          {
            role: 'user',
            content: buildPrompt(message, contextSnippets, history, attachments),
          },
        ],
      }),
    });

    const claudeData = await claudeRes.json();

    if (!claudeRes.ok) {
      const messageFromApi = claudeData?.error?.message || 'Claude request failed.';
      return res.status(claudeRes.status).json({ error: messageFromApi });
    }

    const reply = extractClaudeText(claudeData);

    if (!reply) {
      return res.status(502).json({ error: 'Claude returned an empty response.' });
    }

    try {
      const supabase = await getSupabaseServerClient();

      await supabase.from('chat_logs').insert([
        {
          user_message: message,
          ai_reply: reply,
          model,
          thread_id: threadId,
        },
      ]);
    } catch (error) {
      console.error('Supabase chat log insert failed:', error);
    }

    if (threadId) {
      try {
        const threadRecords = buildChatTurnRecords({
          threadId,
          orgId,
          userMessage: message,
          aiReply: reply,
          attachments,
        });
        await upsertTextRecords(buildThreadNamespace(threadId), threadRecords);
      } catch (error) {
        console.error('Pinecone thread upsert failed:', error);
      }
    }

    return res.status(200).json({ reply, contextSnippets, model });
  } catch (error) {
    console.error('Claude API request failed:', error);
    return res.status(500).json({ error: 'Unable to generate a Claude response right now.' });
  }
}
