import { Pinecone } from '@pinecone-database/pinecone';
import { getDefaultNamespace } from './pineconeRecords';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const index = pinecone.Index(process.env.PINECONE_INDEX);
const PINECONE_API_VERSION = '2025-10';

let indexHostPromise;

async function getIndexHost() {
  if (!indexHostPromise) {
    indexHostPromise = pinecone.describeIndex(process.env.PINECONE_INDEX).then(details => details.host);
  }

  return indexHostPromise;
}

async function pineconeRequest(path, options = {}) {
  const host = await getIndexHost();
  const response = await fetch(`https://${host}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Api-Key': process.env.PINECONE_API_KEY,
      'X-Pinecone-Api-Version': PINECONE_API_VERSION,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Pinecone request failed.');
  }

  if (response.status === 201 || response.status === 204) {
    return null;
  }

  return response.json();
}

export async function describePineconeIndex() {
  const [details, stats] = await Promise.all([
    pinecone.describeIndex(process.env.PINECONE_INDEX),
    index.describeIndexStats(),
  ]);

  return {
    index: details.name,
    host: details.host,
    spec: details.spec,
    status: details.status,
    stats,
    environment: process.env.PINECONE_ENVIRONMENT || null,
  };
}

export async function upsertTextRecords(namespace = getDefaultNamespace(), records = []) {
  if (!records.length) {
    return;
  }

  const body = records.map(record => JSON.stringify(record)).join('\n');

  await pineconeRequest(`/records/namespaces/${encodeURIComponent(namespace)}/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-ndjson',
    },
    body,
  });
}

export async function searchTextRecords(message, namespaces = [getDefaultNamespace()], topK = 3) {
  const settled = await Promise.all(
    namespaces.map(async namespace => {
      const data = await pineconeRequest(`/records/namespaces/${encodeURIComponent(namespace)}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            inputs: { text: message },
            top_k: topK,
          },
          fields: ['text', 'source', 'orgId', 'documentType', 'timestamp', 'title', 'threadId', 'attachmentName', 'role'],
        }),
      });

      return (data?.result?.hits || []).map(hit => ({ ...hit, namespace }));
    })
  );

  return settled
    .flat()
    .sort((left, right) => (right._score || 0) - (left._score || 0));
}

export async function getContextForMessage(message, namespaces = [getDefaultNamespace()]) {
  const hits = await searchTextRecords(message, namespaces, 3);

  return hits.map(hit => ({
    id: hit._id,
    namespace: hit.namespace,
    score: hit._score,
    text: hit.fields?.text || '',
    source: hit.fields?.source,
    documentType: hit.fields?.documentType,
    timestamp: hit.fields?.timestamp,
    title: hit.fields?.title,
    attachmentName: hit.fields?.attachmentName,
    role: hit.fields?.role,
  }));
}
