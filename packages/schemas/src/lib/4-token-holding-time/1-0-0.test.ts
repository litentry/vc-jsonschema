import * as fs from 'fs';

import { ajv } from '../ajv';
import { schema } from './1-0-0';

const tokenHoldingTimeExamples = [
  'examples/a4/a4.json', // LIT
  'examples/a7/a7.json', // DOT
  'examples/a10/a10.json', // WBTC
  'examples/a11/a11.json', // ETH
];

const validate = ajv.compile(schema);

describe('4-token-holding-time/1-0-0', () => {
  it.each(tokenHoldingTimeExamples)('should work for %s', (example) => {
    expect(validate.errors).toBeNull();

    const json = JSON.parse(fs.readFileSync(example, 'utf8'));
    const valid = validate(json);

    if (!valid) console.log(validate.errors);

    expect(valid).toBeTruthy();
  });
});
