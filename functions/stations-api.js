const { getChannels, setChannels } = require('./storage');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const channels = await getChannels();
      return res.status(200).json(channels || {
        list: [],
        resume: {},
        settings: {}
      });
    } catch (error) {
      console.error('Unable to load stations:', error);
      return res.status(500).json({ error: 'Unable to load stations.' });
    }
  }

  if (req.method === 'POST') {
    const channels = req.body;
    if (!channels || typeof channels !== 'object' || !Array.isArray(channels.list)) {
      return res.status(400).json({ error: 'Expected a collection with a list array.' });
    }

    const collection = {
      list: channels.list,
      resume: channels.resume && typeof channels.resume === 'object' ? channels.resume : {},
      settings: channels.settings && typeof channels.settings === 'object' ? channels.settings : {}
    };

    try {
      await setChannels(collection);
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Unable to save stations:', error);
      return res.status(500).json({ error: 'Unable to save stations.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed.' });
};
