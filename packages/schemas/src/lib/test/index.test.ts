import { describe, expect, test } from '@jest/globals';

import { readFileSync } from 'fs';
import { globSync as glob } from 'fast-glob';

import { ajv } from '../ajv';
import { ValidateFunction } from 'ajv';

const FILENAME_TO_DEBUG = ''; // update to debug a single file

type VersionSpec = {
  version: string;
  compatibleVersionGlob: string;
};

type SchemaSpec = {
  name: string;
  importPath: string;
};

type VersionData = {
  version: string;
  compatibleVersionGlob: string;
  credentialSchemaSpecs: SchemaSpec[];
};

function load(spec: VersionSpec): VersionData {
  const schemaFiles = glob(`packages/schemas/src/lib/**/${spec.version}.ts`);

  const credentialSchemaSpecs: SchemaSpec[] = [];

  schemaFiles
    .filter((filePath) =>
      FILENAME_TO_DEBUG ? filePath.indexOf(FILENAME_TO_DEBUG) > -1 : true
    )
    .forEach((filePath) => {
      // e.g.: given 'packages/schemas/src/lib/1-basic-identity-verification/1-0-0.ts'
      // -> [packages, schemas, src, lib, 1-basic-identity-verification, 1-0-0.ts]
      const pathAsChunks = filePath.split('/');
      // -> 1-0-0.ts
      const fileName = pathAsChunks.slice(-1)[0];
      // -> 1-basic-identity-verification
      const folderName = pathAsChunks.slice(0, -1).slice(-1)[0];

      const schema = {
        name: folderName,
        importPath: `../../lib/${folderName}/${fileName}`,
      };

      if (folderName === '0-base') {
        // skip base. it's handled separately
      } else {
        credentialSchemaSpecs.push(schema);
      }
    });

  return {
    ...spec,
    credentialSchemaSpecs,
  };
}

const SCHEMA_VERSION_DATA: VersionData[] = [
  { version: '1-0-0', compatibleVersionGlob: '1-0-0' },
  { version: '1-1-0', compatibleVersionGlob: '1-[01]-0' },
  { version: '1-1-1', compatibleVersionGlob: '1-[01]-[01]' },
].map(load);

class ValidationError extends Error {
  public readonly path: string;
  public readonly errors: ValidateFunction<unknown>['errors'];
  constructor(path: string, errors: ValidateFunction<unknown>['errors']) {
    super(`Failed at validating ${path}: , ${JSON.stringify(errors)}`);
    this.path = path;
    this.errors = errors;
  }
}

const schemasWithNoExamples: string[] = [];

afterAll(() => {
  if (schemasWithNoExamples.length > 0) {
    console.warn(
      '[warning]: The following schemas have no examples:',
      schemasWithNoExamples
    );
  }
});

describe('Base schemas', () => {
  const baseVersionData: VersionSpec[] = [
    { version: '1-0-0', compatibleVersionGlob: '1-0-0' },
    { version: '1-1-0', compatibleVersionGlob: '*-*-*' },
  ];

  const exceptions = [
    {
      comment: '20-token-holding-amount@1-1-0 allows empty assertions',
      version: '1-1-0',
      path: 'examples/1-1-0/20-token-holding-amount-list/20-token-holding-amount-list-empty.json',
    },
  ];

  const isException = (version: string, path: string) => {
    return exceptions.some(
      (exception) => exception.version === version && exception.path === path
    );
  };

  describe.each(baseVersionData)(
    'Base Schema version $version should accept $compatibleVersionGlob credentials',
    ({ version, compatibleVersionGlob }) => {
      let schema: any;
      let validate: ValidateFunction;
      const examplePaths = glob(`examples/${compatibleVersionGlob}/**/*.json`);

      beforeAll(async () => {
        const { schema: _schema } = await import(`../../lib/0-base/${version}`);
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
});

describe.each(SCHEMA_VERSION_DATA)(
  'Schema $version should accept $compatibleVersionGlob certificates',
  ({ version, compatibleVersionGlob, credentialSchemaSpecs }) => {
    test.each(credentialSchemaSpecs)(
      '$name schema should accept $name certificates',
      async ({ name, importPath }) => {
        // Import schema definition. Node.js module imports are relative to the file location.
        const { schema } = await import(importPath);

        expect(schema.$id).toBeDefined();
        expect(schema.$schema).toBeDefined();

        // Compile schema
        const validate = ajv.compile(schema);
        expect(validate.errors).toBeNull();

        const examplePaths = glob(
          // Heads-up: File reading is relative to the root of the project
          `examples/${compatibleVersionGlob}/${name}/*.json`
        );

        if (examplePaths.length === 0) {
          schemasWithNoExamples.push(`${version}/${name}`);
        }

        for (const examplePath of examplePaths) {
          const example = JSON.parse(readFileSync(examplePath, 'utf8'));
          const isValid = validate(example);

          if (!isValid) {
            throw new ValidationError(examplePath, validate.errors);
          }
        }
      }
    );
  }
);
