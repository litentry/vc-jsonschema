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
  baseSchemaSpec: SchemaSpec;
  credentialSchemaSpecs: SchemaSpec[];
};

function load(spec: VersionSpec): VersionData {
  const schemaFiles = glob(`packages/schemas/src/lib/**/${spec.version}.ts`);

  let baseSchema = null as SchemaSpec | null;
  const credentialSchemaSpecs: SchemaSpec[] = [];

  schemaFiles
    .filter((filePath) =>
      FILENAME_TO_DEBUG ? filePath.indexOf(FILENAME_TO_DEBUG) > -1 : true
    )
    .forEach((filePath) => {
      // e.g.: packages/schemas/src/lib/0-base/1-0-0.ts
      const pathAsChunks = filePath.split('/');
      // e.g.: 1-0-0.ts
      const fileName = pathAsChunks.slice(-1)[0];
      // e.g.: 1-0-0
      const folderName = pathAsChunks.slice(0, -1).slice(-1)[0];

      const schema = {
        name: folderName,
        importPath: `../../lib/${folderName}/${fileName}`,
      };

      if (folderName === '0-base') {
        baseSchema = schema;
      } else {
        credentialSchemaSpecs.push(schema);
      }
    });

  if (!FILENAME_TO_DEBUG) {
    expect(baseSchema).not.toBeNull();
  }

  return {
    ...spec,
    baseSchemaSpec: baseSchema as SchemaSpec,
    credentialSchemaSpecs,
  };
}

const VERSION_DATA: VersionData[] = [
  { version: '1-0-0', compatibleVersionGlob: '1-*-*' },
  { version: '1-1-0', compatibleVersionGlob: '1-*-*' },
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

describe.each(VERSION_DATA)(
  'Schema $version should accept $compatibleVersionGlob certificates',
  ({
    version,
    compatibleVersionGlob,
    baseSchemaSpec,
    credentialSchemaSpecs,
  }) => {
    test('base schema should accept all certificates', async () => {
      // Import schema definition
      const { schema } = await import(baseSchemaSpec.importPath);
      expect(schema.$id).toBeDefined();
      expect(schema.$schema).toBeDefined();

      // Compile schema
      const validate = ajv.compile(schema);
      expect(validate.errors).toBeNull();

      const examplePaths = glob(
        `../examples/${compatibleVersionGlob}/**/*.json`
      );
      for (const examplePath of examplePaths) {
        const example = JSON.parse(readFileSync(examplePath, 'utf8'));
        const isValid = validate(example);

        if (!isValid) {
          fail(new ValidationError(examplePath, validate.errors));
        }
      }
    });

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
