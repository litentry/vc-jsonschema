import type { JSONSchema7 } from 'json-schema';

/**
 * JSONSchema to represent JSON formats like:
 * ```json
 * {
 *  id: "did:example:123",
 *  type: "Twitter username",
 *  description: "Twitter",
 *  values: [true],
 *  endpoint: "https://twitter.com/username",
 *  assertions: [{ ... }]
 * }
 * ```
 */
export const credentialSubject = (args: {
  title?: string;
  assertions: JSONSchema7;
  assertionsProps?: JSONSchema7;
}): JSONSchema7 => ({
  title: args.title || 'Litentry Verifiable Credential Subject',
  type: 'object',
  required: ['id', 'type', 'values', 'endpoint', 'assertions'],
  properties: {
    id: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    values: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'boolean',
      },
    },
    endpoint: {
      type: 'string',
      format: 'uri',
    },
    assertions: {
      type: 'array',
      minItems: 1,
      items: args.assertions,
      ...args.assertionsProps,
    },
  },
});
