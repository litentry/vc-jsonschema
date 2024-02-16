import * as fs from 'fs';
import * as path from 'path';
import { globSync as glob } from 'fast-glob';

import { validateVcSchema } from '../validator';

const SCHEMAS_DIR = 'dist/schemas';

const vcList = glob('packages/validator/src/lib/__tests__/fixtures/*.json');

// Mock the schema fetcher against our local schemas.
// the path must match the jsonschema URL
const fetchSchemaMock = jest.fn().mockImplementation(async (url) => {
  // e.g https://raw.githubusercontent.com/.../schemas/12-idhub-evm-version-early-bird/1-0-0.json
  const chunks = url.split('/');
  // e.g [SCHEMAS_DIR, '12-idhub-evm-version-early-bird', '1-0-0.json']
  const schemaPath = path.join(SCHEMAS_DIR, ...chunks.slice(-2));

  expect(fs.existsSync(schemaPath)).toBe(true);

  const json = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  // url must match
  expect(json['$id']).toEqual(url);

  return json;
});

it.each(vcList)('validates %s', async (vcFile) => {
  const vc: string = fs.readFileSync(vcFile, 'utf8');

  const { isValid, errors } = await validateVcSchema(vc, {
    fetchSchema: fetchSchemaMock,
  });
  if (errors) {
    console.log({ errors });
  }

  expect(isValid).toBe(true);
  expect(errors).not.toBeTruthy();
});

it('accepts an object as vc arg', async () => {
  const vc: string = fs.readFileSync(vcList[0], 'utf8');
  const parsedVc = JSON.parse(vc);

  const { isValid, errors } = await validateVcSchema(parsedVc, {
    fetchSchema: fetchSchemaMock,
  });

  if (errors) {
    console.log({ errors });
  }

  expect(isValid).toBe(true);
  expect(errors).not.toBeTruthy();
});
