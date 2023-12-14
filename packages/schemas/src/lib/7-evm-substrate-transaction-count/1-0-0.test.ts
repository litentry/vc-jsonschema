import * as fs from 'fs';

import { ajv } from '../ajv';
import { schema } from './1-0-0';

const examples = [
  'examples/a8/a8.json', // 1 network
  'examples/a8/a8.2.json', // 2 networks
];

const validate = ajv.compile(schema);

describe('7-evm-substrate-transaction-count/1-0-0', () => {
  it.each(examples)('should work for %s', (example) => {
    expect(validate.errors).toBeNull();

    const json = JSON.parse(fs.readFileSync(example, 'utf8'));
    const valid = validate(json);

    if (!valid) console.log(validate.errors);

    expect(valid).toBeTruthy();
  });
});
