import type { ValidateFunction } from 'ajv';
import type { JSONSchema7 } from 'json-schema';

import { getAjvInstance } from './ajv';

type Maybe<T> = T | null | undefined;

interface VerifiableCredentialLike extends Record<string, unknown> {
  '@context': Maybe<string[]>;
  id: Maybe<string>;
  credentialSchema: Maybe<{ id: Maybe<string>; type: Maybe<string> }>;
  type: Maybe<string[]>;
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
 *
 * @example
 * ```ts
 * import { validateVcSchema } from '@litentry/vc-schema-validator';
 *
 * // the vc's json string
 * const vc: string = '{"@context":["https://www.w3.org/2018/credentials/v1",..';
 *
 * // validate the vc
 * const { isValid, errors } = await validateVcSchema(vc);
 *
 * if (isValid) {
 *  console.log('The VC is valid');
 * } else {
 *  console.log('The VC is invalid:', errors);
 * }
 * ```
 */
export async function validateVcSchema(
  vc: string | VerifiableCredentialLike,
  options?: Options
): Promise<{ isValid: boolean; errors: string[] | undefined | null }> {
  const { fetchSchema } = { ...defaultOptions, ...options };

  let parsedVc: VerifiableCredentialLike;
  try {
    parsedVc = parseVc(vc);
  } catch (_) {
    return {
      isValid: false,
      errors: ['JsonParseError: Invalid VC value'],
    };
  }

  if (
    typeof parsedVc?.credentialSchema?.id !== 'string' ||
    typeof parsedVc?.credentialSchema?.type !== 'string'
  ) {
    return {
      isValid: false,
      errors: ['NotSupportedError: No schema found in the VC'],
    };
  }

  // fetch the schema
  let schema: JSONSchema7;
  try {
    schema = await fetchSchema(parsedVc.credentialSchema.id);
  } catch (e: any) {
    return {
      isValid: false,
      errors: [`HttpError: ${e.message}`],
    };
  }

  // compile
  let validate: ValidateFunction;

  const ajv = getAjvInstance();

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

function parseVc(
  vc: string | VerifiableCredentialLike
): VerifiableCredentialLike {
  if (!vc) {
    throw new Error('Invalid VC');
  }

  if (typeof vc === 'string') {
    return JSON.parse(vc) as VerifiableCredentialLike;
  }

  if (
    typeof vc.id !== 'string' ||
    !Array.isArray(vc['type'] || !Array.isArray(vc['@context']))
  ) {
    throw new Error('Invalid VC');
  }

  return vc;
}
