import { buildTextRecord } from '../../../utils/pineconeRecords';
import { getDefaultNamespace } from '../../../utils/pineconeRecords';
import { upsertTextRecords } from '../../../utils/pinecone';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const namespace = req.body?.namespace || getDefaultNamespace();
  const text = req.body?.text?.trim();

  if (!text) {
    return res.status(400).json({ error: 'Text content is required for Pinecone ingestion.' });
  }

  const record = buildTextRecord({
    text,
    source: req.body?.source || 'manual_ingest',
    orgId: req.body?.orgId || 'default',
    documentType: req.body?.documentType || 'org_note',
    title: req.body?.title,
    externalId: req.body?.externalId,
    metadata: req.body?.metadata || {},
  });

  try {
    await upsertTextRecords(namespace, [record]);
    return res.status(200).json({ ok: true, namespace, upsertedCount: 1, recordId: record._id });
  } catch (error) {
    console.error('Pinecone ingest failed:', error);
    return res.status(500).json({ error: error.message || 'Unable to upsert records to Pinecone.' });
  }
}