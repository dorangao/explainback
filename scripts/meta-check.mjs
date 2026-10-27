import { DEFAULT_META_MODEL, META_ENDPOINT } from '../src/meta.mjs';

const configured = Boolean(process.env.MODEL_API_KEY?.trim());
console.log(`Endpoint: ${META_ENDPOINT}`);
console.log(`Model: ${process.env.META_MODEL || DEFAULT_META_MODEL}`);
console.log(`API key: ${configured ? 'configured (value hidden)' : 'missing'}`);
console.log('Configuration check only; no request sent and no credit spent.');
if (!configured) process.exitCode = 1;
