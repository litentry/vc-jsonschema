import * as fs from 'fs';

import { ajv } from '../ajv';
import { schema } from './1-0-0';

describe('13-idhub-evm-version-early-bird/1-0-0', () => {
  it('should work', () => {
    const validate = ajv.compile(schema);
    expect(validate.errors).toBeNull();

    const json = JSON.parse(
      fs.readFileSync(
        'examples/13-idhub-evm-version-early-bird/idhub-evm-version-early-bird.json',
        'utf8'
      )
    );
    const valid = validate(json);

    if (!valid) console.log(validate.errors);

    expect(valid).toBeTruthy();
  });
});
