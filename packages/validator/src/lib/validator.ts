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

type Options = {
  fetchSchema: (url: string) => Promise<JSONSchema7>;
};

const defaultOptions: Options = {
  fetchSchema: fetchSchemaFn,
};

/**
 * Validates a Verifiable Credential against its JSON schema.
 *
 * @param vc - The Verifiable Credential to validate.
 * @param options - The options to use for validation.
 *
 * @returns `true` if the VC is valid, `false` otherwise.
 *
 * @throws {JsonParseError} if the VC JSON is invalid.
 * @throws {NotSupportedError} if the VC JSON does not contain a schema.
 * @throws {HttpError} if there is an error fetching the schema.
 * @throws {SchemaError} if there is an error parsing the schema.
 * @throws {ValidationError} if the VC is invalid.
 */
export async function validateVcSchema(
  vc: string,
  options: Options
): Promise<boolean> {
  if (typeof vc !== 'string') {
    return false;
  }

  const { fetchSchema } = { ...defaultOptions, ...options };

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
  const schema = await fetchSchema(parsedVc.jsonschema);

  // compile
  let validate: ValidateFunction;

  try {
    validate = ajv.compile(schema);
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

async function fetchSchemaFn(url: string): Promise<JSONSchema7> {
  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new HttpError('Failed to fetch the schema');
    }

    const isText = response.headers.get('content-type')?.includes('text/plain');

    if (isText) {
      const text = await response.text();
      return JSON.parse(text);
    }

    const json = await response.json();

    return json;
  } catch (_) {
    throw new HttpError('Failed to download or parse the schema');
  }
}
