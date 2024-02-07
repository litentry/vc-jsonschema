import * as fs from 'fs';

import { ajv } from '../ajv';
import { schema } from './1-0-0';

describe('16-bnb-domain-holding-amount/1-0-0', () => {
  it.skip('should work', () => {
    const validate = ajv.compile(schema);
    expect(validate.errors).toBeNull();

    const json = JSON.parse(
      fs.readFileSync(
        'examples/bnb-domain-holding-amount/16-bnb-domain-holding-amount.json',
        'utf8'
      )
    );
    const valid = validate(json);

    if (!valid) console.log(validate.errors);

    expect(valid).toBeTruthy();
  });
});
