// Vercel serverless function — proxies DocuSeal API calls to avoid CORS issues
// API key stored server-side via Vercel Environment Variable (DOCUSEAL_API_KEY)

const DOCUSEAL_API_KEY = process.env.DOCUSEAL_API_KEY || 'inmzjT48jVAGrSH6tAtuV2pc9739wTQrzvh3fdMTkJv';
const DOCUSEAL_ENDPOINT = process.env.DOCUSEAL_ENDPOINT || 'https://api.docuseal.com';

// Increase body parser limit to 20MB (PDFs with images can be large)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { action, data } = req.body || {};

    let apiPath, method, requestBody;

    switch (action) {
      case 'test':
        apiPath = '/templates';
        method = 'GET';
        break;

      case 'create_template':
        apiPath = '/templates/pdf';
        method = 'POST';
        requestBody = JSON.stringify(data);
        break;

      case 'create_submission':
        apiPath = '/submissions';
        method = 'POST';
        requestBody = JSON.stringify(data);
        break;

      default:
        return res.status(400).json({ error: 'Invalid action. Use: test, create_template, or create_submission' });
    }

    const fetchOptions = {
      method,
      headers: {
        'X-Auth-Token': DOCUSEAL_API_KEY,
        'Content-Type': 'application/json'
      }
    };

    if (requestBody) {
      fetchOptions.body = requestBody;
    }

    const response = await fetch(`${DOCUSEAL_ENDPOINT}${apiPath}`, fetchOptions);
    const responseData = await response.text();

    return res.status(response.status).send(responseData);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
