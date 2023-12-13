import * as fs from 'fs';

import { ajv } from '../ajv';
import { schema } from './1-0-0';

const tokenHoldingTimeExamples = [
  'examples/a4/a4.json',
  'examples/a7/a7.json',
  'examples/a10/a10.json',
];

describe('4-token-holding-time/1-0-0', () => {
  it.each(tokenHoldingTimeExamples)('should work for %s', (example) => {
    const validate = ajv.compile(schema);
    expect(validate.errors).toBeNull();

    const json = JSON.parse(fs.readFileSync(example, 'utf8'));
    const valid = validate(json);

    if (!valid) console.log(validate.errors);

    expect(valid).toBeTruthy();
  });
});
