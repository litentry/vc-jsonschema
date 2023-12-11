import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();

addFormats(ajv, {
  mode: 'fast',
  formats: ['date-time', 'uri'],
  keywords: true,
});

export { ajv };
