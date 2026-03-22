function extractTextFromHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function readApiResponse(response, fallbackMessage = 'Request failed.') {
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  let data = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const htmlMessage = contentType.includes('text/html') ? extractTextFromHtml(rawText) : '';
    const errorMessage = data?.error || data?.message || htmlMessage || fallbackMessage;
    throw new Error(errorMessage);
  }

  if (data !== null) {
    return data;
  }

  if (!rawText) {
    return null;
  }

  const htmlMessage = contentType.includes('text/html') ? extractTextFromHtml(rawText) : '';
  throw new Error(htmlMessage || fallbackMessage);
}