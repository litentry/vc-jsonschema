import type { JSONSchema7 } from 'json-schema';

import { resolveGitHubPath } from '../helpers';

export const claim = (claim: {
  src: string;
  op: string;
  dst: string;
}): JSONSchema7 => ({
  type: 'object',
  required: ['src', 'op', 'dst'],
  properties: {
    src: {
      type: 'string',
      enum: [claim.src],
    },
    op: {
      type: 'string',
      enum: [claim.op],
    },
    dst: {
      type: 'string',
      enum: [claim.dst],
    },
  },
});

export const credentialSubjectWithAssertions = (
  assertionItems: JSONSchema7
): JSONSchema7 => ({
  title: 'Litentry Verifiable Credential Subject',
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
      items: assertionItems,
    },
  },
});

export const base: JSONSchema7 = {
  // draft-07 has the best support in ajv
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: resolveGitHubPath('0-base/1-0-0.json'),

  title: 'Base Verifiable Credential',
  description:
    'A generic Verifiable Credential schema for the Litentry Protocol.',

  type: 'object',
  required: [
    '@context',
    'issuer',
    'issuanceDate',
    'credentialSubject',
    'proof',
  ],
  properties: {
    '@context': {
      type: 'array',
      items: {
        type: 'string',
        format: 'uri',
      },
    },
    id: {
      type: 'string',
    },
    type: { type: 'array', items: { type: 'string' } },
    issuer: {
      type: 'object',
      required: ['id', 'name', 'mrenclave'],
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        mrenclave: {
          type: 'string',
        },
      },
    },
    issuanceDate: {
      type: 'string',
      format: 'date-time',
    },
    proof: {
      type: 'object',
      required: [
        'created',
        'type',
        'proofPurpose',
        'proofValue',
        'verificationMethod',
      ],
      properties: {
        created: {
          type: 'string',
          format: 'date-time',
        },
        type: {
          type: 'string',
        },
        proofPurpose: {
          type: 'string',
        },
        proofValue: {
          type: 'string',
        },
        verificationMethod: {
          type: 'string',
        },
      },
    },
    // We leave it as `any` for the base credential, as we don't have a good way to
    // validate the assertion schema. Specific assertion schemas should be validated
    // in their own schema.
    credentialSubject: credentialSubjectWithAssertions({
      type: 'object',
    }),
  },
};
