import { describe, expect, test } from '@jest/globals';

import { readFileSync } from 'fs';
import { globSync as glob } from 'fast-glob';

import { ajv } from '../lib/ajv';
import { ValidateFunction } from 'ajv';

type VersionSpec = {
  version: string;
  compatibleVersionGlob: string;
};

class ValidationError extends Error {
  public readonly path: string;
  public readonly errors: ValidateFunction<unknown>['errors'];
  constructor(path: string, errors: ValidateFunction<unknown>['errors']) {
    super(`Failed at validating ${path}: , ${JSON.stringify(errors)}`);
    this.path = path;
    this.errors = errors;
  }
}

const BASE_VERSION_DATA: VersionSpec[] = [
  { version: '1-0-0', compatibleVersionGlob: '1-0-0' },
  { version: '1-1-0', compatibleVersionGlob: '*-*-*' },
];

const BASE_SCHEMA_EXCEPTIONS = [
  {
    comment: '20-token-holding-amount@1-1-0 allows empty assertions',
    version: '1-1-0',
    path: 'examples/1-1-0/20-token-holding-amount-list/20-token-holding-amount-list-empty.json',
  },
];

const isException = (version: string, path: string) => {
  return BASE_SCHEMA_EXCEPTIONS.some(
    (exception) => exception.version === version && exception.path === path
  );
};

describe.each(BASE_VERSION_DATA)(
  'Base Schema version $version should accept $compatibleVersionGlob credentials',
  ({ version, compatibleVersionGlob }) => {
    let schema: any;
    let validate: ValidateFunction;
    const examplePaths = glob(`examples/${compatibleVersionGlob}/**/*.json`);

    beforeAll(async () => {
      const { schema: _schema } = await import(`../lib/0-base/${version}`);
      schema = _schema;

      // Compile schema
      validate = ajv.compile(schema);
    });

    test('is valid', () => {
      expect(schema.$id).toBeDefined();
      expect(schema.$schema).toBeDefined();
      expect(validate.errors).toBeNull();
    });

    test.each(examplePaths)('%s', async (examplePath: string) => {
      const example = JSON.parse(readFileSync(examplePath, 'utf8'));
      const isValid = validate(example);

      if (!isValid && !isException(version, examplePath)) {
        throw new ValidationError(examplePath, validate.errors);
      }
    });
  }
);
