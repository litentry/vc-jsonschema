import * as fs from 'fs';

import { ajv } from '../ajv';
import { schema } from './1-0-0';

describe('8-decoded-2022-basic-special-badge/1-0-0', () => {
  it('should work', () => {
    const validate = ajv.compile(schema);
    expect(validate.errors).toBeNull();

    const json = JSON.parse(
      fs.readFileSync(
        'examples/8-decoded-2022-basic-special-badge/decoded-2022-basic-special-badge.json',
        'utf8'
      )
    );
    const valid = validate(json);

    if (!valid) console.log(validate.errors);

    expect(valid).toBeTruthy();
  });
});
