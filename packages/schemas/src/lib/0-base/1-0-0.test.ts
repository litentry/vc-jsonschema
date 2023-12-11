import * as fs from 'fs';
import { globSync as glob } from 'fast-glob';

import { ajv } from '../ajv';
import { base as schema } from './1-0-0';

describe('0-base/1-0-0', () => {
  // all .json files on `examples` folder should be valid
  it('should validate all examples', () => {
    // this test is executed from root via NX, cwd is `/`.
    const jsonFiles = glob('examples/**/*.json');

    const validate = ajv.compile(schema);
    expect(validate.errors).toBeNull();

    for (let i = 0; i < jsonFiles.length; i++) {
      const file = jsonFiles[i];
      const json = JSON.parse(fs.readFileSync(file, 'utf8'));
      const valid = validate(json);

      if (!valid) {
        console.log(`Failed at validating ${file}: `, validate.errors);
        expect(valid).toBeTruthy();

        break;
      }
    }
  });
});
