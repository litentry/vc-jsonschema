import type { JSONSchema7 } from 'json-schema';

import { resolveGitHubPath } from '../helpers';

const claim: JSONSchema7 = {
  type: 'object',
  required: ['src', 'op', 'dst'],
  properties: {
    src: {
      type: 'string',
    },
    op: {
      type: 'string',
    },
    dst: {
      type: 'string',
    },
  },
};

const arrayOfClaims: JSONSchema7 = {
  type: 'array',
  minItems: 1,
  items: claim,
};

export const base: JSONSchema7 = {
  // draft-07 has the best support in ajv
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: resolveGitHubPath('0 base/1-0-0.json'),
  type: 'object',
  title: 'Base Verifiable Credential',
  description:
    'A generic Verifiable Credential schema for the Litentry Protocol.',
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
      type: 'integer',
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
        // before: createdTimestamp
        created: {
          type: 'integer',
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
    credentialSubject: {
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
          items: {
            type: 'boolean',
            minItems: 1,
          },
        },
        endpoint: {
          type: 'string',
          format: 'uri',
        },
        assertions: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            anyOf: [
              {
                type: 'object',
                required: ['and'],
                properties: {
                  and: arrayOfClaims,
                },
              },
              {
                type: 'object',
                required: ['or'],
                properties: {
                  or: arrayOfClaims,
                },
              },
            ],
          },
        },
      },
    },
  },
};
