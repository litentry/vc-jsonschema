import * as fs from 'fs';
import * as path from 'path';
import { globSync as glob } from 'fast-glob';

import { ajv } from '../src/lib/ajv';

const OUTPUT_FOLDER = 'dist/schemas';

// relative path to the root of the project
const schemaFiles = glob('packages/schemas/src/lib/**/[01]-[01]-[01].ts');

beforeAll(() => {
  // remove the output folder
  fs.rmSync(OUTPUT_FOLDER, { recursive: true, force: true });
});

it.each(schemaFiles)('generate schema for %s', async (file) => {
  // e.g.: packages/schemas/src/lib/0-base/1-0-0.ts
  const pathAsChunks = file.split('/');
  // e.g.: 1-0-0.ts
  const fileName = pathAsChunks.slice(-1)[0];
  // e.g.: 0-base
  const folderName = pathAsChunks.slice(0, -1).slice(-1)[0];

  const { schema } = await import(`./lib/${folderName}/${fileName}`);

  expect(schema.$id).toBeDefined();
  expect(schema.$schema).toBeDefined();

  const validate = ajv.compile(schema);
  expect(validate.errors).toBeNull();

  const jsonSchema = JSON.stringify(validate.schema, null, 2);

  // e.g packages/schemas/dist/schemas/0-base
  const outputPath = `${OUTPUT_FOLDER}/${folderName}`;

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // e.g packages/schemas/dist/schemas/0-base/1-0-0.json
  fs.writeFileSync(
    path.join(outputPath, `${fileName.replace('.ts', '.json')}`),
    jsonSchema,
    'utf8'
  );
});
