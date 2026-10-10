const { Redis } = require('@upstash/redis');

let redis;

function getRedis() {
  if (redis) {
    return redis;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
  }

  redis = new Redis({ url, token });
  return redis;
}

async function getChannels() {
  return getRedis().get('channels');
}

async function setChannels(channels) {
  await getRedis().set('channels', channels);
}

module.exports = { getChannels, setChannels };
