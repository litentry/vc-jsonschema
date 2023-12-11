import { ajv } from '../ajv';
import { schema } from './1-0-0';

describe('0-base/1-0-0', () => {
  it('should compile', () => {
    const validate = ajv.compile(schema);
    expect(validate).toBeTruthy();
  });
});
