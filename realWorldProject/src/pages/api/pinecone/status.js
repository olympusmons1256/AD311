import { describePineconeIndex } from '../../../utils/pinecone';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const details = await describePineconeIndex();
    return res.status(200).json(details);
  } catch (error) {
    console.error('Unable to load Pinecone status:', error);
    return res.status(500).json({ error: 'Unable to load Pinecone status.' });
  }
}