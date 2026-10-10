const alexaHandler = require('./alexa');

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const rawBody = Buffer.concat(chunks).toString('utf8');
    const params = JSON.parse(rawBody);
    const publicUrl = (process.env.PUBLIC_URL || `https://${req.headers.host}`)
      .replace(/\/+$/, '');
    const result = await alexaHandler({
      http: {
        headers: req.headers,
        body: rawBody
      },
      params,
      publicUrl
    });

    res.status(result.statusCode);
    Object.entries(result.headers || {}).forEach(([name, value]) => {
      res.setHeader(name, value);
    });
    return res.send(result.body);
  } catch (error) {
    console.error('Unable to process Alexa request:', error);
    return res.status(400).json({ error: 'Invalid Alexa request.' });
  }
};

handler.config = {
  api: {
    bodyParser: false
  }
};

module.exports = handler;
