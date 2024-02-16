import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const getAjvInstance = () => {
  // See options https://ajv.js.org/options.html
  const ajv = new Ajv({
    // CryptoSummary's assertion clauses have dynamic size, so we need to disable strict tuples.
    strictTuples: false,
  });

  addFormats(ajv, {
    mode: 'fast',
    formats: ['date-time', 'uri'],
    keywords: true,
  });

  return ajv;
};

export { getAjvInstance };
