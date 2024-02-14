import type { ValidateFunction } from 'ajv';
import type { JSONSchema7 } from 'json-schema';

import { ajv } from './ajv';
import {
  JsonParseError,
  NotSupportedError,
  HttpError,
  SchemaError,
  ValidationError,
} from './errors';

interface VerifiableCredentialLike extends Record<string, unknown> {
  jsonschema: string | undefined | null;
  type: string[] | undefined | null;
}

/**
 *
 * @throws {Error} if there is an error parsing the VC JSON or its schema.
 */
export async function validateVcSchema(vc: string): Promise<boolean> {
  if (typeof vc !== 'string') {
    return false;
  }

  let parsedVc: VerifiableCredentialLike;
  try {
    parsedVc = JSON.parse(vc) as VerifiableCredentialLike;
  } catch (_) {
    throw new JsonParseError();
  }

  if (typeof parsedVc.jsonschema !== 'string') {
    throw new NotSupportedError('No schema found in the VC JSON');
  }

  // fetch the schema
  let schema: JSONSchema7;
  try {
    const response = await fetch(parsedVc.jsonschema);
    if (response.status !== 200) {
      throw new HttpError('Failed to fetch the schema');
    }

    const isText = response.headers.get('content-type')?.includes('text/plain');

    schema = isText ? JSON.parse(await response.text()) : await response.json();
  } catch (_) {
    throw new HttpError('Failed to download or parse the schema');
  }

  // compile
  let validate: ValidateFunction;

  try {
    validate = await ajv.compileAsync(schema);
  } catch (e: any) {
    throw new SchemaError(`Failed to compile the schema: ${e.message}`);
  }

  // validate
  const isValid = validate(parsedVc);

  if (validate.errors?.length) {
    const errors = validate.errors.map(
      (e) => `${e.message || ''}: ${JSON.stringify(e)}`
    );
    throw new ValidationError(errors);
  }

  return isValid;
}
