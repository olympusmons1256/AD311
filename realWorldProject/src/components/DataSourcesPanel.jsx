import { useEffect, useMemo, useRef, useState } from 'react';
import { buildOrgNamespace, buildThreadNamespace } from '../utils/pineconeRecords';
import { readApiResponse } from '../utils/readApiResponse';

const DOCUMENT_TYPES = [
  { value: 'pdf_chunk', label: 'PDF chunk' },
  { value: 'slack_thread', label: 'Slack thread' },
  { value: 'image_ocr', label: 'Image / OCR text' },
  { value: 'org_note', label: 'Manual organization note' },
  { value: 'chat_attachment', label: 'Chat attachment' },
  { value: 'chat_turn', label: 'Prior chat turn' },
];

function readFileAsText(file) {
  return file.text();
}

export default function DataSourcesPanel({ isOpen, onClose, orgId = 'default', threadId }) {
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [form, setForm] = useState({
    orgId,
    namespace: buildOrgNamespace(orgId),
    source: 'organization_upload',
    documentType: 'org_note',
    title: '',
    text: '',
    externalId: '',
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setForm(current => ({ ...current, orgId, namespace: buildOrgNamespace(orgId) }));
  }, [orgId]);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setLoadingStatus(true);

    fetch('/api/pinecone/status')
      .then(async response => {
        const data = await readApiResponse(response, 'Unable to load Pinecone status.');
        if (active) {
          setStatus(data);
        }
      })
      .catch(error => {
        if (active) {
          setStatus({ error: error.message });
        }
      })
      .finally(() => {
        if (active) {
          setLoadingStatus(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  const namespaces = useMemo(() => {
    return {
      defaultNamespace: '__default__',
      organizationNamespace: buildOrgNamespace(orgId),
      threadNamespace: buildThreadNamespace(threadId || 'current-session'),
    };
  }, [orgId, threadId]);

  if (!isOpen) {
    return null;
  }

  const updateForm = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleFileSelect = async event => {
    const [file] = Array.from(event.target.files || []);
    if (!file) return;

    try {
      const text = await readFileAsText(file);
      setForm(current => ({
        ...current,
        title: current.title || file.name,
        text,
        documentType: file.type === 'application/json' ? 'slack_thread' : current.documentType,
      }));
      setResult({ kind: 'info', message: `Loaded ${file.name} into the ingest form.` });
    } catch (error) {
      setResult({ kind: 'error', message: `Unable to read ${file.name} as text. For PDFs/images, add extracted text or OCR output first.` });
    }
  };

  const submitIngest = async event => {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/pinecone/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: form.orgId,
          namespace: form.namespace,
          source: form.source,
          documentType: form.documentType,
          title: form.title,
          text: form.text,
          externalId: form.externalId,
          metadata: {
            connectedFrom: 'data_sources_panel',
          },
        }),
      });
      const data = await readApiResponse(response, 'Unable to ingest records.');

      setResult({
        kind: 'success',
        message: `Upserted ${data.upsertedCount} record(s) into ${data.namespace}.`,
      });
      setForm(current => ({ ...current, title: '', text: '', externalId: '' }));
    } catch (error) {
      setResult({ kind: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 44,
        right: 8,
        width: 340,
        maxHeight: 'calc(100vh - 56px)',
        overflowY: 'auto',
        background: 'var(--color-chat-bg)',
        color: 'var(--color-neutral-bg)',
        borderRadius: 'var(--radius-small)',
        boxShadow: '0 20px 44px rgba(15, 23, 42, 0.26)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 20,
      }}
    >
      <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Add data source</div>
          <div style={{ fontSize: 11, opacity: 0.72 }}>Upload a file or paste text to make it available in chat.</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--color-neutral-bg)',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
            padding: 0,
            opacity: 0.9,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: 12, display: 'grid', gap: 10 }}>
        <div
          style={{
            border: '1px dashed rgba(255, 255, 255, 0.18)',
            borderRadius: 'var(--radius-small)',
            padding: 12,
            background: 'rgba(255, 255, 255, 0.04)',
            display: 'grid',
            gap: 8,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: 'var(--color-neutral-bg)' }}>Upload file</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.45 }}>
              Supports text, markdown, JSON, and CSV files. For PDFs or images, paste extracted text below.
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'var(--color-neutral-bg)',
              color: 'var(--color-neutral-text)',
              borderRadius: 'var(--radius-small)',
              padding: '10px 12px',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 500,
            }}
          >
            Choose file
          </button>
          <input ref={fileInputRef} type="file" accept=".txt,.md,.json,.csv" style={{ display: 'none' }} onChange={handleFileSelect} />
        </div>

        <form
          onSubmit={submitIngest}
          style={{
            display: 'grid',
            gap: 10,
            background: 'var(--color-neutral-bg)',
            color: 'var(--color-neutral-text)',
            borderRadius: 'var(--radius-small)',
            padding: 12,
          }}
        >
          <label style={{ fontSize: 11.5, fontWeight: 500 }}>
            Title
            <input
              value={form.title}
              onChange={e => updateForm('title', e.target.value)}
              placeholder="Name this upload"
              style={{
                width: '100%',
                marginTop: 4,
                padding: '10px 12px',
                borderRadius: 'var(--radius-small)',
                border: '1px solid rgba(15, 23, 42, 0.12)',
                background: '#F8FAFC',
                color: 'var(--color-neutral-text)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </label>
          <label style={{ fontSize: 11.5, fontWeight: 500 }}>
            Text content
            <textarea
              value={form.text}
              onChange={e => updateForm('text', e.target.value)}
              rows={8}
              placeholder="Paste notes, extracted text, OCR output, or normalized content"
              style={{
                width: '100%',
                marginTop: 4,
                resize: 'vertical',
                padding: '10px 12px',
                borderRadius: 'var(--radius-small)',
                border: '1px solid rgba(15, 23, 42, 0.12)',
                background: '#F8FAFC',
                color: 'var(--color-neutral-text)',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </label>

          <div style={{ display: 'grid', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowAdvanced(current => !current)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                textAlign: 'left',
                fontSize: 11.5,
                color: 'rgba(15, 23, 42, 0.72)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
            </button>

            {showAdvanced && (
              <div style={{ display: 'grid', gap: 10, padding: 10, border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: 'var(--radius-small)', background: '#F8FAFC' }}>
                <label style={{ fontSize: 11.5, fontWeight: 500 }}>
                  Data type
                  <select value={form.documentType} onChange={e => updateForm('documentType', e.target.value)} style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 'var(--radius-small)', border: '1px solid rgba(15, 23, 42, 0.12)', background: 'var(--color-neutral-bg)', color: 'var(--color-neutral-text)', outline: 'none' }}>
                    {DOCUMENT_TYPES.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label style={{ fontSize: 11.5, fontWeight: 500 }}>
                  Source label
                  <input value={form.source} onChange={e => updateForm('source', e.target.value)} style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 'var(--radius-small)', border: '1px solid rgba(15, 23, 42, 0.12)', background: 'var(--color-neutral-bg)', color: 'var(--color-neutral-text)', outline: 'none', boxSizing: 'border-box' }} />
                </label>
                <label style={{ fontSize: 11.5, fontWeight: 500 }}>
                  External ID
                  <input value={form.externalId} onChange={e => updateForm('externalId', e.target.value)} style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 'var(--radius-small)', border: '1px solid rgba(15, 23, 42, 0.12)', background: 'var(--color-neutral-bg)', color: 'var(--color-neutral-text)', outline: 'none', boxSizing: 'border-box' }} />
                </label>
                <label style={{ fontSize: 11.5, fontWeight: 500 }}>
                  Org ID
                  <input value={form.orgId} onChange={e => updateForm('orgId', e.target.value)} style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 'var(--radius-small)', border: '1px solid rgba(15, 23, 42, 0.12)', background: 'var(--color-neutral-bg)', color: 'var(--color-neutral-text)', outline: 'none', boxSizing: 'border-box' }} />
                </label>
                <label style={{ fontSize: 11.5, fontWeight: 500 }}>
                  Namespace
                  <input value={form.namespace} onChange={e => updateForm('namespace', e.target.value)} style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 'var(--radius-small)', border: '1px solid rgba(15, 23, 42, 0.12)', background: 'var(--color-neutral-bg)', color: 'var(--color-neutral-text)', outline: 'none', boxSizing: 'border-box' }} />
                </label>
                <div style={{ fontSize: 11, color: 'rgba(15, 23, 42, 0.65)', lineHeight: 1.45 }}>
                  Default namespaces: {namespaces.organizationNamespace} and {namespaces.threadNamespace}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 11.5, color: 'rgba(15, 23, 42, 0.72)' }}>
              {loadingStatus ? 'Checking connection…' : `Ready${status?.stats?.totalRecordCount != null ? ` · ${status.stats.totalRecordCount} records` : ''}`}
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{ border: 'none', background: 'var(--color-secondary)', color: '#fff', borderRadius: 'var(--radius-small)', padding: '9px 14px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 6px 18px rgba(59, 130, 246, 0.28)' }}
            >
              {submitting ? 'Uploading…' : 'Upload'}
            </button>
          </div>

          {result && (
            <div
              style={{
                fontSize: 11.5,
                color: result.kind === 'error' ? 'var(--color-error)' : result.kind === 'success' ? 'var(--color-success)' : 'var(--color-neutral-text)',
                background: result.kind === 'error' ? 'rgba(239, 68, 68, 0.08)' : result.kind === 'success' ? 'rgba(16, 185, 129, 0.08)' : '#F8FAFC',
                border: result.kind === 'error' ? '1px solid rgba(239, 68, 68, 0.18)' : result.kind === 'success' ? '1px solid rgba(16, 185, 129, 0.18)' : '1px solid rgba(15, 23, 42, 0.08)',
                borderRadius: 'var(--radius-small)',
                padding: '8px 10px',
                lineHeight: 1.4,
              }}
            >
              {result.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}