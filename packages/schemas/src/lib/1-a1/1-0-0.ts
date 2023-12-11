import { JSONSchema7 } from 'json-schema';

import { resolveGitHubPath } from '../helpers';
import { base, credentialSubjectWithAssertions, claim } from '../0-base/1-0-0';

export const a1: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('1-a1/1-0-0.json'),

  title: 'Basic Identity Verification',
  description:
    "You've identified at least one account/address in both Web2 and Web3.",

  properties: {
    ...base.properties,

    credentialSubject: credentialSubjectWithAssertions({
      title: 'A1 Credential Subject',
      type: 'object',
      required: ['and'],
      properties: {
        and: {
          type: 'array',
          minItems: 2,
          maxItems: 2,
          items: [
            claim({
              src: '$has_web2_account',
              op: '==',
              dst: 'true',
            }),
            claim({
              src: '$has_web3_account',
              op: '==',
              dst: 'true',
            }),
          ],
        },
      },
    }),
  },
};
