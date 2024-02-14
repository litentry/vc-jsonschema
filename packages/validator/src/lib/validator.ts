import type { ValidateFunction } from 'ajv';
import type { JSONSchema7 } from 'json-schema';

import { ajv } from './ajv';

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
 * @returns A promise that resolves to an object with the following properties:
 * - `isValid` - A boolean indicating whether the Verifiable Credential is valid.
 * - `errors` - An array of strings describing the validation errors, if any.
 */
export async function validateVcSchema(
  vc: string,
  options: Options
): Promise<{ isValid: boolean; errors: string[] | undefined | null }> {
  if (typeof vc !== 'string') {
    return {
      isValid: false,
      errors: ['NotSupportedError: VC should be a string'],
    };
  }

  const { fetchSchema } = { ...defaultOptions, ...options };

  let parsedVc: VerifiableCredentialLike;
  try {
    parsedVc = JSON.parse(vc) as VerifiableCredentialLike;
  } catch (_) {
    return {
      isValid: false,
      errors: ['JsonParseError: Failed to parse the VC'],
    };
  }

  if (typeof parsedVc.jsonschema !== 'string') {
    return {
      isValid: false,
      errors: ['NotSupportedError: No schema found in the VC'],
    };
  }

  // fetch the schema
  let schema: JSONSchema7;
  try {
    schema = await fetchSchema(parsedVc.jsonschema);
  } catch (e: any) {
    return {
      isValid: false,
      errors: [`HttpError: ${e.message}`],
    };
  }

  // compile
  let validate: ValidateFunction;

  try {
    validate = ajv.compile(schema);
  } catch (e: any) {
    return {
      isValid: false,
      errors: [`SchemaError: Failed to compile the schema: ${e.message}`],
    };
  }

  // validate
  const isValid = validate(parsedVc);

  if (validate.errors?.length) {
    const errors = validate.errors.map((e) => JSON.stringify(e));
    return { isValid: false, errors: ['SchemaError', ...errors] };
  }

  return { isValid, errors: null };
}

async function fetchSchemaFn(url: string): Promise<JSONSchema7> {
  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error('Failed to fetch the schema');
    }

    const isText = response.headers.get('content-type')?.includes('text/plain');

    if (isText) {
      const text = await response.text();
      return JSON.parse(text);
    }

    const json = await response.json();

    return json;
  } catch (_) {
    throw new Error('Failed to download or parse the schema');
  }
}
