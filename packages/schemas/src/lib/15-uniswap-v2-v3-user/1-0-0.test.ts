import * as fs from 'fs';
import { globSync as glob } from 'fast-glob';

import { ajv } from '../ajv';
import { schema } from './1-0-0';

const jsonFiles = glob('examples/15-uniswap-v2-v3-user/*.json');

const validate = ajv.compile(schema);

describe('15-uniswap-v2-v3-user/1-0-0', () => {
  it.each(jsonFiles)('should work for %s', (example) => {
    expect(validate.errors).toBeNull();

    const json = JSON.parse(fs.readFileSync(example, 'utf8'));
    const valid = validate(json);

    if (!valid) console.log(validate.errors);

    expect(valid).toBeTruthy();
  });
});
