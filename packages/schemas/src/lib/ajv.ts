import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// See options https://ajv.js.org/options.html
const ajv = new Ajv({
  strictTuples: true,
});

addFormats(ajv, {
  mode: 'fast',
  formats: ['date-time', 'uri'],
  keywords: true,
});

export { ajv };
