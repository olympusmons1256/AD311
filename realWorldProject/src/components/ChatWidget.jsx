import { useEffect, useRef, useState } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DataSourcesPanel from './DataSourcesPanel';
import { CLAUDE_MODELS } from '../utils/claude';
import { readApiResponse } from '../utils/readApiResponse';
import { useAuth } from '../context/AuthContext';

function createThreadId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeAttachmentForApi(attachment) {
  return {
    id: attachment.id,
    name: attachment.name,
    mimeType: attachment.mimeType,
    size: attachment.size,
    documentType: attachment.documentType,
    text: attachment.text,
  };
}

function sanitizeHistoryForApi(history = []) {
  return history.map(message => ({
    role: message.role,
    content: message.content,
  }));
}

export default function ChatWidget() {
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(CLAUDE_MODELS[0].id);
  const [contextSnippets, setContextSnippets] = useState([]);
  const [showContextSnippets, setShowContextSnippets] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showDataSourcesPanel, setShowDataSourcesPanel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [threadId] = useState(createThreadId);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewUrlsRef = useRef(new Set());
  const menuRef = useRef(null);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach(previewUrl => {
        URL.revokeObjectURL(previewUrl);
      });
      previewUrlsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!showMenu) {
      return undefined;
    }

    const handlePointerDown = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [showMenu]);

  const handleFileAttach = async event => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    const nextAttachments = await Promise.all(selectedFiles.map(async file => {
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      if (previewUrl) {
        previewUrlsRef.current.add(previewUrl);
      }

      const attachment = {
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        documentType: 'chat_attachment',
        previewUrl,
      };

      try {
        if (file.type.startsWith('text/') || /\.(txt|md|json|csv)$/i.test(file.name)) {
          attachment.text = await file.text();
        } else {
          attachment.text = `Attachment: ${file.name} (${attachment.mimeType}). Add OCR or extracted text in the Data Sources panel for deeper retrieval.`;
        }
      } catch (error) {
        attachment.text = `Attachment: ${file.name}. The file could not be read locally.`;
      }

      return attachment;
    }));

    setAttachments(current => [...current, ...nextAttachments]);
    event.target.value = '';
  };

  const removeAttachment = attachmentId => {
    setAttachments(current => current.filter(attachment => attachment.id !== attachmentId));
  };

  const sendMessage = async () => {
    const messageText = input.trim();

    if (!messageText) return;

    setLoading(true);
    setInput('');
    const pendingAttachments = attachments;
    const apiAttachments = pendingAttachments.map(sanitizeAttachmentForApi);
    const apiHistory = sanitizeHistoryForApi(messages);
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.value = '';
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }

    setMessages(prevMessages => [...prevMessages, { role: 'user', content: messageText, attachments: pendingAttachments }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          model,
          history: apiHistory,
          attachments: apiAttachments,
          threadId,
          orgId: 'default',
        }),
      });
      const data = await readApiResponse(res, 'Unable to generate a response.');

      setMessages(prevMessages => [...prevMessages, { role: 'ai', content: data.reply }]);
      setContextSnippets(data.contextSnippets || []);
      setShowContextSnippets(false);
    } catch (error) {
      setMessages(prevMessages => [...prevMessages, { role: 'ai', content: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  };

  return (
    <div
      style={{
        background: 'var(--color-chat-bg)',
        width: '100%',
        minHeight: '100vh',
        color: 'var(--color-neutral-bg)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: '8px 10px 10px',
      }}
    >
      <div
        ref={menuRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
          padding: '0 2px',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--color-neutral-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src="/connection-icon%201.png"
            alt="Collective Intelligence logo"
            style={{ width: 24, height: 24, objectFit: 'contain' }}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowMenu(current => !current)}
          style={{
            background: 'transparent',
            color: 'var(--color-neutral-bg)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            cursor: 'pointer',
          }}
          aria-label="More options"
        >
          <MoreVertIcon sx={{ fontSize: 20, color: 'var(--color-neutral-bg)' }} />
        </button>

        {showMenu && (
          <div
            style={{
              position: 'absolute',
              top: 30,
              right: 0,
              width: 220,
              background: 'var(--color-neutral-bg)',
              color: 'var(--color-neutral-text)',
              borderRadius: 'var(--radius-small)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.18)',
              zIndex: 30,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(15, 23, 42, 0.5)' }}>
                Signed in
              </div>
              <div style={{ marginTop: 4, fontSize: 12.5, lineHeight: 1.35, wordBreak: 'break-word' }}>
                {user?.email || 'Unknown user'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowDataSourcesPanel(true);
                setShowMenu(false);
              }}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-neutral-text)',
                padding: '11px 12px',
                textAlign: 'left',
                fontSize: 12.5,
                cursor: 'pointer',
              }}
            >
              Data sources
            </button>

            <button
              type="button"
              onClick={async () => {
                setShowMenu(false);
                await signOut();
              }}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-neutral-text)',
                padding: '11px 12px',
                textAlign: 'left',
                fontSize: 12.5,
                cursor: 'pointer',
                borderTop: '1px solid rgba(15, 23, 42, 0.08)',
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      <DataSourcesPanel
        isOpen={showDataSourcesPanel}
        onClose={() => setShowDataSourcesPanel(false)}
        orgId="default"
        threadId={threadId}
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: 'var(--color-neutral-bg)',
          borderRadius: 'var(--radius-small)',
          padding: '18px 8px 14px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            paddingRight: 2,
          }}
        >
          {messages.length === 0 && <div style={{ flex: 1 }} />}
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const showContextFooter = !isUser && i === messages.length - 1 && contextSnippets.length > 0;

            return (
              <div
                key={i}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  background: isUser ? 'var(--color-neutral-bg)' : 'var(--color-primary)',
                  color: isUser ? 'var(--color-neutral-text)' : 'var(--color-neutral-bg)',
                  border: isUser ? '1px solid #E5E7EB' : 'none',
                  borderRadius: 'var(--radius-small)',
                  padding: isUser ? '10px 6px 10px 4px' : '8px 6px',
                  width: 'auto',
                  maxWidth: 'calc(100% - 36px)',
                  boxSizing: 'border-box',
                  fontSize: isUser ? 14 : 13.5,
                  lineHeight: isUser ? 1.25 : 1.18,
                  letterSpacing: '-0.01em',
                  boxShadow: isUser ? '0 0 0 1px rgba(15, 23, 42, 0.04)' : 'none',
                  marginBottom: isUser ? 6 : 0,
                }}
              >
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    textAlign: isUser ? 'right' : 'left',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </div>
                {msg.actionLabel && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <button
                      type="button"
                      style={{
                        background: 'var(--color-secondary)',
                        color: 'var(--color-neutral-bg)',
                        border: 'none',
                        borderRadius: 'var(--radius-micro)',
                        fontSize: 11,
                        lineHeight: 1,
                        padding: '5px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      {msg.actionLabel}
                    </button>
                  </div>
                )}
                {msg.attachments?.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginTop: 8,
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.attachments.map(attachment => {
                      const isImage = Boolean(attachment.previewUrl);

                      return (
                        <div
                          key={attachment.id}
                          style={{
                            width: isImage ? 56 : 'auto',
                            minWidth: isImage ? 56 : 0,
                            maxWidth: 140,
                            borderRadius: 'var(--radius-small)',
                            overflow: 'hidden',
                            border: isUser ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.16)',
                            background: isUser ? '#F8FAFC' : 'rgba(255, 255, 255, 0.08)',
                          }}
                          title={attachment.name}
                        >
                          {isImage ? (
                            <img
                              src={attachment.previewUrl}
                              alt={attachment.name}
                              style={{
                                width: 56,
                                height: 56,
                                display: 'block',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                padding: '6px 8px',
                                fontSize: 10.5,
                                lineHeight: 1.3,
                                color: isUser ? 'var(--color-neutral-text)' : 'var(--color-neutral-bg)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {attachment.name}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {showContextFooter && (
                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 6,
                      borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowContextSnippets(current => !current)}
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.82)',
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                      aria-expanded={showContextSnippets}
                      aria-label={showContextSnippets ? 'Collapse context used' : 'Expand context used'}
                    >
                      <span>Context used ({contextSnippets.length})</span>
                      {showContextSnippets ? (
                        <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.82)' }} />
                      ) : (
                        <KeyboardArrowDownIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.82)' }} />
                      )}
                    </button>

                    {showContextSnippets && (
                      <ul
                        style={{
                          margin: '8px 0 0',
                          paddingLeft: 16,
                          fontSize: 10.5,
                          lineHeight: 1.35,
                          color: 'rgba(255, 255, 255, 0.86)',
                        }}
                      >
                        {contextSnippets.map((snippet, idx) => (
                          <li key={snippet.id || idx} style={{ marginBottom: 6 }}>
                            <div>{snippet.text || 'No text available'}</div>
                            <div style={{ fontSize: 10, opacity: 0.68 }}>
                              {[snippet.source, snippet.documentType, snippet.namespace].filter(Boolean).join(' · ')}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div
              style={{
                alignSelf: 'flex-start',
                background: 'var(--color-primary)',
                color: 'var(--color-neutral-bg)',
                borderRadius: 'var(--radius-small)',
                padding: '8px 10px',
                width: 'auto',
                maxWidth: 'calc(100% - 36px)',
                boxSizing: 'border-box',
                fontSize: 13.5,
                lineHeight: 1.18,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              aria-live="polite"
              aria-label="Assistant is generating a response"
            >
              <CircularProgress size={14} thickness={6} sx={{ color: 'var(--color-neutral-bg)' }} />
              <span>Thinking…</span>
            </div>
          )}

        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          background: 'var(--color-neutral-bg)',
          borderRadius: 'var(--radius-small)',
          padding: '6px 8px 7px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            minHeight: 122,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: '#9CA3AF',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                cursor: 'pointer',
              }}
              aria-label="Attach file"
            >
              <AttachFileIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.json,.csv,.pdf,.png,.jpg,.jpeg,.webp"
              style={{ display: 'none' }}
              onChange={handleFileAttach}
            />
          </div>
          {attachments.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {attachments.map(attachment => (
                <button
                  key={attachment.id}
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  style={{
                    border: '1px solid rgba(15, 23, 42, 0.1)',
                    background: '#F8FAFC',
                    color: 'var(--color-neutral-text)',
                    borderRadius: 999,
                    padding: '3px 8px',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                  title="Remove attachment"
                >
                  {attachment.name} ×
                </button>
              ))}
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            style={{
              width: '100%',
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--color-neutral-text)',
              padding: 0,
              fontSize: 14,
              lineHeight: 1.3,
              resize: 'none',
              minHeight: 72,
              maxHeight: 140,
              overflowY: 'auto',
              fontFamily: 'inherit',
            }}
            rows={3}
            placeholder="How can I help?.."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'rgba(15, 23, 42, 0.8)',
              fontSize: 13,
              padding: 0,
              outline: 'none',
              appearance: 'auto',
            }}
          >
            {CLAUDE_MODELS.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '1px solid #93C5FD',
              background: 'transparent',
              color: '#60A5FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              lineHeight: 1,
              padding: 0,
              cursor: 'pointer',
            }}
            aria-label="Send message"
          >
            <SendIcon sx={{ fontSize: 14 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
