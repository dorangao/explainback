import { callMeta } from '../src/meta.mjs';

// Synthetic connectivity probe, not a student example or a tutoring evaluation.
const expected = 'EXPLAINBACK_META_OK';
try {
  const result = await callMeta({
    apiKey: process.env.MODEL_API_KEY,
    model: process.env.META_MODEL || undefined,
    input: `This is a synthetic API connection test. Reply with exactly ${expected} and nothing else.`,
  });
  if (result.text !== expected) {
    throw new Error('Meta returned text, but it did not match the connection-test marker.');
  }
  console.log('PASS: live Meta connection returned the expected marker.');
  console.log(`Model: ${result.model}`);
  console.log(`Usage: ${JSON.stringify(result.usage ?? 'not reported')}`);
  console.log('Connectivity verified only; tutoring quality has not been evaluated.');
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}
